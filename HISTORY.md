# History

## v1.0.x

### 仕様変更
- 「ArrayBinary」から「Binary」へ単語を変更

### 機能追加
- ひらがなからローマ字に変換を追加
- toCodePointFromUTFBinary, toUTFBinaryFromCodePoint を追加

### 不具合修正
- gwagwigwugwegwo が変換できない問題を修正
- バイナリ配列からUTF-8の変換が正しく動作しない場合があるのを修正
- 「𪘂」などのShift_JIS-2004でサロゲートペアの文字が、SJISからUnicodeへの文字列変換に失敗する不具合を修正

## v1.0.0
- npm 公開
- バージョン管理開始
