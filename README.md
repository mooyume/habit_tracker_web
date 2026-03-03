# 体重管理 App

一个基于 React Native + Expo 开发的体重管理应用，帮助用户追踪体重变化、设定目标并可视化进度。

## ✨ 功能特性

- 📊 **体重追踪**：记录每日体重，支持添加备注和快捷标签
- 🎯 **目标设定**：设置目标体重，实时查看进度
- 📈 **数据可视化**：周/月/年度体重趋势图表
- 📱 **友好引导**：首次使用时的全屏引导流程
- 🎨 **精美动画**：流畅的交互动画和庆祝效果
- 💾 **本地存储**：数据安全存储在本地

## 🛠️ 技术栈

- **框架**：React Native 0.84 + Expo 54
- **路由**：Expo Router 6
- **状态管理**：Zustand 5
- **动画**：React Native Reanimated 4
- **图表**：React Native SVG
- **日期处理**：Day.js
- **语言**：TypeScript

## 📋 前置要求

在开始之前，请确保你的开发环境已安装：

- **Node.js** 18.0 或更高版本
- **npm** 或 **yarn** 或 **pnpm**
- **Expo CLI**（可选，会自动安装）

### iOS 开发（可选）
- macOS 系统
- Xcode 14.0 或更高版本
- iOS 模拟器

### Android 开发（可选）
- Android Studio
- Android SDK
- Android 模拟器或真机

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd habit-tracker
```

### 2. 安装依赖

使用 npm：
```bash
npm install
```

使用 yarn：
```bash
yarn install
```

使用 pnpm：
```bash
pnpm install
```

### 3. 启动项目

#### 启动开发服务器

```bash
npm start
```

或者：
```bash
npx expo start
```

启动后会显示一个二维码和多个选项：

#### 在 iOS 模拟器中运行

```bash
npm run ios
```

或按 `i` 键（需要 macOS 和 Xcode）

#### 在 Android 模拟器中运行

```bash
npm run android
```

或按 `a` 键（需要 Android Studio）

#### 在真机上运行

1. 在手机上安装 **Expo Go** App：
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 扫描终端中显示的二维码

#### 在浏览器中运行

```bash
npm run web
```

或按 `w` 键

## 📁 项目结构

```
habit-tracker/
├── app/                      # 页面路由
│   ├── (tabs)/              # Tab 导航页面
│   │   ├── index.tsx        # 首页（体重管理）
│   │   ├── stats.tsx        # 统计页面
│   │   ├── calendar.tsx     # 日历页面
│   │   └── profile.tsx      # 个人中心
│   ├── onboarding.tsx       # 首次使用引导页
│   └── _layout.tsx          # 根布局
├── components/              # 组件
│   ├── weight/             # 体重相关组件
│   │   ├── WeightWelcomeCard.tsx      # 欢迎卡片
│   │   ├── WeightSetupWizard.tsx      # 设置向导
│   │   ├── WeightStatusCard.tsx       # 状态卡片
│   │   ├── WeightChart.tsx            # 图表
│   │   ├── WeightHistory.tsx          # 历史记录
│   │   └── ...
│   └── ui/                 # 通用 UI 组件
├── stores/                  # Zustand 状态管理
│   └── useWeightStore.ts   # 体重数据 Store
├── types/                   # TypeScript 类型定义
│   └── weight.ts           # 体重相关类型
├── constants/              # 常量配置
│   ├── Colors.ts          # 颜色主题
│   └── MockData.ts        # 模拟数据
└── utils/                  # 工具函数
    └── date.ts            # 日期处理

```

## 🎯 核心功能说明

### 首次使用引导

首次打开 App 时，会显示全屏引导页，引导用户完成：
1. 设置身高（100-250cm）
2. 记录当前体重（30-200kg）
3. 设置目标体重（30-200kg）

### 体重记录

- 点击右下角的 FAB 按钮快速记录体重
- 支持选择日期（不能选择未来日期）
- 可添加备注或选择快捷标签（早起、空腹、运动后等）

### 数据可视化

- **趋势图表**：查看周/月/年度体重变化趋势
- **统计卡片**：显示当前体重、最高/最低体重、BMI 等
- **历史记录**：查看所有体重记录，支持删除

## 🔧 开发说明

### 状态管理

项目使用 Zustand 进行状态管理，主要 Store：

- `useWeightStore`：管理体重记录、目标设定等数据

### 数据持久化

使用 `expo-secure-store` 进行本地数据存储，数据在 App 重启后保持。

### 动画

使用 `react-native-reanimated` 实现流畅的动画效果：
- 页面切换动画
- 列表项入场动画
- 庆祝动效（完成目标时）

## 📱 支持平台

- ✅ iOS 13.0+
- ✅ Android 5.0+
- ✅ Web（实验性支持）

## 🐛 常见问题

### 1. 安装依赖失败

尝试清除缓存后重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. iOS 模拟器无法启动

确保已安装 Xcode 并配置好命令行工具：
```bash
xcode-select --install
```

### 3. Android 模拟器无法启动

确保 Android Studio 已正确安装并配置好环境变量。

### 4. Metro bundler 报错

尝试重置缓存：
```bash
npx expo start -c
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发者**: 你的名字  
**版本**: 1.0.0  
**最后更新**: 2024
