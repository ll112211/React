import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Ref,
	Key,
	Props,
	ReactElement,
	ElementType
} from 'shared/ReactType';
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElement {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'liuchang'
	};
	return element;
};
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: any = null;
	const props: Props = {};
	let ref: Ref = null;
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + key;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
		const maybeChildrenLength = maybeChildren.length;
		if (maybeChildrenLength) {
			if (maybeChildrenLength === 1) {
				props.children = maybeChildren[0];
			} else {
				props.children = maybeChildren;
			}
		}
	}
	return ReactElement(type, key, ref, props);
};
export const jsxDev = jsx;
