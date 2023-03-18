import * as remoteMain from "@electron/remote/main";
import { app, BrowserWindow, ipcMain, nativeImage } from "electron";
import path from "node:path";
import { WindowConfig, DEFAULT_WINDOW_CONFIG } from "common/config";
import { IPCService } from "../services/ipc-service";
import { Logger } from "../utils/logger";

export abstract class Window {
  protected config: WindowConfig;

  protected _browserWindow: BrowserWindow | undefined;
  public get browserWindow(): BrowserWindow | undefined {
    return this._browserWindow;
  }

  protected constructor(windowConfig: WindowConfig) {
    this.config = windowConfig;
    this._browserWindow = Window.create(windowConfig);
    this.initialize();
  }

  protected initialize(): void {
    /** NOOP */
  }

  protected registerIPCService<In, Out>(service: IPCService<In, Out>) {
    ipcMain.on(
      service.receptionChannel,
      async (event: Electron.IpcMainEvent, ...parameters: any[]) => {
        // Handling input
        const input = parameters[0];
        Logger.debug(`[${service.receptionChannel}]  =====> `, input);
        const output: Out = service.process(input);

        // Handling output
        if (service.sendingChannel) {
          Logger.debug(`[${service.sendingChannel}] =====> `, output);
          this.browserWindow.webContents.send(service.sendingChannel, output);
        }
      }
    );
  }

  protected openDevTools(): void {
    if (this.config.canOpenDevTools) {
      this.browserWindow.webContents.on("devtools-opened", () => {
        this.browserWindow.focus();
        setImmediate(() => {
          this.browserWindow.focus();
        });
      });
      this.browserWindow.webContents.openDevTools();
    }
  }

  protected static loadIcon(
    config: WindowConfig
  ): Electron.NativeImage | undefined {
    let iconObject;
    if (config.iconPath) {
      const iconPath = path.join(__dirname, config.iconPath);
      Logger.debug("Icon Path", iconPath);
      iconObject = nativeImage.createFromPath(iconPath);
      // Change dock icon on MacOS
      if (iconObject && process.platform === "darwin") {
        app.dock.setIcon(iconObject);
      }
    }
    return iconObject;
  }

  public static create(config: WindowConfig): BrowserWindow {
    config = Window.normalizeConfig(config);
    const win: BrowserWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      backgroundColor: "#FFFFFF",
      icon: Window.loadIcon(config),
      webPreferences: {
        // Default behavior in Electron since 5, that
        // limits the powers granted to remote content
        // except in e2e test when those powers are required
        nodeIntegration: config.webPreferences.nodeIntegration,

        // Isolate window context to protect against prototype pollution
        // except in e2e test when that access is required
        contextIsolation: config.webPreferences.contextIsolation,

        // Introduced in Electron 20 and enabled by default
        // Among others security constraints, it prevents from required
        // CommonJS modules imports into preload script
        // which is not bundled yet in dev mode
        sandbox: config.webPreferences.sandbox,

        // Use a preload script to enhance security
        preload: config.webPreferences.preload,
      },
    });

    // Disable the remote module to enhance security
    // except in e2e test when that access is required
    if (config.enableRemoteModule) {
      remoteMain.enable(win.webContents);
    }

    return win;
  }

  private static normalizeConfig(config: WindowConfig): WindowConfig {
    return Object.assign({}, DEFAULT_WINDOW_CONFIG, config);
  }
}
