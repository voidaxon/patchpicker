import * as vscode from 'vscode';
import { HunkDetector } from './hunkDetector';
import { ClipboardManager } from './clipboardManager';

/**
 * 拡張機能のコマンドハンドラ
 */
export class CommandHandler {
  private hunkDetector: HunkDetector;
  private clipboardManager: ClipboardManager;

  constructor() {
    this.hunkDetector = new HunkDetector();
    this.clipboardManager = new ClipboardManager();
  }

  /**
   * +/- 記号を削除してコピーするコマンド
   */
  async copyWithoutSymbols(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    let linesToCopy: string[] = [];

    // 選択範囲があるかチェック
    if (!selection.isEmpty) {
      // 選択範囲の行を取得
      linesToCopy = this.hunkDetector.getLinesInSelection(document, selection);
    } else {
      // 選択なし：カーソル位置のグループを自動検出
      const currentLine = selection.active.line;
      const group = this.hunkDetector.detectGroupAtLine(document, currentLine);

      if (!group) {
        // グループが検出できない場合は、デフォルトのコピーにフォールバック
        await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        return;
      }

      linesToCopy = group.lines;
    }

    if (linesToCopy.length === 0) {
      // 空の場合は、デフォルトのコピーにフォールバック
      await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
      return;
    }

    // +/- 記号を削除
    const cleanedLines = this.hunkDetector.removeSymbols(linesToCopy);
    const textToCopy = cleanedLines.join('\n');

    // クリップボードにコピー
    await this.clipboardManager.copyToClipboard(textToCopy);

    // フィードバック表示
    this.clipboardManager.showFeedback(cleanedLines.length);
  }
}
