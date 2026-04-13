import * as vscode from 'vscode';
import { CommandHandler } from './commands';

/**
 * 拡張機能のアクティベーション
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Patch Picker extension is now active');

  const commandHandler = new CommandHandler();

  // コマンドを登録
  const copyCommand = vscode.commands.registerCommand(
    'patchPicker.copyWithoutSymbols',
    () => commandHandler.copyWithoutSymbols()
  );

  context.subscriptions.push(copyCommand);
}

/**
 * 拡張機能の非アクティベーション
 */
export function deactivate() {
  console.log('Patch Picker extension is now deactivated');
}
