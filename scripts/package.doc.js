const File = require("./File.js");

/*
## ESdoc memo 1

An error occurs if the following is written.
```
@param {abd : ?(number|string)}
```

```
SyntaxError: Invalid regular expression: /[~](string$/: Unterminated group
    at new RegExp (<anonymous>)
    at ClassDocBuilder._findByName (\konpeito\node_modules\esdoc-publish-html-plugin\out\src\Builder\DocBuilder.js:117:20)
```

The error will not occur by rewriting as follows.
```
@param {test : (?number|?string)}
```

Or, rewrite the esdoc code.

### old
```
    const regexp = new RegExp(`[~]${name.replace('*', '\\*')}$`); // if name is `*`, need to escape.
    if (kind) {
```
### new
```
    const regexp = new RegExp(`[~]${name.replace(/[\(\)]/g, "").replace('*', '\\*')}$`); // if name is `*`, need to escape.
    if (kind) {
```

## ESdoc memo 2

An error occurs if the following is written.
```
@param {function(integer, string): integer}
```

```
SyntaxError: Invalid function type annotation: `function(Array<Complex>): Array<Complex>`
    at inner.split.map.v (\konpeito\node_modules\esdoc-publish-html-plugin\out\src\Builder\DocBuilder.js:675:39)
```

The error will not occur by rewriting as follows.
```
@param {function(value : integer, name : string): integer}
```

However, this method is not compatible with TypeScript.
And rewrite the esdoc code.

### old
```
    // e.g. function(a: number, b: string): boolean
    matched = typeName.match(/function *\((.*?)\)(.*)/);
    if (matched) {
```
### new
```
    // e.g. function(a: number, b: string): boolean
	const is_function = typeName.match(/function *\((.*?)\)(.*)/);
	let typeName2 = "";
	if(is_function) {
		let prm_num = 1;
		const prm_rep = function(text) {return text + " prm" + (prm_num++) + ":"}
		typeName2 = typeName.replace(/\(|,/g, prm_rep);
	}
	matched = typeName2.match(/function *\((.*?)\)(.*)/);
```

With this method, no error will occur but you will not be able to use the esdoc hosting service.
*/

const batch = function() {
	const target_file = ".\\node_modules\\esdoc-publish-html-plugin\\out\\src\\Builder\\DocBuilder.js";
	const target_file_org = target_file + "_org";
	if(File.isExist(target_file_org)) {
		return;
	}
	if(!File.isExist(target_file)) {
		return;
	}
	File.copy(target_file, target_file_org);
	const text = File.loadTextFile(target_file).split(/[\r\n]/);
	for(let i = 0; i < text.length; i++) {
		const line = text[i];
		// バッチ
		if(line.startsWith("    // e.g. function(a: number, b: string): boolean")) {
			const push_text = [
				// @type {import("./aaa/bbb.js").XXX} といった書き方を許可
				"typeName = typeName.replace(/import\\([^)]*\\)\\./g, \"\");",
				// {test : (?number|?string)} だけではなく {abd : ?(number|string)} といった書き方を許可
				"const is_function = typeName.match(/function *\\((.*?)\\)(.*)/);",
				"let typeName2 = \"\";",
				"if(is_function) {",
				"	let prm_num = 1;",
				"	const prm_rep = function(text) {return text + \" prm\" + (prm_num++) + \":\"}",
				"	typeName2 = typeName.replace(/\\(|,/g, prm_rep);",
				"}",
				"matched = typeName2.match(/function *\\((.*?)\\)(.*)/);"
			];
			text.splice(i + 1, 1, push_text.join("\n"));
			i++;
		}
	}
	File.saveTextFile(target_file, text.join("\n"));
};

batch();

// esdoc
File.exec("npx esdoc -c \"./scripts/.esdoc.json\"");