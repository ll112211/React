import { ReactElement } from 'shared/ReactType';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placment } from './fiberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingeElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElement
	) {
		// 根据element 创建fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}
	function reconcileSingeTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}
	// 插入单一的节点
	function pleaceSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placment;
		}
		return fiber;
	}
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild: ReactElement
	) {
		// 判断当前fiber类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return pleaceSingleChild(
						reconcileSingeElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('为实现的reconcile类型', newChild);
					}
					break;
			}
			// 多节点情况 ul > li * 3

			// hostText
		}
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return pleaceSingleChild(
				reconcileSingeTextNode(returnFiber, currentFiber, newChild)
			);
		}
		if (__DEV__) {
			console.warn('为实现的reconcile类型', newChild);
		}
		return null;
	};
}

export const reconcilerChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
