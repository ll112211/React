import { getBaseRollupPlugin, getPackageJSON, resolvePkgName } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';
const { name, module } = getPackageJSON('react-dom');
// react-dom包的路径
const pkgPath = resolvePkgName(name);
// react-dom包的产物路径
const pkgDistPath = resolvePkgName(name, true);
export default [
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd'
			}
		],
		plugins: [
			...getBaseRollupPlugin(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, version, description }) => ({
					name,
					version,
					description,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	}
];
