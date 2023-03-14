export type UserAgentName =
  | "chrome"
  | "opera"
  | "msie"
  | "mozilla"
  | "safari"
  | "webkit";

export interface UserAgent {
  browser: string;
  version: string;
}

export type BrowserInfo = {
  chrome?: boolean;
  opera?: boolean;
  msie?: boolean;
  mozilla?: boolean;
  safari?: boolean;
  webkit?: boolean;
  version?: string;
} & {
  [key: string]: boolean;
};

export interface Dimensions {
  width: number;
  height: number;
}

export type AppendToTarget = "body" | "target" | "self" | Element | unknown;

export interface PositionOffset {
  top: number;
  left: number;
}
