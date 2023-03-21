/** Represents the method that will handle an event when the event provides data. */
export type Handler<TEventArgs = any> = (args: TEventArgs) => any;
