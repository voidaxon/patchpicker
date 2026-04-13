import * as vscode from 'vscode';
import { HunkGroup } from './types';

/**
 * Hunkグループの検出と記号削除を担当するクラス
 */
export class HunkDetector {
  /**
   * 指定行がdiff記号（+/-）で始まるかチェック
   */
  private isDiffLine(line: string): boolean {
    return line.startsWith('+') || line.startsWith('-');
  }

  /**
   * 指定行のdiff記号タイプを取得
   */
  private getDiffSymbol(line: string): '+' | '-' | null {
    if (line.startsWith('+')) {
      return '+';
    }
    if (line.startsWith('-')) {
      return '-';
    }
    return null;
  }

  /**
   * カーソル位置の行からHunkグループを検出
   * @param document テキストドキュメント
   * @param lineNumber カーソルのある行番号（0始まり）
   * @returns 検出されたグループ、または検出できなかった場合はnull
   */
  detectGroupAtLine(document: vscode.TextDocument, lineNumber: number): HunkGroup | null {
    if (lineNumber < 0 || lineNumber >= document.lineCount) {
      return null;
    }

    const currentLine = document.lineAt(lineNumber).text;
    const symbol = this.getDiffSymbol(currentLine);

    if (!symbol) {
      return null;
    }

    // 上方向に同じ記号の連続を検索
    let startLine = lineNumber;
    while (startLine > 0) {
      const prevLine = document.lineAt(startLine - 1).text;
      if (this.getDiffSymbol(prevLine) !== symbol) {
        break;
      }
      startLine--;
    }

    // 下方向に同じ記号の連続を検索
    let endLine = lineNumber;
    while (endLine < document.lineCount - 1) {
      const nextLine = document.lineAt(endLine + 1).text;
      if (this.getDiffSymbol(nextLine) !== symbol) {
        break;
      }
      endLine++;
    }

    // グループ範囲の全行を取得
    const lines: string[] = [];
    for (let i = startLine; i <= endLine; i++) {
      lines.push(document.lineAt(i).text);
    }

    return {
      startLine,
      endLine,
      type: symbol,
      lines
    };
  }

  /**
   * 選択範囲から行を取得
   * @param document テキストドキュメント
   * @param selection 選択範囲
   * @returns 選択範囲の全行
   */
  getLinesInSelection(document: vscode.TextDocument, selection: vscode.Selection): string[] {
    const lines: string[] = [];
    const startLine = selection.start.line;
    const endLine = selection.end.line;

    for (let i = startLine; i <= endLine; i++) {
      lines.push(document.lineAt(i).text);
    }

    return lines;
  }

  /**
   * 各行から先頭の+/-記号を削除
   * @param lines 元の行配列
   * @returns 記号を削除した行配列
   */
  removeSymbols(lines: string[]): string[] {
    return lines.map(line => {
      // 行頭の + または - を削除
      if (line.startsWith('+') || line.startsWith('-')) {
        let cleaned = line.substring(1);
        // BOM (Byte Order Mark \uFEFF) が先頭にある場合は削除
        if (cleaned.charCodeAt(0) === 0xFEFF) {
          cleaned = cleaned.substring(1);
        }
        return cleaned;
      }
      return line;
    });
  }
}
