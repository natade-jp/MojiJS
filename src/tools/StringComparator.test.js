import StringComparator from "./StringComparator.js";

/**
 * @param {Array} x 
 * @returns {string}
 */
const toStringFromArray = function(x) {
	return (x).toString();
};

/**
 * @param {Array} x 
 * @param {Array} y 
 * @returns {boolean}
 */
const equalsArray = function(x, y) {
	if(x.length !== y.length) {
		return false;
	}
	for(let i = 0; i < x.length; i++) {
		if(x[i] !== y[i]) {
			return false;
		}
	}
	return true;
};

let test_count = 0;

/**
 * @param {*} operator 
 * @param {Array} x 
 * @param {Array} y 
 */
const testSort  = function(operator, x, y) {
	test_count++;
	const z = x.concat();
	if(operator) {
		// @ts-ignore
		z.sort(StringComparator[operator]);
	}
	else {
		z.sort();
	}
	const testname = operator + " " + test_count + " (" + toStringFromArray(x) + ").sort(" + operator + ") = " + toStringFromArray(z) + " === " + toStringFromArray(y);
	test(testname, () => { expect(equalsArray(z, y)).toBe(true); });
};

test_count = 0;
const data1 = ["3", "2", "10", "4", "2-4", "0-1", "テスト", "てすと２", "てスと01"];
const data2 = ["0-1", "10", "2", "2-4", "3", "4", "てすと２", "てスと01", "テスト"];
const data3 = ["0-1", "2", "3", "4", "10", "2-4", "テスト", "てスと01", "てすと２"];
testSort(null,  data1, data2);
testSort("DEFAULT", data1, data2);
testSort("NATURAL", data1, data3);

