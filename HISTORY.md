# History

## v3.0.3

### 変更
- "dependencies" に入っていた "eslint" を "devDependencies" に移動

## v3.0.2

### 不具合修正
- my行のローマ字への変換が出来ていなかった問題を修正

## v3.0.1

### 変更
- "package.json" の "main" で指定しているファイルを、UMD形式からCommonJS形式に変更

### 不具合修正
- 誤って"@ignore"指定がついていた箇所を削除

## v3.0.0

### 機能改善
- charset名の正規化の強化
- eucJP-ms に対応
- 文字コードに依存しない横幅用の関数 getWidth, cutTextForWidth を追加
- 文字コードの自動判定アルゴリズムを改善
- 区点コードと文字との相互変換用の関数を追加

### 仕様変更
- Unicodeへのエンコード時のBOM付きについて、未設定時のデフォルトをTRUEへ変更
- charset に" with BOM" が入っている場合は優先的にBOM付きとする仕様に変更
- EUC-JP 指定を EUC-JP-2004 と同等とみなすように変更
- 使うかもと思い見せていたprivateなクラスを外に見せないように変更
- getWidthForSJIS, cutTextForSJIS 等、文字コードに依存した横幅用の関数を削除。

### 不具合修正
- 文字解析用のMojiAnalyzerクラスが、CharcterAnalyzerという名前になっていたのを修正
- EUC-JP, EUC-JIS-2004 で半角カタカナのSS2が0x8Eではなく、0x80になっていたのを修正
- EUC-JP にて、IBM拡張文字の判定が漏れていたのを修正

## v2.1.1

### 不具合修正
- packageのファイル名が誤っているのを修正

## v2.1.0

### 機能改善
- 文字コードの自動判定アルゴリズムを改善

## v2.0.0

### 仕様変更
- 「ArrayBinary」から「Binary」へ単語を変更
- 一般的には不要な関数を隠して、encode/decodeの2種類のみ見せるように変更
- 「Windows-31J」「Shift_JIS-2004」への変換失敗時の回数を抽出できるように仕様を変更

### 機能追加
- 「ひらがな」から「ローマ字」に変換を追加
- Unicodeのエンディアン指定、BOMに対応
- EUC-JP, EUC-JIS-2004 に対応
- 不要な関数を隠すことに追加して、内部の専用関数も呼び出しできるように修正

### 不具合修正
- gwagwigwugwegwo が変換できない問題を修正
- バイナリ配列からUTF-8の変換が正しく動作しない場合があるのを修正
- 「𪘂」などのShift_JIS-2004でサロゲートペアの文字が、SJISからUnicodeへの文字列変換に失敗する不具合を修正

## v1.0.0
- npm 公開
- バージョン管理開始
