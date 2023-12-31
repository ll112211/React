export type Key = any;
export type Type = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;
export interface ReactElement {
	$$typeof: symbol | number;
	key: Key;
	type: ElementType;
	ref: Ref;
	props: Props;
	__mark: string;
}
