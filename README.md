# PHP Double Dollar Detection VSCode Extension

一个用于检测PHP文件中连续美元符号的VSCode扩展，帮助开发者快速发现潜在的变量引用错误。

## 🚀 功能特性

### 核心功能
- **连续美元符号检测**: 自动检测PHP文件中的连续美元符号（`$$`, `$$$`, `$$$$`等）
- **智能文件切换**: 当切换到PHP文件时自动执行检测
- **可视化标记**: 在文件中用红色波浪线标出连续美元符号
- **实时反馈**: 鼠标悬停时显示详细的警告信息

### 性能优化
- **防抖机制**: 300ms延迟避免频繁切换时的重复检测
- **快速预检查**: 先检查`$$`再执行正则匹配，跳过单`$`行
- **智能缓存**: 避免重复检测同一文件，提升性能
- **长度限制**: 跳过超过10个连续`$`的异常情况

### 用户体验
- **静默模式**: 自动检测时不显示弹窗，避免干扰编码
- **详细输出**: 在输出面板显示完整的检测结果和位置信息
- **手动检测**: 支持通过命令面板手动执行检测
- **资源管理**: 自动清理资源，避免内存泄漏

## 📦 安装

### 从源码安装
1. 克隆或下载此仓库
2. 在VSCode中打开项目文件夹
3. 按 `F5` 启动调试模式，或使用 `Ctrl+Shift+P` 运行 "Developer: Reload Window"

### 打包安装
```bash
# 安装vsce工具
npm install -g vsce

# 打包扩展
vsce package

# 安装生成的.vsix文件
code --install-extension php-double-dollar-detection-vscode-0.0.0.vsix
```

## 🎯 使用方法

### 自动检测
1. 在VSCode中打开任何PHP文件
2. 扩展会自动检测文件中的连续美元符号
3. 检测结果会以红色波浪线标记在文件中
4. 鼠标悬停在标记上查看详细信息

### 手动检测
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板
2. 输入 "PHP: 检查$$符号"
3. 选择命令执行手动检测

### 查看详细结果
1. 在VSCode底部面板中找到 "PHP Double Dollar Detection" 输出通道
2. 查看完整的检测结果，包括：
   - 文件路径
   - 检测时间
   - 发现的问题数量和位置
   - 具体的连续美元符号内容

## 🔧 配置选项

扩展支持以下常量配置（在 `extension.js` 中修改）：

```javascript
const CONSTANTS = {
    PHP_EXTENSION: '.php',        // PHP文件扩展名
    DEBOUNCE_DELAY: 300,          // 防抖延迟时间（毫秒）
    MAX_DOLLAR_LENGTH: 10,        // 最大连续美元符号长度
    OUTPUT_CHANNEL_NAME: 'PHP Double Dollar Detection'  // 输出通道名称
};
```

## 📋 检测规则

### 检测范围
- 文件类型：`.php` 文件
- 检测内容：连续2个或更多美元符号
- 支持格式：`$$`, `$$$`, `$$$$` 等任意数量的连续美元符号

### 检测示例
```php
// 会被检测的情况
$variable = "test";
$$another = "test";      // 检测到 $$
$$$third = "test";       // 检测到 $$$
$$$$fourth = "test";     // 检测到 $$$$

// 不会被检测的情况
$single = "test";        // 单个$符号
$normal_var = "test";    // 正常的变量名
```

## 🛠️ 开发

### 项目结构
```
php-double-dollar-detection-vscode/
├── extension.js          # 主要扩展逻辑
├── package.json          # 扩展配置和命令定义
└── README.md            # 项目说明文档
```

### 主要文件说明
- **extension.js**: 包含所有核心功能实现
- **package.json**: 定义扩展元数据和命令
- **README.md**: 项目文档和使用说明

### 开发命令
```bash
# 启动调试模式
F5

# 重新加载窗口
Ctrl+Shift+P -> Developer: Reload Window

# 打包扩展
vsce package
```

## 🐛 故障排除

### 常见问题

**Q: 扩展没有自动检测文件？**
A: 确保文件扩展名为 `.php`，并且是第一次打开该文件。

**Q: 检测结果没有显示？**
A: 检查输出面板中的 "PHP Double Dollar Detection" 通道。

**Q: 性能问题？**
A: 扩展已优化性能，对于大文件可能需要几秒钟时间。

### 调试模式
1. 按 `F5` 启动调试模式
2. 在调试控制台中查看日志信息
3. 检查是否有错误信息

## 📝 更新日志

### v0.0.0
- ✨ 初始版本发布
- 🎯 实现连续美元符号检测功能
- ⚡ 添加性能优化和防抖机制
- 🎨 实现可视化标记和悬停提示
- 📊 添加详细的输出面板信息

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**John Doe**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**注意**: 此扩展仅用于检测连续美元符号，不会自动修复代码问题。请根据检测结果手动检查和修正代码。 