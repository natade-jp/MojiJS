/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class ImgFIRMatrix {
	
	/**
	 * 画像処理に使用する配列のフィルタ用クラス
	 * @param {type} matrix 2次元配列
	 * @returns {ImgFIRMatrix}
	 */
	constructor(matrix) {
		this.height = matrix.length;
		this.width  = matrix[0].length;
		this.matrix = [];
		let i;
		for(i = 0; i < matrix.length; i++) {
			this.matrix[i] = matrix[i].slice();
		}
	}
	
	clone() {
		return new ImgFIRMatrix(this.matrix);
	}
	
	rotateEdge(val) {
		// 周囲の値を時計回りに回転させます。
		const m = this.clone();

		const x = [], y = [];
		let i, j;
		{
			// 上側
			for(i = 0;i < this.width - 1; i++) {
				x.push(m.matrix[0][i]);
			}
			// 右側
			for(i = 0;i < this.height - 1; i++) {
				x.push(m.matrix[i][this.width - 1]);
			}
			// 下側
			for(i = this.width - 1;i > 0; i--) {
				x.push(m.matrix[this.height - 1][i]);
			}
			// 左側
			for(i = this.height - 1;i > 0; i--) {
				x.push(m.matrix[i][0]);
			}
		}
		for(i = 0;i < x.length; i++) {
			// かならず正とする
			y[i] = x[((i + val) % x.length + x.length) % x.length];
		}
		{
			// 上側
			m.matrix[0] = y.slice(0, this.width);
			// 右側
			for(i = 0;i < this.height; i++) {
				m.matrix[i][this.width - 1] = y[this.width + i];
			}
			// 下側
			m.matrix[this.height - 1] = y.slice(
				this.width + this.height - 2,
				this.width + this.height - 2 + this.width ).reverse();
			// 左側
			for(i = this.height - 1, j = 0;i > 0; i--, j++) {
				m.matrix[i][0] = y[this.width + this.height + this.width - 3 + j];
			}
		}
		return m;
	}
	
	mul(val) {
		const m = this.clone();
		let x, y;
		for(y = 0; y < m.height; y++) {
			for(x = 0; x < m.width; x++) {
				m.matrix[y][x] *= val;
			}
		}
		return m;
	}
	
	sum() {
		let sum = 0;
		let x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				sum += this.matrix[y][x];
			}
		}
		return sum;
	}
	
	normalize() {
		return this.clone().mul(1.0 / this.sum());
	}
	
	addCenter(val) {
		const m = this.clone();
		m.matrix[m.height >> 1][m.width >> 1] += val;
		return m;
	}
	
	static makeLaplacianFilter() {
		return new ImgFIRMatrix([
			[ 0.0, -1.0, 0.0],
			[-1.0,  4.0,-1.0],
			[ 0.0, -1.0, 0.0]
		]);
	}
	
	static makeSharpenFilter(power) {
		const m = ImgFIRMatrix.makeLaplacianFilter();
		return m.mul(power).addCenter(1.0);
	}
	
	static makeBlur(width, height) {
		const m = [];
		const value = 1.0 / (width * height);
		let x, y;
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = value;
			}
		}
		return new ImgFIRMatrix(m);
	}
	
	static makeGaussianFilter(width, height, sd) {
		if(sd === undefined) {
			sd = 1.0;
		}
		const m = [];
		let i, x, y;
		const v = [];
		const n = Math.max(width, height);
		let s = - Math.floor(n / 2);
		for(i = 0; i < n; i++, s++) {
			v[i] = Math.exp( - (s * s) / ((sd * sd) * 2.0) );
		}
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = v[x] * v[y];
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

	static makeCircle(r) {
		const m = [];
		const radius	= r * 0.5;
		const center	= r >> 1;
		let x, y;
		for(y = 0; y < r; y++) {
			m[y] = [];
			for(x = 0; x < r; x++) {
				if (Math.sqrt(	(center - x) * (center - x) +
								(center - y) * (center - y)) < radius) {
					m[y][x] = 1.0;
				}
				else {
					m[y][x] = 0.0;
				}
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

}
