module.exports = {
	presets: ['@vue/app', ["@babel/env", {
		"modules": false
	}]],
	plugins: [
		"@babel/plugin-transform-runtime",
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-object-rest-spread",
		['import', {
			libraryName: 'vant',
			libraryDirectory: 'es',
			style: true
		}, 'vant'],
		["component", {
			libraryName: "element-ui",
			styleLibraryName: "theme-chalk"
		}]
	]
};
