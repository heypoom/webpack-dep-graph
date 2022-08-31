const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
	entry: "./src/index.ts",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		fallback: {
            child_process: false, // https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
			fs: false, // https://github.com/opengsn/gsn/issues/778
			tty: false, // https://stackoverflow.com/questions/68618902/webpack-cannot-read-property-readfile-of-undefined-no-output-files
			// "tty": require.resolve("tty-browserify")
			// "path": require.resolve("path-browserify")
			// "fs": require.resolve("fs-browserify")
		},
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new NodePolyfillPlugin({
			// https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
			excludeAliases: ["console"],
		}),
	]
}
