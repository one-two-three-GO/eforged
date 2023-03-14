import { Config } from "./config";
import { WindowConfig } from "./window-config";

export interface AppConfig extends WindowConfig, Config {
  /** The main logger output file path */
  mainLogFile: string;

  /** The main logger output level */
  mainLogLevel: string;
}
