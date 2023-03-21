import { ipcMain } from 'electron';
import * as path from 'node:path';
import { MultiplesService } from '../services/multiples-service';
import { AppConfig } from 'common';
import { Window } from './window';

declare const global: Global;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class MainWindow extends Window {
	constructor(appConfig?: AppConfig) {
		super(MainWindow.enhanceConfig(appConfig ?? global.appConfig));
		this.registerIPCService<number, number[]>(new MultiplesService());
	}

	private static enhanceConfig(appConfig: AppConfig): AppConfig {
		appConfig.webPreferences.preload = MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY;
		return appConfig;
	}

	protected initialize(): void {
		if (this.config.configId === 'development') {
			// Dev mode, take advantage of the live reload by loading local URL
			this.browserWindow.loadURL(`http://localhost:4200`);
		} else {
			// Else mode, we simply load angular bundle
			const indexPath = path.join(
				__dirname,
				'../renderer/angular_window/index.html'
			);
			this.browserWindow.loadURL(`file://${indexPath}`);
		}

		if (this.config.canOpenDevTools && this.config.webPreferences.devTools) {
			this.openDevTools();
		}

		// When the window is closed`
		this.browserWindow.on('closed', () => {
			// Remove IPC Main listeners
			ipcMain.removeAllListeners();
			// Delete current reference
			delete this._browserWindow;
		});
	}
}
