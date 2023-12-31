import { Props, Key, Ref } from 'shared/ReactType';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
export class FiberNode {
	type: any;
	tag: any;
	stateNode: any;
	key: Key;
	pendingProps: Props;
	ref: Ref;

	return: FiberNode | null;
	siblind: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		//  fiberNode 类型  对于Funcompent tag就是0
		this.type = null;

		// 构成树状结构
		this.return = null; //指向父Fiber
		this.siblind = null; // 右边兄弟fiber
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

		this.alternate = null;
		this.flags = NoFlags; // 副作用
	}
}
