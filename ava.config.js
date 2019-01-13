
export default {
	files: [
		'./tests/virtualFile.js'
	],
	sources: [
		'./virtualFile.ts'
	],
	cache: true,
	concurrency: 10,
	tap: true,
	failFast: true,
	verbose: true,
	compileEnhancements: false,
	extensions: [
		'ts'
	],
	require: [
		'ts-node/register'
	]
}
