const vscode = require('vscode');

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
}

function checkForDoubleDollar() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('请先打开一个PHP文件');
        return;
    }
    
    const document = editor.document;
    const fileName = document.fileName;
    
    // 检查文件扩展名是否为PHP
    if (!fileName.endsWith('.php')) {
        vscode.window.showWarningMessage('当前文件不是PHP文件');
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
        // 显示找到的连续美元符号
        const message = `在文件 ${document.fileName} 中找到 ${doubleDollarLines.length} 处连续美元符号($$):\n\n` +
            doubleDollarLines.map(item => `第${item.lineNumber}行: ${item.content}`).join('\n');
        
        vscode.window.showInformationMessage(message);
        
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
    } else {
        vscode.window.showInformationMessage('未发现连续美元符号($$)');
    }
}

function deactivate() {
    console.log('PHP Double Dollar Detection VSCode Extension is now deactivated!');
}

module.exports = {
    activate,
    deactivate
}