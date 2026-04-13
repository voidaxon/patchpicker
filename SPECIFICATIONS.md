# PatchPicker - VSCode拡張機能 実装仕様書

## Context

diffファイル（.diff, .patch, .rej）のレビューや適用作業を頻繁に行う際、Hunk内の追加行（`+`）や削除行（`-`）のコードをコピーして他の場所に貼り付けることがよくあります。しかし、行頭の`+/-`記号がそのままコピーされるため、手動で削除する必要があり非効率です。

この拡張機能は、diffファイルでのコピー操作を拡張し、自動的に`+/-`記号を削除してクリーンなコードをクリップボードに格納します。1日に何度も使用するため、キーボードショートカット（Ctrl+C）での効率的な操作を重視します。

## 実装アプローチ

### 1. プロジェクト構造

```
PatchPicker/
├── package.json              # 拡張機能マニフェスト
├── tsconfig.json            # TypeScript設定
├── src/
│   ├── extension.ts         # エントリーポイント
│   ├── hunkDetector.ts      # グループ検出ロジック
│   ├── clipboardManager.ts  # クリップボード操作
│   ├── commands.ts          # コマンド実装
│   └── types.ts             # 型定義
└── README.md
```

### 2. コア機能

#### 2.1 グループの定義と検出（hunkDetector.ts）

**グループ**: Hunk内の連続した同じ記号（`+`または`-`）の行のまとまり

**検出アルゴリズム**:
1. カーソル位置の行が`+`または`-`で始まるかチェック
2. 上方向に同じ記号の連続を検索（開始行を特定）
3. 下方向に同じ記号の連続を検索（終了行を特定）
4. グループ範囲の全行を取得

**記号削除**: 各行から行頭の`^[+-]`を正規表現で削除

#### 2.2 コピーコマンド（commands.ts）

**動作フロー**:
1. 選択状態をチェック
   - **選択なし**: カーソル位置のグループを自動検出してコピー
   - **選択あり**: 選択範囲の行をコピー
2. 各行から`+/-`記号を削除
3. クリップボードに書き込み
4. ステータスバーにフィードバック表示

**エッジケース処理**:
- カーソルが`+/-`で始まらない行にある場合 → デフォルトのコピーにフォールバック
- 空のファイル → デフォルトのコピーにフォールバック

#### 2.3 キーバインドとメニュー（package.json）

**Ctrl+Cの拡張**:
```json
{
  "key": "ctrl+c",
  "mac": "cmd+c",
  "command": "patchPicker.copyWithoutSymbols",
  "when": "editorTextFocus && resourceExtname =~ /\\.(diff|patch|rej)$/"
}
```
- 対象ファイル（.diff, .patch, .rej）で常に+/-を削除
- 選択の有無に関わらず動作

**右クリックメニュー**:
```json
{
  "command": "patchPicker.copyWithoutSymbols",
  "when": "resourceExtname =~ /\\.(diff|patch|rej)$/",
  "group": "9_cutcopypaste@2"
}
```
- "Copy Code (without +/-)" を追加
- 既存の "Copy" は残る（万が一+/-付きでコピーしたい場合）

### 3. 実装の詳細

#### package.json - 主要設定

```json
{
  "name": "patch-picker",
  "displayName": "Patch Picker",
  "version": "1.0.0",
  "engines": { "vscode": "^1.75.0" },
  "activationEvents": [
    "onLanguage:diff",
    "onCommand:patchPicker.copyWithoutSymbols"
  ],
  "contributes": {
    "commands": [
      {
        "command": "patchPicker.copyWithoutSymbols",
        "title": "Copy Code (without +/-)"
      }
    ],
    "keybindings": [...],
    "menus": {
      "editor/context": [...]
    }
  }
}
```

#### types.ts - 型定義

```typescript
export interface HunkGroup {
  startLine: number;
  endLine: number;
  type: '+' | '-';
  lines: string[];
}
```

#### hunkDetector.ts - 主要メソッド

- `detectGroupAtLine(document, lineNumber): HunkGroup | null`
  - カーソル位置のグループを検出
- `getLinesInSelection(document, selection): string[]`
  - 選択範囲の行を取得
- `removeSymbols(lines): string[]`
  - `^[+-]`を削除

#### commands.ts - コマンドハンドラ

- `copyWithoutSymbols(): Promise<void>`
  - 選択状態の判定
  - グループ検出または選択行取得
  - 記号削除とクリップボードコピー
  - フィードバック表示

#### extension.ts - アクティベーション

```typescript
export function activate(context: vscode.ExtensionContext) {
  const commandHandler = new CommandHandler();
  const copyCommand = vscode.commands.registerCommand(
    'patchPicker.copyWithoutSymbols',
    () => commandHandler.copyWithoutSymbols()
  );
  context.subscriptions.push(copyCommand);
}
```

### 4. パフォーマンス最適化

- **遅延アクティベーション**: `onLanguage:diff`で必要時のみロード
- **同期処理**: グループ検出は軽量な同期処理（非同期オーバーヘッドなし）
- **正規表現の最小化**: `startsWith()`を優先使用

### 5. Critical Files

- **package.json** - コマンド、キーバインド、メニューの定義
- **src/extension.ts** - 拡張機能のエントリーポイント
- **src/hunkDetector.ts** - コア機能：グループ検出と記号削除
- **src/commands.ts** - コマンド実装とクリップボード連携
- **src/types.ts** - TypeScript型定義
- **tsconfig.json** - TypeScriptコンパイラ設定

### 6. 実装順序

1. ✅ プロジェクトセットアップ（package.json, tsconfig.json）
2. ✅ 型定義（types.ts）
3. ✅ グループ検出ロジック（hunkDetector.ts）
4. ✅ コマンド実装（commands.ts, clipboardManager.ts）
5. ✅ 統合（extension.ts）
6. ⏳ テストとデバッグ

### 7. Verification（検証方法）

#### 7.1 開発環境でのテスト

1. **F5でデバッグ実行**
   - Extension Development Hostウィンドウが起動

2. **テスト用diffファイルを作成**
   ```diff
   @@ -1,3 +1,4 @@
    context line
   +added line 1
   +added line 2
   +added line 3
    context line
   -removed line 1
   -removed line 2
   ```

3. **選択なしでのコピーテスト**
   - カーソルを`+added line 2`に置く
   - Ctrl+C を押す
   - クリップボードの内容を確認：
     ```
     added line 1
     added line 2
     added line 3
     ```
   - ステータスバーに「Copied 3 lines (without +/-)」と表示されることを確認

4. **選択ありでのコピーテスト**
   - `+added line 1`と`+added line 2`を選択
   - Ctrl+C を押す
   - クリップボードの内容を確認：
     ```
     added line 1
     added line 2
     ```

5. **削除グループのテスト**
   - `-removed line 1`にカーソルを置く
   - Ctrl+C を押す
   - クリップボードの内容を確認：
     ```
     removed line 1
     removed line 2
     ```

6. **右クリックメニューのテスト**
   - 右クリックして「Copy Code (without +/-)」が表示されることを確認
   - クリックして同じ動作をすることを確認

7. **エッジケースのテスト**
   - コンテキスト行（` context line`）でCtrl+C → 通常コピー動作を確認
   - 空ファイルでCtrl+C → エラーが出ないことを確認

#### 7.2 パッケージング後のテスト

1. `vsce package`でVSIXファイル生成
2. VSCodeにインストール
3. 上記のテストを再度実行
4. .patch, .rejファイルでも同様に動作することを確認

#### 7.3 期待される動作

- ✓ +/-グループを自動検出してコピー
- ✓ 記号が削除されたクリーンなコードがクリップボードに格納
- ✓ 選択時は選択範囲のみコピー
- ✓ 通常の行では従来のコピー動作にフォールバック
- ✓ ステータスバーにフィードバック表示
- ✓ 他のファイルタイプに影響しない

## 使用例

### 入力（diffファイル）
```diff
@@ -1,8 +1,10 @@
 function example() {
-  const oldVariable = 'old value';
-  console.log('This will be removed');
-  return oldVariable;
+  const newVariable = 'new value';
+  console.log('This is new code');
+  console.log('Another new line');
+  return newVariable;
 }
```

### 操作
カーソルを`+  const newVariable = 'new value';`に置いて`Ctrl+C`

### 出力（クリップボード）
```
  const newVariable = 'new value';
  console.log('This is new code');
  console.log('Another new line');
  return newVariable;
```

## 技術仕様

- **言語**: TypeScript
- **プラットフォーム**: VSCode 1.75.0+
- **依存関係**: VSCode API のみ（外部ライブラリ不要）
- **ファイルタイプ**: .diff, .patch, .rej
- **キーバインド**: Ctrl+C (Windows/Linux), Cmd+C (Mac)
- **アクティベーション**: diffファイルを開いた時に遅延ロード

## 実装ステータス

| 機能 | ステータス |
|------|----------|
| プロジェクト構造 | ✅ 完了 |
| 型定義 | ✅ 完了 |
| グループ検出ロジック | ✅ 完了 |
| クリップボード操作 | ✅ 完了 |
| コマンド実装 | ✅ 完了 |
| キーバインド設定 | ✅ 完了 |
| 右クリックメニュー | ✅ 完了 |
| ドキュメント | ✅ 完了 |
| 単体テスト | ⏳ 未実装 |
| 統合テスト | ⏳ 要実施 |

## 今後の拡張可能性

1. **設定オプション**
   - ステータスバーメッセージの表示時間をカスタマイズ
   - 対象ファイル拡張子の追加設定

2. **追加機能**
   - Hunkヘッダー（`@@`行）の自動スキップ
   - コンテキスト行（先頭スペース）の自動処理オプション

3. **テスト**
   - ユニットテストの追加（Jest/Mocha）
   - E2Eテストの追加

4. **パフォーマンス**
   - 大規模diffファイルでの最適化
   - 非同期処理の検討（必要に応じて）
