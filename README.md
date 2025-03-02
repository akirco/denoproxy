# 🌐 denoproxy

## Reference
- 灵感来源[pwh-pwh/DenoProxy](https://github.com/pwh-pwh/DenoProxy)

> 之前一直在使用cloudflare worker，但使用起来有点费劲，想重写这个的原因是一个视频网站的api原先可以直接访问，无奈突然不行了，想到之前看见过这个，ping了一下200多毫秒还行，每月1000000次请求，100GB出站流量，挺香的，但是原项目使用起来有点局限，所以重写了。

欢迎使用 **denoproxy**！🚀
这是一个轻量级的代理服务，用于将请求转发到指定的目标 URL。

## 📦 特性

- **路由管理**: 通过 Web UI 界面轻松管理代理路由
- **多路由支持**: 支持配置多个代理路由，每个路由可以指向不同的目标
- **安全认证**: 简易的用户名和密码认证
- **环境变量**: 支持通过环境变量配置用户名、密码等

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/akirco/denoproxy.git
cd denoproxy
```

### 2. 运行代理服务器

确保已安装 **Deno**。如果没有安装，可以从 [deno.land](https://deno.land/) 获取并安装。
然后，使用以下命令运行代理服务器：

```bash
deno task dev
```

此命令会启动代理服务器并监听 `8000` 端口。

### 3. 部署应用

有两种方式实现部署

1. 本地部署
```bash
deno install -A jsr:@deno/deployctl --global
cd denoproxy && deployctl deploy
```
2. deno控制台

https://dash.deno.com，链接Github选择项目部署即可


### 4. 使用代理服务器

#### 🌍 设置代理 URL

`ui界面操作即可`


#### 🔄 使用代理

设置代理后，只需访问任何以 `${host}/path` 开头的路径，请求将会转发到指定的目标 URL。

例如：

```bash
path: /openai

target: https://api.openai.com

proxy_url: `${host}/openai`

curl https://example.deno.dev/openai xxxx
```



## 🛠️ 使用的技术

- **Deno**: 一个用于 JavaScript 和 TypeScript 的安全运行时。
- **HTTP 服务器**: Deno 的原生 HTTP 服务器处理请求。

## 🔑 权限

服务器需要以下权限：

- **`--allow-net`**: 允许网络访问（用于转发请求）。
- **`--unstable-kv`**: 启用不稳定的 Deno API（用于使用 `Deno.openKv()`）。

## 🤝 贡献

欢迎随时 fork 本仓库、提交问题或 Pull Request。

## 🙏 致谢


感谢以下项目和资源：
 - [Deno](https://deno.land/)
 - [Deno dashboard](https://dash.deno.com/)
 - [pwh-pwh/DenoProxy](https://github.com/pwh-pwh/DenoProxy)
 - [Favicon Generators](https://favicon.io/)

## 📜 许可证

本项目使用 [MIT 许可证](LICENSE) 进行授权。

