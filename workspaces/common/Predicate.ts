export type Predicate<TInput = any> = (input: TInput) => boolean;

export const ALWAYS: Predicate<any> = (_) => true;

export const NEVER: Predicate<any> = (_) => false;
