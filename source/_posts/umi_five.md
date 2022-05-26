---
title: umi系列(五)
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

## 待研究

如下 `-- --vite` 的第一个多余的 -- 是什么意思？
```
pnpm dev -- --vite
```

参考《 pnpm install 》

## 前置知识

### $ 怎么来的

## pnpm install

### 一次给所有的packages、 example安装依赖
在umi 根目录下，执行 pnpm install，
会给所有的 packages、 example 下的包或项目 进行 node module 的安装。

todo
目前不知道与什么有关，大概率是 pnpm-workspace.yaml 原因吧：
```yaml
packages:
  - 'packages/*'
  - 'examples/*'
  - 'scripts'
```


## umi 如何与 NavLink 或 doc组件结合

md 独立使用-mfsu

经过loader编译后变成：
```js
/*@jsxRuntime automatic @jsxImportSource react*/
import {Message} from 'umi';

import { useEffect } from 'react';

```

最终打包后变成：
```js
// dist\umi.js
{
  /***/ "./.umi/exports.ts":
/*!*************************!*\
  !*** ./.umi/exports.ts ***!
  \*************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApplyPluginsType": function() { return /* reexport safe */ D_git_umi_umi_next_packages_umi_client_client_plugin_js__WEBPACK_IMPORTED_MODULE_6__.ApplyPluginsType; },
/* harmony export */   "FeatureItem": function() { return /* reexport safe */ D_git_umi_umi_next_umi_plugin_docs__WEBPACK_IMPORTED_MODULE_8__.FeatureItem; },
/* harmony export */   "Features": function() { return /* reexport safe */ D_git_umi_umi_next_umi_plugin_docs__WEBPACK_IMPORTED_MODULE_8__.Features; },
/* harmony export */   "Hero": function() { return /* reexport safe */ D_git_umi_umi_next_umi_plugin_docs__WEBPACK_IMPORTED_MODULE_8__.Hero; },
/* harmony export */   "Link": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_1__.Link; },


// ----- 这个位子 ---------------
/* harmony export */   "Message": function() { return /* reexport safe */ D_git_umi_umi_next_umi_plugin_docs__WEBPACK_IMPORTED_MODULE_8__.Message; },
/* harmony export */   "NavLink": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_1__.NavLink; },
/* harmony export */   "Navigate": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_2__.Navigate; },
/* harmony export */   "Outlet": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_2__.Outlet; },
/* harmony export */   "PluginManager": function() { return /* reexport safe */ D_git_umi_umi_next_packages_umi_client_client_plugin_js__WEBPACK_IMPORTED_MODULE_6__.PluginManager; },
/* harmony export */   "createBrowserHistory": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_0__.createBrowserHistory; },
/* harmony export */   "createHashHistory": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_0__.createHashHistory; },
/* harmony export */   "createHistory": function() { return /* reexport safe */ _core_history__WEBPACK_IMPORTED_MODULE_7__.createHistory; },
/* harmony export */   "createMemoryHistory": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_0__.createMemoryHistory; },
/* harmony export */   "useSearchParams": function() { return /* reexport safe */ D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_1__.useSearchParams; }
/* harmony export */ });
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./packages/renderer-react */ "./node_modules/.pnpm/history@5.3.0/node_modules/history/index.js");
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./packages/renderer-react */ "./node_modules/.pnpm/react-router-dom@6.3.0_react-dom@18.1.0+react@18.1.0/node_modules/react-router-dom/index.js");
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./packages/renderer-react */ "./node_modules/.pnpm/react-router@6.3.0_react@18.1.0/node_modules/react-router/index.js");
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./packages/renderer-react */ "./packages/renderer-react/dist/appContext.js");
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./packages/renderer-react */ "./packages/renderer-react/dist/browser.js");
/* harmony import */ var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./packages/renderer-react */ "./packages/renderer-react/dist/routeContext.js");
/* harmony import */ var D_git_umi_umi_next_packages_umi_client_client_plugin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./packages/umi/client/client/plugin.js */ "./packages/umi/client/client/plugin.js");
/* harmony import */ var _core_history__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/history */ "./.umi/core/history.ts");
/* harmony import */ var D_git_umi_umi_next_umi_plugin_docs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./.umi/plugin-docs */ "./.umi/plugin-docs/index.ts");
/* harmony import */ var D_git_umi_umi_next_umi_plugin_terminal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./.umi/plugin-terminal */ "./.umi/plugin-terminal/index.ts");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.5_4029b931217d08c7bbf9a21bb093788b/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.5_4029b931217d08c7bbf9a21bb093788b/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/.pnpm/react-refresh@0.12.0/node_modules/react-refresh/runtime.js */ "./node_modules/.pnpm/react-refresh@0.12.0/node_modules/react-refresh/runtime.js");

// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
// @umijs/renderer-*
 // umi/client/client/plugin


 // plugins


 // plugins types.d.ts

var $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
var $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		var errorOverlay;
		if (true) {
			errorOverlay = false;
		}
		var testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ }),
}

```

同时 
NavLink
```js
var D_git_umi_umi_next_packages_renderer_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./packages/renderer-react */ "./node_modules/.pnpm/react-router-dom@6.3.0_react-dom@18.1.0+react@18.1.0/node_modules/react-router-dom/index.js");
```

而这与这个有关：
```js
// packages\renderer-react\src\index.ts
export {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  History,
} from 'history';
export {
  createSearchParams,
  Link,
  matchPath,
  matchRoutes,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useOutlet,
  useParams,
  useResolvedPath,
  useRoutes,
  useSearchParams,
} from 'react-router-dom';
export { useAppData } from './appContext';
export { renderClient } from './browser';
export { useRouteData } from './routeContext';

```


而这与 这里有关：
```js
//  packages\preset-umi\src\features\tmpFiles\tmpFiles.ts

// 注意 这个 exports.ts  关键文件 -----------------------
// 注意 这个 exports.ts  关键文件 -----------------------
// 注意 这个 exports.ts  关键文件 -----------------------



 // Generate @@/exports.ts
  api.register({
    key: 'onGenerateFiles',
    fn: async () => {
      const rendererPath = winPath(
        await api.applyPlugins({
          key: 'modifyRendererPath',
          initialValue: dirname(
            require.resolve('@umijs/renderer-react/package.json'),
          ),
        }),
      );

      const exports = [];
      const exportMembers = ['default'];
      // @umijs/renderer-react
      exports.push('// @umijs/renderer-*');

      exports.push(
        `export { ${(
          await getExportsAndCheck({
            path: join(rendererPath, 'dist/index.js'),
            exportMembers,
          })
        ).join(', ')} } from '${rendererPath}';`,
      );
      // umi/client/client/plugin
      exports.push('// umi/client/client/plugin');
      const umiDir = process.env.UMI_DIR!;
      const umiPluginPath = winPath(join(umiDir, 'client/client/plugin.js'));
      exports.push(
        `export { ${(
          await getExportsAndCheck({
            path: umiPluginPath,
            exportMembers,
          })
        ).join(', ')} } from '${umiPluginPath}';`,
      );
      // @@/core/history.ts
      exports.push(`export { history, createHistory } from './core/history';`);
      checkMembers({
        members: ['history', 'createHistory'],
        exportMembers,
        path: '@@/core/history.ts',
      });
      // @@/core/terminal.ts
      if (api.service.config.terminal !== false) {
        exports.push(`export { terminal } from './core/terminal';`);
        checkMembers({
          members: ['terminal'],
          exportMembers,
          path: '@@/core/terminal.ts',
        });
      }
      // plugins
      exports.push('// plugins');
      const plugins = readdirSync(api.paths.absTmpPath).filter((file) => {
        if (
          file.startsWith('plugin-') &&
          (existsSync(join(api.paths.absTmpPath, file, 'index.ts')) ||
            existsSync(join(api.paths.absTmpPath, file, 'index.tsx')))
        ) {
          return true;
        }
      });
      for (const plugin of plugins) {
        let file: string;
        if (existsSync(join(api.paths.absTmpPath, plugin, 'index.ts'))) {
          file = join(api.paths.absTmpPath, plugin, 'index.ts');
        }
        if (existsSync(join(api.paths.absTmpPath, plugin, 'index.tsx'))) {
          file = join(api.paths.absTmpPath, plugin, 'index.tsx');
        }
        const pluginExports = await getExportsAndCheck({
          path: file!,
          exportMembers,
        });
        if (pluginExports.length) {
          exports.push(
            `export { ${pluginExports.join(', ')} } from '${winPath(
              join(api.paths.absTmpPath, plugin),
            )}';`,
          );
        }
      }
      // plugins types.ts
      exports.push('// plugins types.d.ts');
      for (const plugin of plugins) {
        const file = winPath(join(api.paths.absTmpPath, plugin, 'types.d.ts'));
        if (existsSync(file)) {
          // 带 .ts 后缀的声明文件 会导致声明失效
          const noSuffixFile = file.replace(/\.ts$/, '');
          exports.push(`export * from '${noSuffixFile}';`);
        }
      }
      api.writeTmpFile({
        noPluginDir: true,
        path: 'exports.ts',
        content: exports.join('\n'),
      });
    },
    stage: Infinity,
  });
```


所以涉及

<!-- packages\preset-umi\src\features\tmpFiles\tmpFiles.ts
packages\renderer-react\src\index.ts -->