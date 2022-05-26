---
title: umi系列(四)
date: 2022/5/18
tags: umi
categories: 
- 前端工具
series: 基建
---


本篇主要讲述 umi 脚手架的npm script命令

## 参考

### 文档

- [Node.js v16.15.0 文档  -  child_process.html](http://nodejs.cn/api-v16/child_process.html)

## 前置知识

### $ 怎么来的
```js
// globals 函数增加了 global的$等等属性
import 'zx/globals';
```

### 模板字符串的函数调用
[参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E8%AF%AD%E6%B3%95)


## pnpm release


### 关于 umi-scripts 命令

#### 精妙的`workspace:*`
pnpm 的 workspace:* 可以轻松的将源码 以npm link的方式映射到 node_module 上，
极大地提高了开发和调试效率。
```js

  "scripts": {
    "release": "umi-scripts release",
  },


   "devDependencies": {
    "umi-scripts": "workspace:*",
  },
```

#### 使用 esno 执行 ts文件
每个命令将最终被使用 esno 执行 ts文件
```js
// scripts 就是 umi-scripts 包
// scripts\bin\umi-scripts.js
const spawn = sync(
  'esno',
  [scriptsPath, ...argv.slice(1)],
  {
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  }
)
```

### 通过readdirSync读取 packages 下的包

```js
export function getPkgs(opts?: { base?: string }): string[] {
  const base = opts?.base || PATHS.PACKAGES;
  return readdirSync(base).filter((dir) => {
    return !dir.startsWith('.') && existsSync(join(base, dir, 'package.json'));
  });
}
```

###  获取当前的branch
```js
import getGitRepoInfo from 'git-repo-info';
const { branch } = getGitRepoInfo();
```

### 查看是否有未git add 文件

```js
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');
```


### assert错误判断与退出程序的妙用

```js
// 关于logger.error
import chalk from '../compiled/chalk';

export const prefixes = {
  error: chalk.red('error') + ' -',
};
export function error(...message: any[]) {
  console.error(prefixes.error, ...message);
}

// 关于assert
export function assert(v: unknown, message: string) {
  if (!v) {
    logger.error(message);
    process.exit(1);
  }
}

// assert 使用
 const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');
```

### 判断你没有拉取最新的远程提交

```js
  await $`git fetch`;
  const gitStatus = (await $`git status --short --branch`).stdout.trim();
  assert(!gitStatus.includes('behind'), `git status is behind remote`);
```

### 判断npm源是否为要发布的源
```js
  // check npm registry
  logger.event('check npm registry');
  const registry = (await $`npm config get registry`).stdout.trim();
  assert(
    registry === 'https://registry.npmjs.org/',
    'npm registry is not https://registry.npmjs.org/',
  );
```
### (待研究)lerna判断packages下是否有改动
```js
  // check package changed
  logger.event('check package changed');
  const changed = (await $`lerna changed --loglevel error`).stdout.trim();
  assert(changed, `no package is changed`);
```

### 是否在npm包的owner上
```js
  // check npm ownership
  logger.event('check npm ownership');
  const whoami = (await $`npm whoami`).stdout.trim();
  await Promise.all(
    ['umi', '@umijs/core'].map(async (pkg) => {
      const owners = (await $`npm owner ls ${pkg}`).stdout
        .trim()
        .split('\n')
        .map((line) => {
          return line.split(' ')[0];
        });
      assert(owners.includes(whoami), `${pkg} is not owned by ${whoami}`);
    }),
  );
```

### 检测文件(目录)是否符合发布check:packageFiles
检测 packages 和 examples 下的包或示例，其下面的每个文件或目录是否符合约定的 npm publish 标准，
会查看 `pkgJson.files`

```js
  await $`npm run check:packageFiles`;
```


  // check package.json
  logger.event('check package.json info');


  // clean
  logger.event('clean');
  eachPkg(pkgs, ({ dir, name }) => {
    logger.info(`clean dist of ${name}`);
    rimraf.sync(join(dir, 'dist'));
  });

  // build packages
  logger.event('build packages');
  await $`npm run build:release`;
  await $`npm run build:extra`;
  await $`npm run build:client`;

  logger.event('check client code change');
  const isGitCleanAfterClientBuild = (
    await $`git status --porcelain`
  ).stdout.trim().length;
  assert(!isGitCleanAfterClientBuild, 'client code is updated');

  // generate changelog
  // TODO
  logger.event('generate changelog');

  // bump version
  logger.event('bump version');
  await $`lerna version --exact --no-commit-hooks --no-git-tag-version --no-push --loglevel error`;
  const version = require(PATHS.LERNA_CONFIG).version;
  let tag = 'latest';
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.')
  ) {
    tag = 'next';
  }
  if (version.includes('-canary.')) tag = 'canary';

  // update example versions
  logger.event('update example versions');
  const examplesDir = PATHS.EXAMPLES;
  const examples = fs.readdirSync(examplesDir).filter((dir) => {
    return (
      !dir.startsWith('.') && existsSync(join(examplesDir, dir, 'package.json'))
    );
  });
  examples.forEach((example) => {
    const pkg = require(join(examplesDir, example, 'package.json'));
    pkg.scripts['start'] = 'npm run dev';
    // change deps version
    setDepsVersion({
      pkg,
      version,
      deps: [
        'umi',
        '@umijs/max',
        '@umijs/plugins',
        '@umijs/bundler-vite',
        '@umijs/preset-vue',
      ],
      // for mfsu-independent example update dep version
      devDeps: ['@umijs/mfsu'],
    });
    delete pkg.version;
    fs.writeFileSync(
      join(examplesDir, example, 'package.json'),
      `${JSON.stringify(pkg, null, 2)}\n`,
    );
  });

  // update pnpm lockfile
  logger.event('update pnpm lockfile');
  $.verbose = false;
  await $`pnpm i`;
  $.verbose = true;

  // commit
  logger.event('commit');
  await $`git commit --all --message "release: ${version}"`;

  // git tag
  if (tag !== 'canary') {
    logger.event('git tag');
    await $`git tag v${version}`;
  }

  // git push
  logger.event('git push');
  await $`git push origin ${branch} --tags`;

  // npm publish
  logger.event('pnpm publish');
  $.verbose = false;
  const innerPkgs = pkgs.filter(
    // do not publish father
    (pkg) => !['umi', 'max', 'father'].includes(pkg),
  );

  // check 2fa config
  let otpArg: string[] = [];
  if (
    (await $`npm profile get "two-factor auth"`).toString().includes('writes')
  ) {
    let code = '';
    do {
      // get otp from user
      code = await question('This operation requires a one-time password: ');
      // generate arg for zx command
      // why use array? https://github.com/google/zx/blob/main/docs/quotes.md
      otpArg = ['--otp', code];
    } while (code.length !== 6);
  }

  await Promise.all(
    innerPkgs.map(async (pkg) => {
      await $`cd packages/${pkg} && npm publish --tag ${tag} ${otpArg}`;
      logger.info(`+ ${pkg}`);
    }),
  );
  await $`cd packages/umi && npm publish --tag ${tag} ${otpArg}`;
  logger.info(`+ umi`);
  await $`cd packages/max && npm publish --tag ${tag} ${otpArg}`;
  logger.info(`+ @umijs/max`);
  $.verbose = true;

  // sync tnpm
  logger.event('sync tnpm');
  $.verbose = false;
  await Promise.all(
    pkgs.map(async (pkg) => {
      const { name } = require(path.join(PATHS.PACKAGES, pkg, 'package.json'));
      logger.info(`sync ${name}`);
      await $`tnpm sync ${name}`;
    }),
  );
  $.verbose = true;
})();

function setDepsVersion(opts: {
  deps: string[];
  devDeps: string[];
  pkg: Record<string, any>;
  version: string;
}) {
  const { deps, devDeps, pkg, version } = opts;
  pkg.dependencies ||= {};
  deps.forEach((dep) => {
    if (pkg.dependencies[dep]) {
      pkg.dependencies[dep] = version;
    }
  });
  devDeps.forEach((dep) => {
    if (pkg?.devDependencies?.[dep]) {
      pkg.devDependencies[dep] = version;
    }
  });
  return pkg;
}

