import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElement } from 'shared/ReactType';
import { scheduleUpdateOnFiber } from './workLoop';
/**
 * @description createDom 执行后 内部会调用这个方法
 * @param {Container} container
 * */
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}
/**
 * @description createDom().render 执行后 内部会调用这个方法
 * */
export function updateContainer(
	element: ReactElement | null,
	root: FiberRootNode
) {
	console.log('执行了', __DEV__, root);

	const hostRootFiber = root.current;
	const update = createUpdate<ReactElement | null>(element);

	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
