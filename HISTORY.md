# History

## v5.0.0

### 機能改善

- 異体字セレクタの判定に、注釈機能を追加
- 絵文字の判定を強化
- 記号の判定を追加
- Unicodeの制御文字を追加
  - CJK Unified Ideographs Extension I (2EBF0–2EE5F)
  - CJK Unified Ideographs Extension J (323B0–3347F)

### 変更

- travisが動作しないので除去

### 不具合修正

- 結合していない文字も結合文字と判定する場合があるのを修正
- getVariationSelectorsNumberFromCodePoint での戻り値で意図しない文字列を返す問題を修正

## v4.0.0

### 機能改善

- ローマ字で `*w[aiueo]` のパターンで足りていない箇所があったのを改善
- 文字解析用の `MojiAnalyzer` に定義されているUnicodeの面情報を最新版へ更新
- 文字解析用の `MojiAnalyzer` に結合文字判定を追加
- 文字解析用の `MojiAnalyzer` に異体字セレクタ判定を追加
- 結合文字と異体字セレクタを含めて1文字と判定して切り出す `MojiJS.toMojiArrayFromString`, `MojiJS.toStringFromMojiArray` を追加
 - 結合文字と異体字セレクタがあると `UTF-32` への変換だと1文字を1数値への変換に対応できないため

### 変更

- `substr` が使用されている箇所を `substring` へ改善
- 内部用メソッド名で `toUTF16ArrayfromCodePoint` となっていた個所を `toUTF16ArrayFromCodePoint` へ変更
- `MojiJS.getWidth`, `MojiJS.cutTextForWidth` にて結合文字と異体字セレクタは文字数を`0`としてカウントするように変更

### 不具合修正

- ローマ字で「`nn`」があった場合に繰り返しの「`っ`」に判定される場合があるのを修正

## v3.1.0

### 変更

- `MojiJS.compareToForDefault`, `MojiJS.compareToForNatural` ともに入力を `string` から `any` へ変更
- `MojiJS.compareToForNatural` の入力値に対して `toString` で文字列化して比較するように改善
- 例では、`MojiJS.COMPARE_DEFAULT`, `MojiJS.COMPARE_NATURAL` と紹介していましたが、正しくは、`MojiJS.compareToForDefault`, `MojiJS.compareToForNatural` であったのを修正

## v3.0.5

### 変更
- `Windows-31J`, `Shift_JIS-2004` 用の文字変換マップをテキストデータで持つことでファイルサイズを1/3程度へ低減、WSHでロードする際のファイルサイズ制限内とするよう改善。
- WSH用のライブラリ `mojijs.wsh.js` を追加

## v3.0.4

### 変更
- 誤動作防止のため、最適化後に「`do`」というキー名になっていた部分を文字列にするように変更
- 誤動作防止のため、配列の最後のカンマを排除
- ES3に対応できるように、`getter`を使用している部分を削除

## v3.0.3

### 変更
- `dependencies` に入っていた `eslint` を `devDependencies` に移動

## v3.0.2

### 不具合修正
- my行のローマ字への変換が出来ていなかった問題を修正

## v3.0.1

### 変更
- `package.json` の `main` で指定しているファイルを、UMD形式からCommonJS形式に変更

### 不具合修正
- 誤って `@ignore` 指定がついていた箇所を削除

## v3.0.0

### 機能改善
- `charset` 名の正規化の強化
- `eucJP-ms` に対応
- 文字コードに依存しない横幅用の関数 `getWidth`, `cutTextForWidth` を追加
- 文字コードの自動判定アルゴリズムを改善
- 区点コードと文字との相互変換用の関数を追加

### 仕様変更
- Unicodeへのエンコード時のBOM付きについて、未設定時のデフォルトをTRUEへ変更
- `charset` に `" with BOM"` が入っている場合は優先的にBOM付きとする仕様に変更
- `EUC-JP` 指定を `EUC-JP-2004` と同等とみなすように変更
- 使うかもと思い見せていた `private` なクラスを外に見せないように変更
- `getWidthForSJIS`, `cutTextForSJIS` 等、文字コードに依存した横幅用の関数を削除。

### 不具合修正
- 文字解析用の `MojiAnalyzer` クラスが、`CharcterAnalyzer` という名前になっていたのを修正
- `EUC-JP`, `EUC-JIS-2004` で半角カタカナの `SS2` が `0x8E` ではなく、`0x80` になっていたのを修正
- `EUC-JP` にて、IBM拡張文字の判定が漏れていたのを修正

## v2.1.1

### 不具合修正
- `package` のファイル名が誤っているのを修正

## v2.1.0

### 機能改善
- 文字コードの自動判定アルゴリズムを改善

## v2.0.0

### 仕様変更
- `ArrayBinary` から `Binary` へ単語を変更
- 一般的には不要な関数を隠して、`encode` / `decode` の2種類のみ見せるように変更
- `Windows-31J`, `Shift_JIS-2004` への変換失敗時の回数を抽出できるように仕様を変更

### 機能追加
- 「ひらがな」から「ローマ字」に変換を追加
- Unicodeのエンディアン指定、BOMに対応
- `EUC-JP`, `EUC-JIS-2004` に対応
- 不要な関数を隠すことに追加して、内部の専用関数も呼び出しできるように修正

### 不具合修正
- `gwa`, `gwi`, `gwu`, `gwe`, `gwo` が変換できない問題を修正
- バイナリ配列から `UTF-8` の変換が正しく動作しない場合があるのを修正
- `𪘂` などの `Shift_JIS-2004` でサロゲートペアの文字が `SJIS` から `Unicode` への文字列変換に失敗する不具合を修正

## v1.0.0
- npm 公開
- バージョン管理開始
