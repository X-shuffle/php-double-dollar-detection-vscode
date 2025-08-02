const vscode = require('vscode');

// 缓存已检测过的文件，避免重复检测
const checkedFiles = new Set();

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
        if (editor) {
            const fileName = editor.document.fileName;
            if (fileName.endsWith('.php')) {
                // 检查是否已经检测过这个文件
                if (!checkedFiles.has(fileName)) {
                    // 延迟执行检查，确保文件内容已加载
                    setTimeout(() => {
                        checkForDoubleDollar(true); // 使用静默模式
                        // 标记文件已检测
                        checkedFiles.add(fileName);
                    }, 200);
                }
            }
        }
    });
    context.subscriptions.push(changeActiveEditorListener);
    
    // 监听文件内容变化，当PHP文件被修改时清除缓存
    const changeDocumentListener = vscode.workspace.onDidChangeTextDocument((event) => {
        const fileName = event.document.fileName;
        if (fileName.endsWith('.php')) {
            // 当文件内容变化时，从缓存中移除，允许重新检测
            checkedFiles.delete(fileName);
        }
    });
    context.subscriptions.push(changeDocumentListener);
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
    if (!fileName.endsWith('.php')) {
        if (!silent) {
            vscode.window.showWarningMessage('当前文件不是PHP文件');
        }
        return;
    }
    
    const text = document.getText();
    const lines = text.split('\n');
    const doubleDollarLines = [];
    
    // 检查每一行是否包含连续美元符号
    lines.forEach((line, index) => {
        if (line.includes('$$')) {
            doubleDollarLines.push({
                lineNumber: index + 1,
                content: line.trim()
            });
        }
    });
    
    if (doubleDollarLines.length > 0) {
        // 在输出面板中显示详细信息
        const output = vscode.window.createOutputChannel('PHP Double Dollar Detection');
        output.show();
        output.appendLine(`=== PHP连续美元符号检测结果 ===`);
        output.appendLine(`文件: ${document.fileName}`);
        output.appendLine(`检测时间: ${new Date().toLocaleString()}`);
        output.appendLine(`发现 ${doubleDollarLines.length} 处连续美元符号:\n`);
        
        doubleDollarLines.forEach(item => {
            output.appendLine(`第${item.lineNumber}行: ${item.content}`);
        });
        output.appendLine('\n=== 检测完成 ===\n');
        
        // 只有在非静默模式下才显示弹窗提示
        if (!silent) {
            const message = `在文件 ${document.fileName} 中找到 ${doubleDollarLines.length} 处连续美元符号($$):\n\n` +
                doubleDollarLines.map(item => `第${item.lineNumber}行: ${item.content}`).join('\n');
            
            vscode.window.showInformationMessage(message);
        } else {
            // 静默模式下只显示状态栏通知
            vscode.window.showInformationMessage(`发现 ${doubleDollarLines.length} 处连续美元符号($$)`);
        }
    } else {
        if (!silent) {
            vscode.window.showInformationMessage('未发现连续美元符号($$)');
        }
    }
}

function deactivate() {
    console.log('PHP Double Dollar Detection VSCode Extension is now deactivated!');
}

module.exports = {
    activate,
    deactivate
}