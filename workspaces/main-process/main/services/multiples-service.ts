import { WindowApiConst } from "common/apis";
import { IPCService } from "./ipc-service";

export class MultiplesService extends IPCService<number, number[]> {
  receptionChannel: string = WindowApiConst.MULTIPLES_INPUT;
  sendingChannel: string = WindowApiConst.MULTIPLES_OUTPUT;

  process(input: number): number[] {
    // From 1 to 10, return input multiples
    const multiples = [];
    for (let n = 1; n <= 10; n++) {
      multiples.push(n * input);
    }
    return multiples;
  }
}
