---
title: verdaccio搭建npm私服(一)：基础知识
date: 2022/7/3
tags: verdaccio
categories: 
- verdaccio
---

## 搭建npm私服选型

有三种方式：
- nexus
搭建好后，样子如下：
{% img url_for /image/verda/ne.png %}
- cnpm
- verdaccio

上述两种方式，配置较多，推荐直接使用 verdaccio，真正做到零配置，即可使用：

## 安装使用

### 安装启动
```s
npm install -g verdaccio

#  启动
verdaccio
 info --- Creating default config file in C:\Users\YeWills\.config\verdaccio\config.yaml #这个是配置文件
 warn --- config file  - C:\Users\YeWills\.config\verdaccio\config.yaml
 info --- plugin successfully loaded: verdaccio-htpasswd
 info --- plugin successfully loaded: verdaccio-audit

```

### 配置文件
参考附录，其文件路径 参考上面。

### 配置讲解
```yaml
packages:
# 这个可以定义为自己的私包，比如 '@hz/*'
  '@*/*':
    # scoped packages
    access: $all
```
```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    # 是否开启用户注册， -1代表禁用注册用户； 大于0表示允许注册用户，改值表示注册用户的个数
    #  默认注册用户没有限制，即任何人都可以通过 npm adduser 命令注册用户，实际开发中，这种情况是不允许出现
    max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    # algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    # rounds: 10
```

```yaml
# 上游仓库列表，当node私库找不到用户要安装的包时，就会继续往上游仓库拉取
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

```
更多参考：
{% img url_for /image/verda/up.png %}
{% img url_for /image/verda/up2.png %}
{% img url_for /image/verda/up3.png %}

关于 `$all` `$authenticated` 等：
{% img url_for /image/verda/up4.png %}

最后为了让外网都可以访问，注意将 listen 改为这个：
```yaml
listen: 0.0.0.0:4873
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
```

### 其他
#### 删除包
npm unpublish --force xxx 或 npm unpublish --force xxx@xx.0.0

#### 注册用户
npm adduser

#### 登录npm
npm login

#### 发布包
直接 npm publish ，会提示你npm adderuser ，此时随便注册用户还有邮箱以及密码，就可以发布了。

#### 使用pm2管理进程

pm2 用来管理 Verdaccio 进程，可以了解用起来，也可以不用。

## 参考
[npm私服搭建与应用](https://www.bilibili.com/video/BV1A34y147Hb/?spm_id_from=autoNext&vd_source=49cfdfde4ef881bfb8dd4fd5921f4b42)

## 附录
### Verdaccio 配置：
```yaml
#
# This is the default configuration file. It allows all users to do anything,
# please read carefully the documentation and best practices to
# improve security.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/5.x/conf
#
# Read about the best practices
# https://verdaccio.org/docs/best

# path to a directory with all packages
storage: ./storage
# path to a directory with plugins to include
plugins: ./plugins

# https://verdaccio.org/docs/webui
web:
  title: Verdaccio
  # comment out to disable gravatar support
  # gravatar: false
  # by default packages are ordercer ascendant (asc|desc)
  # sort_packages: asc
  # convert your UI to the dark side
  # darkMode: true
  # html_cache: true
  # by default all features are displayed
  # login: true
  # showInfo: true
  # showSettings: true
  # In combination with darkMode you can force specific theme
  # showThemeSwitch: true
  # showFooter: true
  # showSearch: true
  # showRaw: true
  # showDownloadTarball: true
  #  HTML tags injected after manifest <scripts/>
  # scriptsBodyAfter:
  #    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
  #  HTML tags injected before ends </head>
  #  metaScripts:
  #    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
  #    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
  #    - '<meta name="robots" content="noindex" />'
  #  HTML tags injected first child at <body/>
  #  bodyBefore:
  #    - '<div id="myId">html before webpack scripts</div>'
  #  Public path for template manifest scripts (only manifest)
  #  publicPath: http://somedomain.org/

# https://verdaccio.org/docs/configuration#authentication
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    # max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    # algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    # rounds: 10

# https://verdaccio.org/docs/configuration#uplinks
# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

# Learn how to protect your packages
# https://verdaccio.org/docs/protect-your-dependencies/
# https://verdaccio.org/docs/configuration#packages
packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish/publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated
    unpublish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# To improve your security configuration and  avoid dependency confusion
# consider removing the proxy property for private packages
# https://verdaccio.org/docs/best#remove-proxy-to-increase-security-at-private-packages

# https://verdaccio.org/docs/configuration#server
# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
# WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
server:
  keepAliveTimeout: 60

# https://verdaccio.org/docs/configuration#offline-publish
# publish:
#   allow_offline: false

# https://verdaccio.org/docs/configuration#url-prefix
# url_prefix: /verdaccio/
# VERDACCIO_PUBLIC_URL='https://somedomain.org';
# url_prefix: '/my_prefix'
# // url -> https://somedomain.org/my_prefix/
# VERDACCIO_PUBLIC_URL='https://somedomain.org';
# url_prefix: '/'
# // url -> https://somedomain.org/
# VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
# url_prefix: '/second_prefix'
# // url -> https://somedomain.org/second_prefix/'

# https://verdaccio.org/docs/configuration#security
# security:
#   api:
#     legacy: true
#     jwt:
#       sign:
#         expiresIn: 29d
#       verify:
#         someProp: [value]
#    web:
#      sign:
#        expiresIn: 1h # 1 hour by default
#      verify:
#         someProp: [value]

# https://verdaccio.org/docs/configuration#user-rate-limit
# userRateLimit:
#   windowMs: 50000
#   max: 1000

# https://verdaccio.org/docs/configuration#max-body-size
# max_body_size: 10mb

# https://verdaccio.org/docs/configuration#listen-port
# listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket

# The HTTPS configuration is useful if you do not consider use a HTTP Proxy
# https://verdaccio.org/docs/configuration#https
# https:
#   key: ./path/verdaccio-key.pem
#   cert: ./path/verdaccio-cert.pem
#   ca: ./path/verdaccio-csr.pem

# https://verdaccio.org/docs/configuration#proxy
# http_proxy: http://something.local/
# https_proxy: https://something.local/

# https://verdaccio.org/docs/configuration#notifications
# notify:
#   method: POST
#   headers: [{ "Content-Type": "application/json" }]
#   endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
#   content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'

middlewares:
  audit:
    enabled: true

# https://verdaccio.org/docs/logger
# log settings
logs: { type: stdout, format: pretty, level: http }
#experiments:
#  # support for npm token command
#  token: false
#  # disable writing body size to logs, read more on ticket 1912
#  bytesin_off: false
#  # enable tarball URL redirect for hosting tarball with a different server, the tarball_url_redirect can be a template string
#  tarball_url_redirect: 'https://mycdn.com/verdaccio/${packageName}/${filename}'
#  # the tarball_url_redirect can be a function, takes packageName and filename and returns the url, when working with a js configuration file
#  tarball_url_redirect(packageName, filename) {
#    const signedUrl = // generate a signed url
#    return signedUrl;
#  }

# translate your registry, api i18n not available yet
# i18n:
# list of the available translations https://github.com/verdaccio/verdaccio/blob/master/packages/plugins/ui-theme/src/i18n/ABOUT_TRANSLATIONS.md
#   web: en-US
```
