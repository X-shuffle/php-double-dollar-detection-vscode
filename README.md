# PHP Double Dollar Detection

[![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=x-shuffle.php-double-dollar-detection-vscode)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![VSCode](https://img.shields.io/badge/VSCode-1.102.2+-blue.svg)](https://code.visualstudio.com/)

> 🔍 智能检测PHP文件中的连续美元符号，帮助开发者快速发现潜在的变量引用错误

## ✨ 特性

### 🎯 核心功能
- **智能检测**: 自动识别PHP文件中的连续美元符号（`$$`, `$$$`, `$$$$`等）
- **实时标记**: 在编辑器中用红色波浪线标出问题位置
- **悬停提示**: 鼠标悬停显示详细的警告信息
- **文件切换检测**: 切换到PHP文件时自动执行检测

### ⚡ 性能优化
- **防抖机制**: 300ms延迟避免频繁切换时的重复检测
- **快速预检查**: 先检查`$$`再执行正则匹配，跳过单`$`行
- **智能缓存**: 避免重复检测同一文件，提升性能
- **长度限制**: 跳过超过10个连续`$`的异常情况

### 🎨 用户体验
- **静默模式**: 自动检测时不显示弹窗，避免干扰编码
- **详细输出**: 在输出面板显示完整的检测结果
- **手动检测**: 支持通过命令面板手动执行检测
- **资源管理**: 自动清理资源，避免内存泄漏

## 🚀 快速开始

### 安装扩展

#### 方法一：从VSIX文件安装
1. 下载 `php-double-dollar-detection-vscode-0.0.0.vsix`
2. 在VSCode中按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的VSIX文件

#### 方法二：从源码安装
```bash
# 克隆仓库
git clone https://github.com/X-shuffle/php-double-dollar-detection-vscode.git

# 进入项目目录
cd php-double-dollar-detection-vscode

# 安装依赖（如果需要）
npm install

# 打包扩展
npm install -g vsce
vsce package

# 安装扩展
code --install-extension php-double-dollar-detection-vscode-0.0.0.vsix
```

### 使用方法

#### 自动检测
1. 在VSCode中打开任何PHP文件
2. 扩展会自动检测文件中的连续美元符号
3. 检测结果会以红色波浪线标记在文件中
4. 鼠标悬停在标记上查看详细信息

#### 手动检测
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板
2. 输入 "PHP: 检查$$符号"
3. 选择命令执行手动检测

#### 查看详细结果
1. 在VSCode底部面板中找到 "PHP Double Dollar Detection" 输出通道
2. 查看完整的检测结果，包括：
   - 📁 文件路径
   - ⏰ 检测时间
   - 🔢 发现的问题数量和位置
   - 💰 具体的连续美元符号内容

## 📋 检测规则

### 检测范围
- **文件类型**: `.php` 文件
- **检测内容**: 连续2个或更多美元符号
- **支持格式**: `$$`, `$$$`, `$$$$` 等任意数量的连续美元符号

### 检测示例

```php
<?php
// ✅ 正常情况（不会被检测）
$variable = "test";
$normal_var = "test";
$single = "test";

// ❌ 问题情况（会被检测）
$$another = "test";      // 检测到 $$
$$$third = "test";       // 检测到 $$$
$$$$fourth = "test";     // 检测到 $$$$

// 一行中多个问题
$normal = "test"; $$problem = "test"; $$$another = "test";

// 注释中的问题也会被检测
// $$commented_problem = "test";  // 检测到 $$

// 字符串中的问题
$message = "This has $$problem";  // 检测到 $$
?>
```

## ⚙️ 配置

扩展支持以下配置选项（在 `extension.js` 中修改）：

```javascript
const CONSTANTS = {
    PHP_EXTENSION: '.php',                    // PHP文件扩展名
    DEBOUNCE_DELAY: 300,                      // 防抖延迟时间（毫秒）
    MAX_DOLLAR_LENGTH: 10,                    // 最大连续美元符号长度
    OUTPUT_CHANNEL_NAME: 'PHP Double Dollar Detection'  // 输出通道名称
};
```

## 🛠️ 开发

### 项目结构
```
php-double-dollar-detection-vscode/
├── extension.js              # 主要扩展逻辑
├── package.json              # 扩展配置和命令定义
├── README.md                # 项目说明文档
├── LICENSE                  # 许可证文件
└── images/
    ├── icon.ico             # 扩展图标
    └── icon.svg             # SVG源文件
```

### 开发环境设置
```bash
# 克隆项目
git clone https://github.com/X-shuffle/php-double-dollar-detection-vscode.git
cd php-double-dollar-detection-vscode

# 启动调试模式
F5

# 重新加载窗口
Ctrl+Shift+P -> Developer: Reload Window

# 打包扩展
vsce package
```

### 主要文件说明
- **`extension.js`**: 包含所有核心功能实现
- **`package.json`**: 定义扩展元数据和命令
- **`README.md`**: 项目文档和使用说明

## 🐛 故障排除

### 常见问题

<details>
<summary><strong>Q: 扩展没有自动检测文件？</strong></summary>

**A**: 确保文件扩展名为 `.php`，并且是第一次打开该文件。如果问题持续，请检查：
- 文件是否保存为 `.php` 扩展名
- 是否在VSCode中正确识别为PHP文件
- 查看输出面板中是否有错误信息

</details>

<details>
<summary><strong>Q: 检测结果没有显示？</strong></summary>

**A**: 检查输出面板中的 "PHP Double Dollar Detection" 通道：
1. 按 `Ctrl+Shift+U` 打开输出面板
2. 在右上角下拉菜单中选择 "PHP Double Dollar Detection"
3. 查看是否有检测结果或错误信息

</details>

<details>
<summary><strong>Q: 性能问题？</strong></summary>

**A**: 扩展已优化性能，对于大文件可能需要几秒钟时间：
- 检查文件大小，超过1000行的文件可能需要更长时间
- 确保没有过多的连续美元符号（超过10个）
- 如果问题持续，可以禁用自动检测，只使用手动检测

</details>

### 调试模式
1. 按 `F5` 启动调试模式
2. 在调试控制台中查看日志信息
3. 检查是否有错误信息
4. 查看扩展主机输出

## 📝 更新日志

### [0.0.0] - 2025-01-XX

#### ✨ 新增功能
- 🎯 实现连续美元符号检测功能
- 🔍 支持检测任意数量的连续美元符号
- 📍 在文件中精确标记问题位置
- 💬 提供详细的悬停提示信息

#### ⚡ 性能优化
- 🚀 添加防抖机制，避免频繁检测
- ⚡ 快速预检查，跳过无关行
- 💾 智能缓存，避免重复检测
- 🛡️ 长度限制，处理异常情况

#### 🎨 用户体验
- 🔇 静默模式，避免干扰编码
- 📊 详细输出面板信息
- 🎛️ 手动检测命令
- 🧹 自动资源清理

## 🤝 贡献

我们欢迎所有形式的贡献！

### 贡献方式
- 🐛 [报告Bug](https://github.com/X-shuffle/php-double-dollar-detection-vscode/issues)
- 💡 [提出建议](https://github.com/X-shuffle/php-double-dollar-detection-vscode/issues)
- 🔧 [提交代码](https://github.com/X-shuffle/php-double-dollar-detection-vscode/pulls)
- 📖 [改进文档](https://github.com/X-shuffle/php-double-dollar-detection-vscode/pulls)

### 贡献指南
1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 遵循现有的代码风格
- 添加适当的注释
- 更新相关文档
- 测试新功能

## 📄 许可证

本项目采用 [ISC 许可证](LICENSE) - 查看 LICENSE 文件了解详情。

## 👨‍💻 作者

**X-shuffle**

- 🌐 GitHub: [@X-shuffle](https://github.com/X-shuffle)
- 📧 Email: [联系作者](mailto:your-email@example.com)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

特别感谢：
- [Visual Studio Code](https://code.visualstudio.com/) 团队提供的优秀平台
- [VSCode Extension API](https://code.visualstudio.com/api) 文档
- 所有测试和反馈的用户

---

<div align="center">

**⭐ 如果这个扩展对你有帮助，请给我们一个星标！**

[![GitHub stars](https://img.shields.io/github/stars/X-shuffle/php-double-dollar-detection-vscode?style=social)](https://github.com/X-shuffle/php-double-dollar-detection-vscode)

</div>

> **注意**: 此扩展仅用于检测连续美元符号，不会自动修复代码问题。请根据检测结果手动检查和修正代码。 