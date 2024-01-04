export type Flags = number;

export const NoFlags = 0b000000;
export const Placment = 0b000001;
export const Update = 0b000010;
export const ChildDeletion = 0b000100;

export const mutationMask = Placment | Update | ChildDeletion;
