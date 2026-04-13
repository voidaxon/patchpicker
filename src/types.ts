/**
 * Hunk内の連続した同じ記号の行グループを表す
 */
export interface HunkGroup {
  /** グループの開始行番号（0始まり） */
  startLine: number;
  /** グループの終了行番号（0始まり） */
  endLine: number;
  /** グループの記号タイプ（追加 or 削除） */
  type: '+' | '-';
  /** グループ内の全行（記号付き） */
  lines: string[];
}
