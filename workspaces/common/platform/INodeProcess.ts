import { IProcessEnvironment } from "./IProcessEnvironment";


export interface INodeProcess {
    platform: string;
    env: IProcessEnvironment;
    nextTick: Function;
    versions?: {
        electron?: string;
    };
    type?: string;

    getuid(): number;
}
