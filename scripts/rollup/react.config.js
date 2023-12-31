import { getBaseRollupPlugin, getPackageJSON, resolvePkgName } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module } = getPackageJSON('react');
const pkgPath = resolvePkgName(name);
const pkgDistPath = resolvePkgName(name, true);
export default [
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugin(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, version, description }) => ({
					name,
					version,
					description,
					main: 'index.js'
				})
			})
		]
	},
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'index.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugin()
	}
];
