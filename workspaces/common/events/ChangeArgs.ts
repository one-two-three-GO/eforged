export type ArrayChangeArgs<TEntry = any> = {
    added?: TEntry[];
    removed?: TEntry[];
};

export type ChangeArgs<T = any> = Partial<T> & {
    old?: T;
    new?: T;
};

