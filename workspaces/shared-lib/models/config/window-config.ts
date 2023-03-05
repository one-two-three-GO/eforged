import { BrowserWindowConstructorOptions } from 'electron';
import { Config } from './config';

export interface WindowConfig extends Config, BrowserWindowConstructorOptions {
	/** Tells if we can open dev tools. */
	canOpenDevTools: boolean;

	/** Tells if `isEnableRemoteModule` webPreference is enabled */
	enableRemoteModule: boolean;

	/** The relative path to the window icon, if any. */
	iconPath: string;
}

const DEFAULT_ELECTRON_WINDOW_CONFIG: Readonly<BrowserWindowConstructorOptions> =
	{
		width: 800,
		height: 600,
		minWidth: 0,
		maxWidth: 0,
		center: false,
		useContentSize: false,
		resizable: true,
		movable: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		focusable: true,
		alwaysOnTop: false,
		fullscreen: false,
		fullscreenable: true,
		simpleFullscreen: false,
		skipTaskbar: false,
		kiosk: false,
		title: 'Electron',
		show: true,
		paintWhenInitiallyHidden: true,
		frame: true,
		// eslint-disable-next-line unicorn/no-null
		parent: null,
		modal: false,
		disableAutoHideCursor: false,
		autoHideMenuBar: false,
		enableLargerThanScreen: false,
		backgroundColor: '#FFF',
		hasShadow: true,
		darkTheme: false,
		transparent: false,
		titleBarStyle: 'default',
		roundedCorners: true,
		thickFrame: true,
		zoomToPageWidth: false,
		titleBarOverlay: false,
		webPreferences: {
			devTools: true,
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			zoomFactor: 1,
			javascript: true,
			webSecurity: true,
			allowRunningInsecureContent: false,
			images: true,
			imageAnimationPolicy: 'animate',
			textAreasAreResizable: true,
			webgl: true,
			plugins: false,
			experimentalFeatures: false,
			scrollBounce: false,
			defaultFontSize: 16,
			defaultMonospaceFontSize: 13,
			minimumFontSize: 0,
			defaultEncoding: 'ISO-8859-1',
			backgroundThrottling: true,
			offscreen: false,
			contextIsolation: true,
			webviewTag: false,
			safeDialogs: false,
			disableDialogs: false,
			navigateOnDragDrop: false,
			autoplayPolicy: 'no-user-gesture-required',
			disableHtmlFullscreenWindowResize: false,
			spellcheck: true,
			enableWebSQL: true,
			enablePreferredSizeMode: false,
		},
	};

export const DEFAULT_WINDOW_CONFIG = Object.freeze(
	Object.assign({}, DEFAULT_ELECTRON_WINDOW_CONFIG, {
		configId: 'production',
		canOpenDevTools: true,
		iconPath: '',
		enableRemoteModule: false,
	})
);
