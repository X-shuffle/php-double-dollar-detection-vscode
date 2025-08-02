const vscode = require('vscode');

// 常量定义
const CONSTANTS = {
    PHP_EXTENSION: '.php',
    DEBOUNCE_DELAY: 300,
    MAX_DOLLAR_LENGTH: 10,
    OUTPUT_CHANNEL_NAME: 'PHP Double Dollar Detection'
};

// 缓存已检测过的文件，避免重复检测
const checkedFiles = new Set();

// 创建诊断集合用于显示连续美元符号问题
const diagnosticCollection = vscode.languages.createDiagnosticCollection('php-double-dollar');

// 防抖定时器
let debounceTimer = null;

// 预编译正则表达式，避免重复创建
const DOLLAR_REGEX = /\$\$+/g;

// 输出通道缓存
let outputChannel = null;

function getOutputChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel(CONSTANTS.OUTPUT_CHANNEL_NAME);
    }
    return outputChannel;
}

function isPhpFile(fileName) {
    return fileName && fileName.endsWith(CONSTANTS.PHP_EXTENSION);
}

function clearDiagnostics(uri) {
    if (uri) {
        diagnosticCollection.delete(uri);
    }
}

function createDiagnostic(range, symbols) {
    return new vscode.Diagnostic(
        range,
        `发现连续美元符号(${symbols})，请检查是否是正确的变量引用`,
        vscode.DiagnosticSeverity.Warning
    );
}

function activate(context) {
    console.log('PHP Double Dollar Detection VSCode Extension is now active!');
    
    // 注册Hello World命令
    const disposable = vscode.commands.registerCommand('php-double-dollar.hello', () => {
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
    
    // 注册检查连续美元符号命令
    const checkDoubleDollarDisposable = vscode.commands.registerCommand('php-double-dollar.check', () => {
        checkForDoubleDollar();
    });
    context.subscriptions.push(checkDoubleDollarDisposable);
    
    // 监听文件切换事件，当切换到PHP文件时自动检查连续美元符号
    const changeActiveEditorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) return;
        
        const fileName = editor.document.fileName;
        if (!isPhpFile(fileName)) return;
        
        // 检查是否已经检测过这个文件
        if (!checkedFiles.has(fileName)) {
            // 使用防抖机制，避免频繁检测
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
                checkForDoubleDollar(true); // 使用静默模式
                // 标记文件已检测
                checkedFiles.add(fileName);
                debounceTimer = null;
            }, CONSTANTS.DEBOUNCE_DELAY);
        }
    });
    context.subscriptions.push(changeActiveEditorListener);
    
    // 监听文件内容变化，当PHP文件被修改时清除缓存
    const changeDocumentListener = vscode.workspace.onDidChangeTextDocument((event) => {
        const fileName = event.document.fileName;
        if (isPhpFile(fileName)) {
            // 当文件内容变化时，从缓存中移除，允许重新检测
            checkedFiles.delete(fileName);
            // 清除该文件的诊断信息
            clearDiagnostics(event.document.uri);
        }
    });
    context.subscriptions.push(changeDocumentListener);
    
    // 将诊断集合添加到订阅中，确保扩展停用时清理
    context.subscriptions.push(diagnosticCollection);
}

function checkForDoubleDollar(silent = false) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        if (!silent) {
            vscode.window.showWarningMessage('请先打开一个PHP文件');
        }
        return;
    }
    
    const document = editor.document;
    const fileName = document.fileName;
    
    // 检查文件扩展名是否为PHP
    if (!isPhpFile(fileName)) {
        if (!silent) {
            vscode.window.showWarningMessage('当前文件不是PHP文件');
        }
        return;
    }
    
    try {
        const text = document.getText();
        const lines = text.split('\n');
        const doubleDollarLines = [];
        const diagnostics = [];
        
        // 优化的检测算法：先快速检查是否包含$$，再详细分析
        lines.forEach((line, index) => {
            // 快速检查：如果行中没有$$符号，直接跳过
            if (!line.includes('$$')) {
                return;
            }
            
            // 使用预编译的正则表达式，只匹配连续的$符号
            let match;
            DOLLAR_REGEX.lastIndex = 0; // 重置正则表达式的lastIndex
            
            while ((match = DOLLAR_REGEX.exec(line)) !== null) {
                const dollarSymbols = match[0];
                const startIndex = match.index;
                
                // 限制检测的连续$符号数量，避免过长的匹配
                if (dollarSymbols.length > CONSTANTS.MAX_DOLLAR_LENGTH) {
                    continue; // 跳过过长的连续$符号，可能是故意的
                }
                
                doubleDollarLines.push({
                    lineNumber: index + 1,
                    content: line.trim(),
                    symbols: dollarSymbols,
                    position: startIndex
                });
                
                // 创建诊断信息
                const range = new vscode.Range(
                    index,
                    startIndex,
                    index,
                    startIndex + dollarSymbols.length
                );
                
                diagnostics.push(createDiagnostic(range, dollarSymbols));
            }
        });
        
        // 设置诊断信息到文件中
        diagnosticCollection.set(document.uri, diagnostics);
        
        if (doubleDollarLines.length > 0) {
            // 在输出面板中显示详细信息
            const output = getOutputChannel();
            output.show();
            output.appendLine(`=== PHP连续美元符号检测结果 ===`);
            output.appendLine(`文件: ${document.fileName}`);
            output.appendLine(`检测时间: ${new Date().toLocaleString()}`);
            output.appendLine(`发现 ${doubleDollarLines.length} 处连续美元符号:\n`);
            
            doubleDollarLines.forEach(item => {
                output.appendLine(`第${item.lineNumber}行: ${item.content}`);
                output.appendLine(`  位置: 第${item.position + 1}列, 符号: ${item.symbols}`);
            });
            output.appendLine('\n=== 检测完成 ===\n');
            
            // 只有在非静默模式下才显示弹窗提示
            if (!silent) {
                const message = `在文件 ${document.fileName} 中找到 ${doubleDollarLines.length} 处连续美元符号:\n\n` +
                    doubleDollarLines.map(item => `第${item.lineNumber}行: ${item.symbols}`).join('\n');
                
                vscode.window.showInformationMessage(message);
            }
        } else {
            // 清除该文件的诊断信息
            clearDiagnostics(document.uri);
            
            if (!silent) {
                vscode.window.showInformationMessage('未发现连续美元符号');
            }
        }
    } catch (error) {
        console.error('检测连续美元符号时发生错误:', error);
        if (!silent) {
            vscode.window.showErrorMessage('检测过程中发生错误，请查看控制台');
        }
    }
}

function deactivate() {
    console.log('PHP Double Dollar Detection VSCode Extension is now deactivated!');
    // 清理资源
    if (outputChannel) {
        outputChannel.dispose();
        outputChannel = null;
    }
}

module.exports = {
    activate,
    deactivate
}