
import * as path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
	target: 'node',
	entry: './src/main.js', // Tệp nguồn chứa mã JavaScript của bạn
	output: {
		filename: 'bundle.js', // Tên tệp bundle đầu ra
		path: path.resolve(__dirname, 'dist'), // Thư mục đầu ra cho bundle
	},
}

export default config;

// module.exports = {
// 	entry: './src/main.js', // Tệp nguồn chứa mã JavaScript của bạn
// 	output: {
// 		filename: 'bundle.js', // Tên tệp bundle đầu ra
// 		path: path.resolve(__dirname, 'dist'), // Thư mục đầu ra cho bundle
// 	},
// };
