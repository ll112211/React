/**感觉每一个都有对应的filber*/

/**组件**/
export const FunctionComponent = 0;
/**App根节点  reactDom.render**/
export const HostRoot = 3;
/**div div对应的filber**/
export const HostComponets = 5;
/**<div>123</div> 123对应的filber**/
export const HostText = 6;
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponets
	| typeof HostText;
