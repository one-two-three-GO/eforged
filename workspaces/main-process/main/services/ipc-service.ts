// const NOT_IMPEMENTED_YET = 'Method not implemented yet.';
export abstract class IPCService<In, Out> {
  abstract readonly receptionChannel: string;
  abstract readonly sendingChannel: string;

  abstract process(_input: In): Out;
}
