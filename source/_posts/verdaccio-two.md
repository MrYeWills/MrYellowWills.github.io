---
title: verdaccio搭建npm私服(二)：示例
date: 2022/7/3
tags: verdaccio
categories: 
- 前端工具
series: verdaccio
---




## 使用

### 启动项目
这里以开发环境启动使用为例说明。

/Users/js/Desktop/work/workplace/verdaccio
`根目录下执行 yarn 安装所有依赖，`
因为是lerna项目，packages下所有的包都会安装。

/Users/js/Desktop/work/workplace/verdaccio/packages/docker-file
`目录下执行 npm run plugin:image`
打包生成 插件编译包，后面的 vadaccio 启动需要编译后的插件包：
```yml
volumes:
      - ./storage:/verdaccio/storage
      - ./config:/verdaccio/conf
      - ../docker-image/build:/verdaccio/plugins
```

/Users/js/Desktop/work/workplace/verdaccio/packages/docker-compose
`目录下执行` 
启动：
docker-compose -f test.yml up
停止：
docker-compose down  
查看列举：
docker-compose ps 列举运行的 compose；


`设置host`

127.0.0.1 xn.magichznpm.com


`启动登录页面、接口`
此登录页面为自定义的npm 登录页面，用于npm pubulish。
启动这个后， 执行 xnbz-login 命令。就会触发此页面。
todo 仓库在这里
npm start 即可启动。
此项目也是一个比较好的值得借鉴的后端接口开发工程化小模版。

如果要登出，可以执行 npm logout --registry http://xn.magichznpm.com/


/Users/js/Documents/nginx-config
`目录下执行：`
node index.js  生成 多个域名的server 配置 nginx文件；
docker-compose up


浏览器上访问：
http://xn.magichznpm.com/


浏览器上能访问后，首先第一步要做的就是登录，我们要用 自制的登录工具 @xnbz/verdaccio-tools 。
通过此工具登录后，redis就会手机登录名，等等，形成一个user用户列表。
这样的好吃就是 可以给后面的 对包进行赋权发布权限的操作。

### 登录
安装 npm i -g @xnbz/verdaccio-tools

然后使用 xnbz-login 进行登录。
此命令会在浏览器上打开一个登录窗口；
登录成功后，可以通过 redis-cli 查看登录信息

### redis
先安装 `npm i -g redis-cli`

```s
localhost:test xhkj$ rdcli
127.0.0.1:6379> keys *
1) @npm:@cache:allUser
2) @npm:@pkg:@xnbz/test 
3) @npm:@user:123aaa


# 删除
del key @npm:@cache:allUser
```


### 发布
在任意一个npm pkg 内，注意名字要定义为 @xnbz/ 开头， 执行 npm publish 即可发布成功。
并且要注意要发布的pkg包内加上这个 
```js
  "publishConfig": {
    "registry": "http://xn.magichznpm.com"
  }
```

### 一些说明
#### 未使用https
当前示例 未实现https，先以http来实现全部功能。

### FAQ
#### 值得注意的是 证书需要配置
值得注意的是 证书需要配置，否则报错，也可以去除这个证书配置，如果证书内容错误，启动nginx 也会报错，
证书配置目录： `/Users/js/Desktop/work/git/xnbz-verdaccio/nginx/.localssl`

#### nginx-config 启动403问题

这是因为没有创建文件：
`/Users/js/Documents/nginx-config/html/index.html`


## nginx-config讲解

### docker-compose
```yml
version: '3.7'

services:
  nginx:
    image: nginx:alpine
    ports:
    #将宿主机的80端口映射到docker创建的容器80端口
    #这样，就可以在宿主机 通过80端口直接访问docker容器80端口
      - 80:80
      - 443:443
    volumes:
      - ./aaa/:/www/aaa
      - ./bbb/:/www/bbb
      # 的配置文件重定向， ro 是只读的意思
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      # ngnix 其他的配置文件重定向，如server配置文件，被上面的配置文件所引用
      - ./nginx/vhost/:/etc/nginx/conf.d/
       # ngnix 的访问html重定向
      - ./html/:/etc/nginx/html/
       # ngnix 证书文件重定向，本例子使用http，因此可以忽略这个证书
      - ./.localssl/:/root/.localssl/
      - ./build.sh:/root/.sh
    container_name: nginx
    restart: always
```
### volumes的运用
我们都知道ngnix 的每个目录都有特定的功能，通过映射的方式，一个达到修改影响nginx的作用，第二个达到数据存储到宿主机，数据持久缓存的作用
```s
    volumes:
      # ngnix 其他的配置文件重定向，如server配置文件，被上面的配置文件所引用
      - ./nginx/vhost/:/etc/nginx/conf.d/
```

### nginx 配置文件 
`/Users/js/Documents/nginx-config/nginx/nginx.conf` 通过   `include ./conf.d/*.conf;`  集成了 `nginx/vhost/` 所有的 conf
主要做了以下事情：
监听了 域名 ：
localhost 
xn.magichznpm.com ：
```s
server {
    listen 80;
    server_name xn.magichznpm.com;
    location / {
      proxy_pass http://192.168.0.1:4873;
      # 下面这些配置是为了转发所有的请求信息，包括cookie 等等
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_redirect off;
    }
  }
```
等等；

### 其他
nginx 127.0.0.1的服务，监听 xn.magichznpm.com 域名，前提是host配置好 127.0.0.1 xn.magichznpm.com ，
将所有此域名下的请求转发至宿主机ip的 4873 端口。
```s
 listen 80;
    server_name xn.magichznpm.com;
    location / {
      proxy_pass http://192.168.0.1:4873;
      ...
    }
```
而4873端口，被 verdaccio 监听。


## docker-compose 配置

verdaccio 的配置在 `/Users/js/Desktop/work/workplace/verdaccio/packages/docker-compose/test.yml` 中。
### 这里的 node-network 是干嘛的？

为什么需要设置 
```s
  networks:
      node-network:
        ipv4_address: 192.2.0.3
```

这是因为 docker-compose 同时启动了两个镜像 verdaccio 与 redis， 这二者需要通信，就需要在同一个局域子网内，
同一个局域网，一般是ipv4的地址，前三位相同。
所以指定了二者相同的局域网地址：
```s
# /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-compose/test.yml
services:
  verdaccio:
    image: verdaccio/verdaccio:5.1.6
    container_name: verdaccio
    user: root
    networks:
      node-network:
        ipv4_address: 172.2.0.2
    ports:
      - 4873:4873
    expose:
      - 4873
  redis:
    image: redis:6.2.5
    container_name: redis
    networks:
      node-network:
        ipv4_address: 172.2.0.3
    restart: always
    ports:
      - 6379:6379
    expose:
      - 6379
```
然后在 verdaccio 的插件在node环境中跟redis通信，一般是这样通信的：
```j
const IORedis = require("ioredis")
this.redis = new IORedis(config)
```
其中的 config 就是 docker启动的redis容器的相关信息，从而让 `new IORedis(config)` 找到我们启动的redis。
verdaccio 容器中，通过配置redis相关信息，传给各个插件：
```s
# /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-compose/test.yml
aliases:
  # redis config
  - &redisConfig
      host: 172.2.0.3
      port: 6379
      globalNAME: NPM_OWNER_REDIS
      keyPrefix: '@npm:'

  xnbz-api:
    redisConfig: *redisConfig
    # dubbo 配置
    dubbo: *dubboConfig
```

### 启动verdaccio、redis
verdaccio 通过 docker 启动 verdaccio、redis；
docker 启动 verdaccio 镜像时，
默认启动 verdaccio 命令,因为docker启动verdaccio镜像时，会执行其指定的bash文件；
同时映射 4873 到 verdaccio 容器 4873中。

verdaccio 配置
/Users/js/Desktop/work/workplace/verdaccio/packages/docker-compose/test.yml
中配置了
    volumes:
      - ./storage:/verdaccio/storage
      - ./config:/verdaccio/conf
      - ../docker-image/build:/verdaccio/plugins
说明了 verdaccio 容器 的配置文件重映射到了 ./config 目录下，
因此找到 配置文件为：
/Users/js/Desktop/work/workplace/verdaccio/packages/docker-compose/config/config.yaml
>扩展：我们为什么知道上述目录的目的是什么，是因为在docker的配置文件中，注意不是docker-compose配置文件，我们设置了：
```s
# /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-compose/config/config.yaml
# path to a directory with all packages
storage: /verdaccio/storage
# path to a directory with plugins to include
plugins: /verdaccio/plugins
```


### 关于钉钉的配置：
```s
notify:
  dingtalk:
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    # package更新钉钉通知地址
    endpoint: https://oapend?access_token=0d9eec11119b1111111111d
    content: '{"msgtype": "link", "link": {"title": "{{name}}","text": "{{ publisher.name }}刚刚发布了{{name}} 去看看吧", "messageUrl": "http://xn.magichznpm.com/-/web/detail/{{name}}"}}'
```
关于 notify 相关知识，其中的content 是endpoint 定义的接口的入参，更多可以在其官网上查询。

verdaccio 的设计与 react vue umi webpack babel 等等 主流框架设计方式一样，都是通过hooks方式，
以上的 notify 其实就是一个hooks。

钉钉接口的巧妙之处就是，你按照它给的入参数类型和内容时，就会产生什么内容和效果的钉钉通知，
比如上述 你要求发送一个 link 类型的钉钉通知，此通知相当于a连接，点击会打开一个页面，
然后传入的text入参将作为提示信息，messageUrl将作为上述打开页面的url地址。


### 钉钉调试与curl

`-d` 是 post 请求的请求如参。
messageUrl 是钉钉机器人在群里发的消息，点击的时候，会跳转到这个url上
```s
curl -H "Content-Type: application/json" -X POST -d '{"msgtype": "link", "link": {"title": "一百万","text": "发钱了，你的工资到账一百万 ", "messageUrl": "http://xn.magichznpm.com/-/web/detail/@xnbz/test"}}' "https://oa111k.com/robot/send?access_to1en=6ec79e7aae3c8bc111c5936dd533531750f098e9"

```

一定要注意，返回数据的text，必须包含 钉钉机器人设计的安全验证的字，否则发送不成功，用curl 测试如下：
```js
{"errcode":310000,"errmsg":"description:关键词不匹配;solution:请联系群管理员查看此机器人的关键词，并在发送的信息中包含此关键词;"}
```

### 通过中间件生成后台接口
通过中间件的方式，让vadaccio启动时，同时生成后台接口，关于 middlewares 中间件可以查看官网。

```yml
middlewares:
  audit:
    enabled: true
  # xnbz-api配置
  xnbz-api:
    redisConfig: *redisConfig
    apiConfig: *apiConfig
    admin: *adminGroup
    # 登录地址(需要替换)
    loginUrl: *loginUrl
    # dubbo 配置
    dubbo: *dubboConfig
```


```js
// /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-file/plugins/xnbz-api/index.js
 const router = Router()
    router.get( // 登录跳转获取临时登录验证码
      '/code',
      async (req, res, next) => {
      
      }
    )
    router.post( // 通过临时验证码获取信息
      '/verify',
      jsonParser,
      async (req, res, next) => {
     
      }
    )
    router.post( // 初始化owner，发布成功后初始化
      '/initPublish',
      jsonParser,
      async (req, res, next) => {
      
      }
    )
```

### 关于如何写 middlewares 中间件
可以参考官网，下面有一些 社区已经实现的中间件，以及 verdaccio 官网github仓库下的 中间件，
或者直接将 官网中间件 或社区实现的中间件拷贝下来，修改。



### 扩展：统一验证登录的设计模式非常好，
任意一个接口或页面url请求，
如果没有页面token【接口的话，通过get 在浏览器上地址栏发送】，
就用统一登陆页面域名加上一个redict以及原来的接口或url，
然后登录后，登录页面设置二级域名下的cookie，
跳转到原来的接口或url，
此时无论是node、还是window 环境下都有能力获取到浏览器上的cookie。


### 登录工具

#### 客户端启动逻辑
```js
 forkChild.send({
          port,
          type: 'start'
        })
```
start 会启一个客户端电脑的 接口：
 `app.get('/verify/:code'`

并触发事件
```js
  process.send({
      type: 'server'
    })
```
server 事件会打开浏览器打开接口 http://xn.magichznpm.com/-/verdaccio/xnbz-api/code?port=50322 ，
其实就是请求 code 接口。
```js
  forkChild.on('message', async m => {
          if (m.type === 'server') {
            if (!openBrowsers(loginUrl)) {
              console.log(chalk.redBright(`请使用浏览器访问: ${loginUrl}`))
            }
          }
```

#### verdaccio插件服务端
xnbz-api 插件开发了 code 接口，在code接口中，做了cookie查询，如果没有cookie，则重定向到统一登陆页面，
统一登陆成功后，继续请求此code接口，此时就会有登陆的cookie了，
code接口中，
如果有cookie，则根据cookie值作为参数，发起dobbo接口请求，获取用户的用户信息，
然后将 cookie  用户信息 二者关联，产生一个关联的 uuid，
然后将此uuid作为入参code，重定向请求客户端启动的verify:code 接口： res.redirect(`http://127.0.0.1:${port}/verify/${code}`)
```js
/Users/js/Desktop/work/workplace/verdaccio/packages/docker-image/plugins/xnbz-api/index.js
 router.get( // 登录跳转获取临时登录验证码
      '/code',
      async (req, res, next) => {
        const acToken = req.cookies['ac-session-id']
        if (!acToken) {
          this._redirect(req, res)
        } else {
          const acTokenCache = this._acIdCache.get(acToken)
          const userToken = this._userInfoCache.get(acTokenCache)
          if (userToken) {
            this._redirectCode(acTokenCache, req, res)
          } else {
            const userEmpNo = await this.nzd.getUserEmpNo(acToken).catch(err => {
              this.logger.error({err: err?.message ?? err?.stack ?? err}, 'xnbz-api.code.getUserEmpNo: @{err}')
              return Promise.resolve(null)
            })
            if (!userEmpNo) {
              this.logger.error({acToken},"xnbz-api.code.getUserEmpNo.empNo: token => @{acToken}")
              this._redirect(req, res)
            } else {
              this._removeEmpNo(userEmpNo)
              const currentID = nanoid()
              this._acIdCache.set(acToken, currentID)
              this._userInfoCache.set(currentID, {
                empNo: userEmpNo
              })
              this._redirectCode(currentID, req, res)
            }
          }
        }
      }
    )
```

https://login.magichznpm.com/?redirectUrl=http://xn.magichznpm.com/-/verdaccio/xnbz-api/code?port=50322

#### 客户端 /verify/:code 接口
因为上面到接口是 res.redirect，因此浏览器现在的浏览地址变为 http://127.0.0.1:${port}/verify/${code} 。
客户端/verify/:code 接口接收到uuid后，
然后触发 code 事件。code事件会进行系列的验证以及同步、操作npm，等等工作，就放到下面讲。
等code事件处理完毕，将此uuid作为接口返回数据，显示在浏览器上。

```js
  app.get('/verify/:code' ,async (req, res) => {
    const code = req.params.code
    if (code) {
      process.send({
        type: 'code',
        code
      })
      res.send(`
        <p>验证码发送成功, 此窗口可关闭！</p>
        <script>
          setTimeout(window.close, 0);
        </script>
      `)
    } else {
      res.status(401).send({
        success: false,
        message: 'code为空'
      })
    }
  });
```

#### uuid密码设计以及npm登录
在code事件中，使用上面的uuid， 发送给 verify 接口，
根据uuid，读取到以前缓存的用户信息，
根据用户信息，请求dobbo接口，验证是否有这个员工，
验证成功后，将用户信息存储到redis上，并更新redis上的用户列表
然后操作npm原生的npm登陆命令，登陆密码使用md5进行混淆；
至此 整个登录过程完成。你可以通过 npm whoami 能获取登录信息了。
```js
// /Users/js/Desktop/work/workplace/verdaccio/packages/verdaccio-tools/lib/login.js
   if (m.type === 'code') {
      const resp = await checkCode({ code: m.code}, {
        registryConfig
      })
      if (resp.data && resp.data.key && resp.data.token) {
        forkChild.kill()
        await execPromise(`npm set ${resp.data.key} ${resp.data.token}`)
        const newLoginStatus = await getLoginStatus({
          registryConfig
        })
        loginTip(newLoginStatus)
        resolve(newLoginStatus)
      } else {
        if (!openBrowsers(loginUrl)) {
          console.log(chalk.redBright(`请使用浏览器访问: ${loginUrl}`))
        }
      }
    }

// /Users/js/Desktop/work/workplace/verdaccio/packages/verdaccio-tools/lib/utils.js
async function checkCode(data, props = {}) {
  const registryConfig = props.registryConfig || getConfig()
  const resp = await axios({
    url: registryConfig.verify,
    data,
    method: "POST"
  }).catch(err => {
    console.log(chalk.redBright(err))
    return Promise.resolve({
      isError: true
    })
  })
  return resp
}


// /Users/js/Desktop/work/workplace/verdaccio/packages/docker-image/plugins/xnbz-api/index.js
profile.loginCouch(userData.empNo, realCode, {
            registry: `http://127.0.0.1:${process.env.VERDACCIO_PORT ?? process.env.PORT}`
          })
```

#### 关于npm登陆密码：uuid
从上面可知，统一登陆后，生成一个uuid，这个uuid经过系列混淆后就变成了 npm 的登陆密码，
npm的登陆直接是 profile.loginCouch 实现的，
所以只要你是员工，那么你就能登陆到npm，
如果没有权限限制，你就有可以发布npm。
这是一个很棒的设计。
因为常规的，我们以为npm登录的密码就是我们浏览器登录页面的密码，实际上不是，而是自己生成的密码，
我们的密码其实与原始的页面登录密码毫无关系，只与你的用户名有关。
而原来的登录只是为了校验你是否为真正的员工。
这样可以做到了 逻辑分离， 统一登陆只管校验员工的事情，而真正的npm登陆，只用我们自己设计的npm登陆设计的密码。

#### 妙哉：uuid
参考《关于npm登陆密码：uuid》

## 关于publish

### 如何publish权限限制
在publish前，先查询钩子函数 allow_publish ，这个函数可以去官网查询，是否允许发布，
主要是查询你是不是超级用户，或者是不是可以发布的用户，或者要发布的包是否为白名单，
这些查询都是通过redis查询。
检测通过后，就publish，
成功后，执行成功后的事件，
```js
// /Users/js/Desktop/work/workplace/verdaccio/packages/docker-image/plugins/xnbz-htpasswd/htpasswd.js
async allow_publish(user, pkg, cb) {
    const userName = user.name
    const packageName = pkg.name
    const isAdmin = checkIsAdmin(userName, this.config.admin)
    const isWhite = checkWhitePackages(packageName, this.config.whitePackages)
    let canPublish = isAdmin
   ...
    if (canPublish) {
      this.logger.debug({name: userName}, '@{name} has been granted to publish')
      await this._owner.setCacheData(packageName, {
        user: userName,
        version: pkg.version,
        date: Date.now()
      })
      cb(null, true)
    } else {
      this.logger.error({name: userName}, '@{name} is not allowed to publish this package');
      const err = Error(`你没有发布权限，请联系管理员: ${(this.config.admin || []).join('/')}`)
      err.status = 403
      cb(err, false);
    }
  }
```
成功后的事件 除了发布钉钉通知外，将发布的包名作为入参，还请求了自己定义的接口 `/verdaccio/xnbz-api/initPublish`。

```s
# /Users/js/Desktop/work/workplace/verdaccio/packages/docker-compose/config/config.yaml
notify:
  dingtalk:
    ....
  self:
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    endpoint: http://127.0.0.1:4873/-/verdaccio/xnbz-api/initPublish
    content: '{"package": "{{name}}"}'
```
在initPublish接口中，主要是通过redis更新了 npm包的版本号，以及npm包的owner作者等。

```s
# /Users/js/Desktop/work/workplace/verdaccio/packages/docker-image/plugins/xnbz-api/index.js

 router.post( // 初始化owner
      '/initPublish',
      jsonParser,
      async (req, res, next) => {
        const _pkg = req.body.package
        if (_pkg) {
          const result = await this._owner.getCache(_pkg)
          const { user, version } = result
          const allPkgs = await this._owner.getAllKeysByType(0)
          if (user && !allPkgs.includes(_pkg)) {
            await this._owner.setPkgData(_pkg, {
              owners: [user],
              versions: {
                [version]: user
              }
            })
            this.logger.info({
              pkg: _pkg,
              owner: user
            }, 'newOwner init success: @{owner} 成为@{pkg}的owner!')
          } else {
            await this._owner.addVersionRecord(_pkg, {
              [version]: user
            })
          }
          this.logger.info({
            pkg: _pkg,
            publiser: user
          }, 'publish success: @{publiser} 发布@{pkg}!')
        }
        res.send('ok')
      }
    )
```

## 业务逻辑设计

### 自定义登录
为什么要自定义登录，
因为每个公司都有自定义登录；
套用公司的那一套登录，非常方便，非常容易推广；
如果要用公司那套登录，就要设置 权限管理的ui 等等，
好在verdaccio的ui主题页面，非常简单，其实就是一个首页，然后加上一个包的想起页面；

另外在自定义登录的时候，你可以在登录时，收集各种登录的信息，如用户信息，存入redis中，
这些用户信息，可以用作包发布权限管理。

因为包权限管理需要获取注册的所有用户信息。

另外一个 自定义登录时，用户不需要自己设置密码，如果公司有现有的登录，那么只需要对接公司的登录系统即可，登录成功通过cookie，node端自己生成密码。
此时就不用怕遗忘密码了。

### 包的权限管理
根据自定义登录 在redis写入的已登录（说明就是注册的）用户列表，
然后给某个包进行赋权，
赋权的数据存入 redis，
在 verdaccio 的 npm publish 前的钩子函数中，读取redis权限判断是否有发布权限。


## FAQ


### 为什么可以通过redis node终端，能查到数据库的数据；
redis数据库不是 docker 启动的吗，为什么能查到呢，
因为在宿主机的node端，执行 rdcli 命令，其实就是查询 宿主机的 docker 启动的 redis 接口。
其实也是与docker的redis通信获取数据库，并操作容器数据库。


### 这两个命令有什么区别
   "plugin:image": "cross-env VERDACCIO_IMAGE=true webpack",
    "plugin:dev": "cross-env VERDACCIO_DEVELOPMENT=true webpack",

如果要用 watch功能，就用plugin:dev，不用的话，用plugin:image 即可；




## 本次verdaccio改动或特色点
ui 主题【含权限改造】
dobbo接口
xnbz-login 代替 npm 命令行登陆和注册
redis作为数据库
storage 改为云盘，避免linux机器硬盘不够用，如果机器硬盘有80G，就不用担心此问题。
npm 上传、下载的插件改造

## 一些亮点

### node端npm的登录实现以及相关

#### 登录
我们可以使用命令行 npm adduser 或 npm login 进行登录。

nodejs中，我们可以使用 `profile.loginCouch` 进行登录。
```js
profile.loginCouch(userData.empNo, realCode, {
            registry: `http://127.0.0.1:${process.env.VERDACCIO_PORT ?? process.env.PORT}`
          })
```

#### 如何判断是否登录
```js
execPromise(`npm whoami --registry ${registryConfig.registry}`)

const { exec, execSync } = require('child_process')

async function execPromise(command, options = {encoding: 'utf8'}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

```

如果要登出，可以执行 npm logout --registry http://xn.magichznpm.com/


### 获取本机的ip
获取本机的ip，因为连的路由器，其路由地址可能随时变化；


### 127.0.0.1的运用给自己发请求
 值得注意的是，下面是部署时的情况 127的接口是部署上去后，给自己用。
 下面是npm publish之后，触发的钩子事件。
```yml
 self:
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    endpoint: http://127.0.0.1:4873/-/verdaccio/xnbz-api/initPublish
```

### dobbo接口请求

```js
const Dubbo = require('node-zookeeper-dubbo-plus')
const java = require('js-to-java')
 this.dubbo = new Dubbo(this.options)
 

  this.dubbo.GetUserData.getuseinfo(java.String(session)).then(res => {
          if (res?.data?.no) {
             resolve(res?.data)
          } else {
            reject(new Error(`getuseinfo: 获取信息失败`))
          }
        })
```

```yml
  # dubbo配置
  - &dubboConfig
      application:
        name: 'node-dubbo'
      registry: 'uu123.clddd.xnbzzz.net:2222'
      dubboVer: '2.7.6'
      root: 'dubbo'
      timeout: 20000
      dependencies:
        GetUserData:
          interface: 'com.nmagicbd.testcenter.testaaa.xxxx.user.GetUserDataService'
          version: '1.0.0'
          timeout: 6000
```


### redis的运用
参考上面《这里的 node-network 是干嘛的？》

### nginx的妙用
使用nginx 代理的域名后，可直接转发到对应的 服务器上，省去了要带接口名，而且配置可以转发cookie等。
```js
{
  'npm': `server {
    listen 80;
    server_name xn.magichznpm.com;
    location / {
      proxy_pass http://${LOCAL_IP}:4873;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_redirect off;
    }`,

  'login': `server {
    listen 80;
    server_name login.magichznpm.com;
    location / {
      proxy_pass http://${LOCAL_IP}:3090;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_redirect off;
    }
  }`
}
  ```
其实本例也提供了 https 证书的使用模式，只是注释了，以及缺乏一个证书，有兴趣可以通过node生成一个证书 配置成https模式。


### 密码加密的方式
这是verdaccio 官方网站插件 htpasswd 的一种密码加密方式，使用了node的内置模块 crypto 。
有兴趣 可直接看 verdaccio 官网 htpasswd 插件源码。

### storage放到云盘
默认的storage放在磁盘上，如果部署的机器磁盘容量少就会有问题，可通过使用存入云盘来解决这个问题。
在verdaccio官网的 storage 插件示例中，提供了社区实现的插件，可以模仿着写。

### compressing 获取 tgz 包
```js
// /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-file/scripts/tgz.js
const compressing = require('compressing')
const fs = require('fs')
const path = require('path')

const dirPath = path.resolve(__dirname, '..', 'lib')
const outputDir = path.resolve(__dirname, '..', 'output')
const outputFile = path.resolve(outputDir, 'lib.tgz')


compressing.tgz.compressDir(
  dirPath,
  outputFile
).then(() => {
  console.log(`压成功:${outputFile}`)
}).catch(error => {
  console.error(error)
})
```

### webpack copy 第三方包到指定目录
参考 const verdaccioUI = require('verdaccio-theme-ui-hz') 的复制。
```js
// /Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-file/webpack.config.js
const CopyPlugin = require('copy-webpack-plugin')

  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: selfDir,
          to: resolvePath(outPutConfig.dir, outPutConfig.themeDir)
        }
      ]
    }),
  ]
```

### Dockerfile 的生成
参考 `/Users/js/Desktop/work/git/xnbz-verdaccio/packages/docker-file/Dockerfile`
本例可生成 Dockerfile ，上传到docker.hub 后，在线上直接使用镜像。
