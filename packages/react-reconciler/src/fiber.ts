import { Props, Key, Ref, ReactElement } from 'shared/ReactType';
import { FunctionComponent, HostComponets, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	type: any;
	tag: any;
	stateNode: any;
	key: Key;
	pendingProps: Props;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	subTreeFlags: Flags; //代表儿子树中的flags
	updateQueue: unknown;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		//  fiberNode 类型  对于Funcompent tag就是0
		this.type = null;

		// 构成树状结构
		this.return = null; //指向父Fiber
		this.sibling = null; // 右边兄弟fiber
		this.child = null; // 儿子
		/**
		 *  同级
		 *  <ul>
		 *      <li>0</li> index = 0
		 *      <li>1</li> index = 1
		 *  </ul>
		 * */
		this.index = 0;

		// 作为工作单元
		this.pendingProps =
			pendingProps; /**这个工作单元刚开始准备是什么 是一个用于存储当前 Fiber 节点即将要渲染时的属性（props）的字段**/
		this.memoizedProps =
			null; /**确定下来的pendingProps 也就是存储当前 Fiber 节点上一次渲染时的属性（props）的字段**/
		this.updateQueue = null;
		this.memoizedState = null;
		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
		this.subTreeFlags = NoFlags;
	}
}
/**
 * react.reactRoot(rootElement).render(<App/>)
   FiberRootNode 项目根fiber react.reactRoot
* */
export class FiberRootNode {
	container: Container; // 保存宿主环境挂在的节点
	current: FiberNode;
	finishedWork: FiberNode | null; //更新完成以后的hostRootFiber

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInprogress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// 首屏渲染就是null mount 阶段
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		wip.alternate = wip;
	} else {
		// update阶段
		wip.pendingProps = pendingProps;
		// 清理副作用
		wip.flags = NoFlags;
		wip.subTreeFlags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;
	return wip;
};

/**
 * @description 根据element 创建fiber
 */
export function createFiberFromElement(element: ReactElement): FiberNode {
	const { type, props, key } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		fiberTag = HostComponets;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
