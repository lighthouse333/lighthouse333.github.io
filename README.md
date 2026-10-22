# lighthouse333 · 个人项目集

一个面向 GitHub Pages 的纯静态个人主页，收录 lighthouse333 的全部公开仓库。无需安装依赖或配置构建工具。

## 文件

- `index.html`：页面结构、个人介绍及搜索控件。
- `styles.css`：桌面与手机布局。
- `app.js`：项目展示、语言筛选、搜索、排序及 GitHub 数据更新。
- `site-data.js`：公开仓库数据快照和依据公开 README 编写的展示简介。
- `favicon.svg`：灯塔图标。
- `.nojekyll`：让 GitHub Pages 直接发布静态文件。

## 本地预览

在本目录运行 `python -m http.server 4173 --bind 127.0.0.1`，然后在浏览器打开 `http://127.0.0.1:4173`。

## 发布到 GitHub Pages

仓库名称为 `lighthouse333.github.io`。打开仓库 **Settings → Pages**，选择 **Deploy from a branch**，分支选择 `codex/portfolio`，目录选择 `/ (root)`。保存后，网站地址为 `https://lighthouse333.github.io/`。

## 更新项目

页面打开时先展示 `site-data.js` 中的公开仓库快照，再通过 GitHub 公共 API 获取当前全部公开仓库，包含 Fork 和已归档仓库；超过 100 个时会继续请求下一页。成功结果在浏览器缓存 10 分钟。网络或 API 暂时不可用时继续显示快照。

新增公开仓库会自动出现在页面中。可在 `site-data.js` 的 `PORTFOLIO_DETAILS` 中设置中文介绍、标签与图标；未设置的仓库使用 GitHub 简介。这个文件中的展示文案不会修改原仓库的简介。`arduino_reaction` 的公开 README 暂未介绍具体功能，页面不推测其用途。

托管仓库本身也会列入全部公开仓库。页面不使用登录凭据、分析服务、外部字体或第三方 JavaScript 库。

## 内容来源

仓库信息来自 GitHub 公开 API；补充简介来自各仓库公开 README。页面中的灯塔为原创 SVG 插画，并非项目截图。项目用途以对应源码与文档为准。
