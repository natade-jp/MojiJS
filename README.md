# MojiJS #
[![Build Status](https://travis-ci.org/natade-jp/MojiJS.svg?branch=master)](https://travis-ci.org/natade-jp/MojiJS)
[![ESDoc coverage badge](https://natade-jp.github.io/MojiJS/docs/badge.svg)](https://natade-jp.github.io/MojiJS/docs/)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)

## What ##
- 日本語の文字データを解析及び、変換するライブラリです。
- [詳細なAPIを公開しています。](https://natade-jp.github.io/MojiJS/docs/)
- [動作例](https://natade-jp.github.io/MojiJS/html/examples/demos/Text/) (コンソール及び[ソースコード](https://natade-jp.github.io/MojiJS/html/examples/demos/Text/main.mjs)を確認してみてください。)
- [npm](https://www.npmjs.com/package/mojijs)

以下のことが行えます
- エンコード（UTF-8 / UTF-16 / UTF-32 / Shift_JIS / Shift_JIS-2004 / EUC-JP / EUC-JIS-2004 ）
- 日本語の変換 (ひらがな, カタカナ, 半角, 全角, ローマ字 など))
- 漢字の判定 (常用漢字, 人名用漢字, 面区点, 漢字水準 など)
- 自然順ソート

## Install ##
```
npm install --save-dev mojijs
```

## Sample ##

### エンコード
```javascript
const MojiJS = require("mojijs");

console.log(MojiJS.encode("圡①靁謹𪘂麵", "shift_jis-2004"));
-> [ 136, 98, 135, 64, 251, 154, 238, 174, 252, 238, 239, 238 ]

console.log(MojiJS.decode([0x61, 0xE3, 0x81, 0x82], "utf-8"));
-> aあ
```

### 日本語の変換
```javascript
const MojiJS = require("mojijs");

console.log(MojiJS.toHiragana("カキクケコ"));
-> かきくけこ
```

### 面区点
```javascript
const MojiJS = require("mojijs");

const data1 = MojiJS.getMojiData(MojiJS.codePointAt("髙"));
console.log("区点：" + data1.encode.kuten.text + ", 漢字水準：" + data1.type.kanji_suijun);
-> 区点：118-94, 漢字水準：0
// ※髙は JIS X 0208 に登録されていないので、漢字水準は表示不可

const data2 = MojiJS.getMojiData(MojiJS.codePointAt("圡"));
console.log("面区点：" + data2.encode.menkuten.text + ", 漢字水準：" + data2.type.kanji_suijun);
-> 面区点：1-15-35, 漢字水準：3

const data3 = MojiJS.getMojiData(MojiJS.codePointAt("唁"));
console.log("面区点：" + data3.encode.menkuten.text + ", 漢字水準：" + data3.type.kanji_suijun);
-> 面区点：2-3-93, 漢字水準：4

```

### 自然順ソート
```javascript
const MojiJS = require("mojijs");

console.log(["３", "02", "あ", "イ", "う", "1"].sort(MojiJS.COMPARE_NATURAL));
-> [ '1', '02', '３', 'あ', 'イ', 'う' ]
```

## Author ##
- [natade](https://twitter.com/natadea)
