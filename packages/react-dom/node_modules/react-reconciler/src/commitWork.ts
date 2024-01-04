import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { NoFlags, Placment, mutationMask } from './fiberFlags';
import { HostComponets, HostRoot, HostText } from './workTags';
let nextEffect: FiberNode | null = null;
export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;
	console.log(nextEffect, 'nextEffect');

	/**
	 *  依据subTreeFlags
	 *  用递归从根节点往下找
	 */
	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subTreeFlags & mutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历
			up: while (nextEffect !== null) {
				const sibling: FiberNode | null = nextEffect.sibling;
				commitMutationEffectsOnFiber(nextEffect);
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
	// 执行到这里说明finishedWork 存在真正需要执行的flags
	const flags = finishedWork.flags;
	// flags placement
	if ((flags & Placment) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placment;
	}
	// flags update

	//flags childDeletion
}

/**
 * @description :执行插入
 */

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn('执行placeme对应操作', finishedWork);
	}
	// parent Dom
	const hostParent = getHostParent(finishedWork);
	// finishedWork  dom append parent Dom
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

/**
 * @description :获取宿主环境中的Parent节点
 */

function getHostParent(fiber: FiberNode) {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		// hostComponent HostRoot
		if (parentTag === HostComponets) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到Parent节点');
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber host 递归
	if (finishedWork.tag === HostComponets || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
