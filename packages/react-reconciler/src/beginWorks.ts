// 递归中的递阶段

import { ReactElement } from 'shared/ReactType';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponets, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcilerChildFibers } from './childFibers';

/**
 *   比较
 *   返回子fiberNode
 * */
export const beginWork = (wip: FiberNode) => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponets:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork为实现的类型');
			}
			break;
	}
};

/**
 *  计算状态的最新值 创造子fiberNode
 */

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null; //计算完之前的没有用了 所有赋值null
	const { memoizeState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizeState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 *  创造子 fiberNode； HostText没有beginWork工作流程(因为他没有子节点)
 */

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * @description 创造子 fiberNode
 */

function reconcileChildren(wip: FiberNode, children: ReactElement) {
	const current = wip.alternate;
	if (current !== null) {
		//update流程
		wip.child = reconcilerChildFibers(wip, current.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
