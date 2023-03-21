import { INodeProcess } from "./INodeProcess";
import { OperatingSystem } from "./OperatingSystem";
import { Platform } from "./Platform";

export * from './INodeProcess';
export * from './IProcessEnvironment';
export * from './OperatingSystem';
export * from './Platform';

export const LANGUAGE_DEFAULT = 'en';

let _os = OperatingSystem.Unknown;
let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _isNative = false;
let _isWeb = false;
let _locale: string | undefined;
let _language: string | undefined;
let _translationsConfigFile: string | undefined;

interface INLSConfig {
    locale: string;
    availableLanguages: { [key: string]: string };
    _translationsConfigFile: string;
}

declare let process: INodeProcess;
declare let global: any;

interface INavigator {
    userAgent: string;
    language: string;
}
declare let navigator: INavigator;
declare let self: any;

export const isElectronRenderer = (
    process !== undefined
    && process.versions !== undefined
    && process.versions.electron !== undefined
    && process.type === 'renderer'
);

// OS detection
if (typeof navigator === 'object' && !isElectronRenderer) {
    const userAgent = navigator.userAgent;
    _isWindows = userAgent.includes('Windows');
    _isMacintosh = userAgent.includes('Macintosh');
    _isLinux = userAgent.includes('Linux');
    _isWeb = true;
    _locale = navigator.language;
    _language = _locale;
} else if (typeof process === 'object') {
    _isWindows = (process.platform === 'win32');
    _isMacintosh = (process.platform === 'darwin');
    _isLinux = (process.platform === 'linux');
    _locale = LANGUAGE_DEFAULT;
    _language = LANGUAGE_DEFAULT;
    const rawNlsConfig = process.env.SCATTER_NLS_CONFIG;
    if (rawNlsConfig) {
        try {
            const nlsConfig: INLSConfig = JSON.parse(rawNlsConfig);
            const resolved = nlsConfig.availableLanguages['*'];
            _locale = nlsConfig.locale;
            // Scatter's default language is 'en'
            _language = resolved ?? LANGUAGE_DEFAULT;
            _translationsConfigFile = nlsConfig._translationsConfigFile;
        } catch {
        }
    }
    _isNative = true;
}

let _platform: Platform = Platform.Web;
if (_isNative) {
    if (_isMacintosh) {
        _platform = Platform.Mac;
        _os = OperatingSystem.Macintosh;
    } else if (_isWindows) {
        _platform = Platform.Windows;
        _os = OperatingSystem.Windows;
    } else if (_isLinux) {
        _platform = Platform.Linux;
        _os = OperatingSystem.Linux;
    }
}

const _defaultUserDataPath = typeof process === 'object'
    ? (process.env.APPDATA || (
        process.platform === 'darwin'
            ? process.env.HOME + 'Library/Preferences'
            : process.env.HOME + '/.local/share'
    ))
    : '';

export const isWindows: boolean = _isWindows;

export const isMacintosh: boolean = _isMacintosh;

export const isLinux: boolean = _isLinux;

export const isNative: boolean = _isNative;

export const isWeb: boolean = _isWeb;

export const platform: Platform = _platform;

export const os: OperatingSystem = _os;

/**
 * Directory for data files.
 */
export const defaultUserDataPath: string = _defaultUserDataPath;

/**
 * The language used for the user interface. The format of
 * the string is all lower case (e.g. zh-tw for Traditional
 * Chinese)
 */
export const language = _language;

/**
 * The OS locale or the locale specified by --locale. The format of
 * the string is all lower case (e.g. zh-tw for Traditional
 * Chinese). The UI is not necessarily shown in the provided locale.
 */
export const locale = _locale;

/**
 * The translations that are available through language packs.
 */
export const translationsConfigFile = _translationsConfigFile;


const _globals = (typeof self === 'object' ? self : (typeof global === 'object' ? global : {} as any));
export const globals: any = _globals;

export const newLine = isWindows ? '\r\n' : '\n';


export function toString(): string;
export function toString(plat?: Platform): string {
    plat = (plat || platform);
    switch (plat) {
        case Platform.Web: {
            return 'Web';
        }
        case Platform.Mac: {
            return 'Mac';
        }
        case Platform.Linux: {
            return 'Linux';
        }
        case Platform.Windows: {
            return 'Windows';
        }
    }
}

let _setImmediate: ((callback: (...args: any[]) => void) => number) | null = null;
export function setImmediate(callback: (...args: any[]) => void): number {
    if (_setImmediate === null) {
        if (globals.setImmediate) {
            _setImmediate = globals.setImmediate.bind(globals);
        } else if (process !== undefined && typeof process.nextTick === 'function') {
            _setImmediate = process.nextTick.bind(process);
        } else {
            _setImmediate = globals.setTimeout.bind(globals);
        }
    }
    return _setImmediate!(callback);
}
