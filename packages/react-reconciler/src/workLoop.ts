import { beginWork } from './beginWorks';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

// 全局指针来表达正在工作的FiberNode
let workInPropgress: FiberNode | null = null;

/***
 * @description 将WorkInPropgress指向第一个FiberNode
 * */
function prepareFreshStack(fiber: FiberNode) {
	workInPropgress = xxx;
}

/***
 * @description 初始化 完成后执行递归的流程
 **/
function renderRoot(root: FiberNode) {
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
			console.warn('workLoop发生错误', e);
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
