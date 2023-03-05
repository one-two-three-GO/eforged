import { WindowApi } from './apis/window-api';
export * from './apis/window-api';
export * from './apis/window-api-consts';
export * from './models/config/app-config';
export * from './models/config/window-config';

declare global {
	// Global augmentation of the `Window` interface
	interface Window {
		api: WindowApi;
	}
}
