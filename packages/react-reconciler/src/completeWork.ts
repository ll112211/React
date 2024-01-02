import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponets, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponets:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				/**
				 *    构建离屏dom树
				 *       - 构建DOM
				 *       - 将dom插入到dom树中
				 * */
				const instance = createInstance(wip.type, newProps); //构建DOM
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				/**
				 *    构建离屏dom树
				 *       - 构建DOM
				 *       - 将dom插入到dom树中
				 * */
				const instance = createTextInstance(newProps.content); //构建DOM
				wip.stateNode = instance;
			}
			return null;
		case HostRoot:
			return null;
		default:
			if (__DEV__) {
				console.log('未处理的completeWork', wip);
			}
			break;
	}
};

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
	let node = wip.child;
	while (node !== null) {
		if (node?.tag === HostComponets || node?.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === wip) {
			return;
		}
		while (node.siblind === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.siblind.return = node.return;
		node = node.siblind;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subTreeFlags = NoFlags;
	let child = wip.child;
	while (child !== null) {
		subTreeFlags |= child.subTreeFlags;
		subTreeFlags |= child.flags;
	}
	child.return = wip;
}
