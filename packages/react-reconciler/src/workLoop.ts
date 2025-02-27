import { beginWork } from './beginWorks';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInprogress } from './fiber';
import { NoFlags, mutationMask } from './fiberFlags';
import { HostRoot } from './workTags';

/**
 *  fiber : 书(第68页) 前缓存 后缓存
 *   	- current：前缓存中的fiber
 *   	- wip(woker in progress): 后缓存
 * 	 	- finisedWork：代表wip hostRootFiber 即render阶段构建的 Wip Fiber Tree 的hostRootFiber
 */

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
	console.log(root);
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
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	/**
	 *  commit阶段包含三个子阶段
	 *  	- beforeMutation : 突变前
	 * 		- mutation(突变): 大概意思就是将一个属性值直接变为另外一个值(操作dom API[style color<red> ===> <yellow> ] 就是突变)
	 * 		- layout: 突变后
	 *
	 *  commit阶段要执行的任务
	 *  	- fiber树切换
	 * 		- 执行placeme对应操作
	 * */
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.log('commit阶段开始');
	}

	// 重置操作
	root.finishedWork = null; // 已经被 finishedWork 保存了

	// 判断三个子阶段 是否存在三个子阶段执行的操作

	// 判断两个flags  root本身的flags root的subTreeFlags(冒泡上去的tree)
	const subTreeHasEffect =
		(finishedWork.subTreeFlags & mutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & mutationMask) !== NoFlags;
	if (subTreeHasEffect || rootHasEffect) {
		// beforMutation
		// mutation placement
		commitMutationEffects(finishedWork);
		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
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
		workInPropgress = next as FiberNode;
	}
}
/**
 * @description 如果有子节点就便利子节点 如果没有就便利兄弟节点
 * **/
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);

		const sibling = node.sibling;
		if (sibling !== null) {
			workInPropgress = sibling;
			return;
		}
		node = node.return;
		workInPropgress = node;
	} while (node !== null);
}
