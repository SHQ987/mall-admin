# mall-admin

基于 Vue3 + TypeScript 的企业级中后台管理系统，从零搭建，覆盖登录鉴权、动态路由、RBAC 权限、商品/品牌/属性管理、数据可视化大屏等完整业务链路。

## 技术栈

> Vue3 + TypeScript + Vite + Vue Router4 + Pinia + Element Plus + Axios + ECharts + Sass

## 特性

- 工程化基建：ESLint / Prettier / StyleLint / Husky / CommitLint 全链路规范
- 登录鉴权 + 路由守卫 + 进度条；基于 Pinia 与动态路由的 RBAC 权限
- 商品域完整模块：品牌管理、平台属性、SPU、SKU
- 权限域模块：用户管理、角色管理、菜单权限（树形）
- 首页仪表盘 + 暗黑模式 / 主题色切换
- ECharts 数据可视化大屏
- Axios 二次封装
- 数据由 Mock 驱动，无需后端即可完整运行

## 环境要求

- Node.js >= 18
- 包管理器：pnpm（或 npm / yarn）

## 快速开始

```bash
pnpm install
pnpm dev        # 本地开发，默认 http://localhost:5173
```

演示账号：用户名 `admin`，密码 `111111`（Mock 校验，任意非空密码也可通过）。

```bash
pnpm build      # 生产构建，产物在 dist/
pnpm preview    # 预览构建产物
```

## 目录结构

```
src/
├── api/            # 统一 API 层（user / acl / product）
├── components/     # 公共组件（SvgIcon / Pagination / CategorySelector / 按钮权限指令）
├── directives/     # v-has 按钮权限指令
├── layout/         # 整体布局（Logo / Menu 递归 / Tabbar / 主内容区）
├── mock/           # Mock 接口（vite-plugin-mock）
├── router/         # 常量路由 + 异步路由 + 全局守卫
├── store/          # Pinia（user / setting）
├── styles/         # 全局样式、SCSS 变量与混入
├── utils/          # request(Axios) / token 工具
└── views/          # 业务页面（login / home / product / acl / screen）
```

## 对接真实后端

默认走 Mock。如需对接真实后端，修改 `.env.development` 中的 `VITE_API_BASE_URL` 与 `VITE_USE_MOCK` 即可，API 层已按标准 REST 约定封装，无需改动业务代码。

## License

MIT
