import ts from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

const getBaseRollupPlugin = ({
	alias = {
		__DEV__: true,
		preventAssignment: true
	},
	typescript = {}
} = {}) => [replace(alias), commonjs(), ts(typescript)];

const resolvePkgName = (pkgName, isDist) => {
	if (isDist) {
		return distPath + '/' + pkgName;
	}
	return pkgPath + '/' + pkgName;
};

const getPackageJSON = (pkgName) => {
	const path = resolvePkgName(pkgName) + '/' + 'package.json';
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
};

export { getBaseRollupPlugin, getPackageJSON, resolvePkgName };
