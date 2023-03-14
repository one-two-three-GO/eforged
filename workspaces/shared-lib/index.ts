/** The public API for the menus module. */
// export only what's needed for the PUBLIC API.

export * from "./apis";
export * from "./config";

import { WindowApi } from "./apis/window-api";

declare global {
  // Global augmentation of the `Window` interface
  interface Window {
    api: WindowApi;
    MSStream: unknown;
  }
}
