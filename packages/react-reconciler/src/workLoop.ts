import { beginWork } from './beginWorks';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInprogress } from './fiber';
import { HostRoot } from './workTags';

// 全局指针来表达正在工作的 FiberNode
let workInPropgress: FiberNode | null = null;

/***
 * @description 将 WorkInPropgress 指向第一个FiberNode
 * */

function prepareFreshStack(root: FiberRootNode) {
	workInPropgress = createWorkInprogress(root.current, {});
}

/**
 * @description 将 creatContainer 和 render 连接
 */

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	const root = markUpdateFromFiberToRoot(fiber); //fiberRootNode
	renderRoot(root);
}

/**
 * @description 从当前的fiber一直向上遍历到根节点
 * */

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		//如果跳出循环 那么就到了hostRootFiber
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		node.stateNode;
		return node.stateNode;
	}
	return null;
}

/***
 * @description 初始化 完成后执行递归的流程
 **/

function renderRoot(root: FiberRootNode) {
	/***
	 *  谁会调用此方法？
	 *      常见的触发更新的方式
	 *      ReactDom.createDom().render or 老版的ReactDom.render
	 *      this.setState classComponent
	 *      useState的dispatch方法
	 *  更新机制的组成部分
	 *      - 代表更新的数据结构---update
	 *      - 消费update的数据结构---updateQueue
	 ***/
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}

			workInPropgress = null; //抓到错误重置 WorkInPropgress
		}
	} while (true);
}

function workLoop() {
	while (workInPropgress !== null) {
		performUnitOfWork(workInPropgress);
	}
}
function performUnitOfWork(fiber: FiberNode) {
	/*
       只有以下两种结果
          1. 儿子的fiber  那么继续往下执行
          2. null --- 没有子fiber
    **/
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInPropgress = next;
	}
}
/**
 * @description 如果有子节点就便利子节点 如果没有就便利兄弟节点
 * **/
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);

		const siblind = node.siblind;
		if (siblind !== null) {
			workInPropgress = siblind;
			return;
		}
		node = node.return;
		workInPropgress = node;
	} while (node !== null);
}
