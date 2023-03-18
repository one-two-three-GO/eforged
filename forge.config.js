module.exports = {
  packagerConfig: {
    name: "Electron Angular App",
    executableName: "electron-angular-app",
    icon: "./workspaces/main-process/main/assets/icons/icon",
  },
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./workspaces/main-process/renderer/index.html",
              js: "./workspaces/main-process/renderer/index.ts",
              name: "main_window",
              preload: {
                js: "./workspaces/main-process/renderer/preload.ts",
              },
            },
          ],
        },
      },
    },
  ],
};
