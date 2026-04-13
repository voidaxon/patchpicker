import * as vscode from 'vscode';

/**
 * クリップボード操作を担当するクラス
 */
export class ClipboardManager {
  /**
   * テキストをクリップボードにコピー
   * @param text コピーするテキスト
   */
  async copyToClipboard(text: string): Promise<void> {
    await vscode.env.clipboard.writeText(text);
  }

  /**
   * ステータスバーにフィードバックメッセージを表示
   * @param lineCount コピーした行数
   */
  showFeedback(lineCount: number): void {
    vscode.window.setStatusBarMessage(
      `Copied ${lineCount} line${lineCount > 1 ? 's' : ''} (without +/-)`,
      3000
    );
  }
}
