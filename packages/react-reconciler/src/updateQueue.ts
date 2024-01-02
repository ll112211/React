import { Action } from 'shared/ReactType';
/*
    更新机制的组成部分
        - 代表更新的数据结构 update
        - 消费update的数据结构 updateQueue
**/
export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

/**
 * @description updateQueue中增加update
 * **/
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

/**
 * @description UpdateQueue消费UpdateQueue
 * @param baseState 初始状态
 * @param pendingUpdate 消费状态
 * **/
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizeState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizeState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;

		if (action instanceof Function) {
			result.memoizeState = action(baseState);
		} else {
			result.memoizeState = action;
		}
	}
	return result;
};
