# eForged

## Overview

A quick-start for Electron with Angular.

### Versions

| Dependency                                      | Version |
| ----------------------------------------------- | ------- |
| [Electron Forge](https://www.electronforge.io/) | 6.0.5   |
| [Electron](https://www.electronjs.org/)         | 23.1.2  |
| [Angular](https://angular.io/)                  | 15.2.1  |
| [TypeScript](https://www.typescriptlang.org/)   | 4.9.5   |

### Main features :

- This project is based on last [Angular 14](https://angular.io/) version with required dependencies for [Electron 18](https://www.electronjs.org/).
- This project is also written in [Typescript 4](https://www.typescriptlang.org/) and includes test samples ([WebdriverIO](https://webdriver.io/) and [Jasmine](https://jasmine.github.io/)).
- The app is runnable `on desktop` (with **live-reload** in `development mode`).
- The app is also runnable `on browser` but **without Electron features**.
- You can generate your platform distributables thanks to [`electron-forge`](https://www.electronforge.io/).
- You are also granted a minimal size for your app thanks to the packaging based on its[`webpack-template`](https://www.electronforge.io/templates/typescript-+-webpack-template).

### Project structure :

```
./
 ├── CHANGELOG.md
 ├── LICENSE
 ├── README.md
 ├── _config.yml
 ├── commitlint.config.js
 ├── forge.config.js
 ├── package-lock.json
 ├── package.json
 ├── tsconfig.json
 ├── webpack.main.config.js
 ├── webpack.plugins.js
 ├── webpack.renderer.config.js
 ├── webpack.rules.js
 └── workspaces/
      ├── renderer/          # Angular source directory (web renderer part)
      ├── main-process/      # Electron source directory (main & preload part)
      └── common/            # Shared source directory (common part)
```

## Getting started

To clone and run this repository, you'll need installed on your computer at least :

- [Git](https://git-scm.com)
- [Node LTS 14.15.0 or later](https://nodejs.org/en/download/)
- [Npm 7 or later](https://docs.npmjs.com/about-npm)
- [Angular-CLI 14 or later](https://angular.io/cli)

Then from your command line:

```bash
# Upgrade to the latest version of npm (if necessary)
npm install -g npm@latest

# Upgrade to the latest version of Angular CLI (if necessary)
npm install -g @angular/cli@latest

# Clone this repository
git clone https://github.com/sourcygen/electron-angular-quick-start.git

# Then go into the repository
cd electron-angular-quick-start

# After that, install dependencies
npm install

# And finally run the app (dev mode)
npm start
```

## How to use

| Command                     | Description                              |
| --------------------------- | ---------------------------------------- |
| `npm run install`           | Install dependencies                     |
| `npm run start`             | Run the app on desktop (dev mode)        |
| `npm run start:renderer`    | Run the app on browser (dev mode)        |
| `npm run test:angular-e2e`  | Run **angular** end-to-end tests         |
| `npm run test:electron-e2e` | Run **electron** end-to-end tests        |
| `npm run package`           | Build and prepare application content    |
| `npm run make`              | Generate platform distributables (./out) |
| `npm run clean`             | Delete generated outputs                 |

## Behind a proxy

After settings **HTTP_PROXY** and **HTTPS_PROXY** environment variables :

```bash
# Install dependencies
npx cross-env ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=%HTTPS_PROXY% npm install
```

### Adding dependencies

This project architecture is based on [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). This allows having different version of the same dependency depending on your workspace :

- main-process
  `npm install --save <dependency>`
- renderer
  `npm install --save <dependency> -w renderer`
- common
  `npm install --save <dependency> -w common`

### Listing outdated dependencies

- main-process
  `npm run outdated-deps:main-process`
- renderer
  `npm run outdated-deps:renderer`
- common
  `npm run outdated-deps:common`
- all of them
  `npm run outdated-deps`

### Updating dependencies

- main-process
  `npm run update-deps:main-process`
- renderer
  `npm run update-deps:renderer`
- common
  `npm run update-deps:common`
- all of them
  `npm run update-deps`

### Customizing app icons

```bash
# Install the icon generator globally
npm i -g electron-icon-maker

# Run following command from anywhere you have your input file (1024px at least) to generate platforms icons
electron-icon-maker --input=icon.png --output=./out
```

Rename and move files to match with next config

- ./workspaces/main-process/main/assets/icons/icon.png for Linux
- ./workspaces/main-process/main/assets/icons/icon.icns for MacOs
- ./workspaces/main-process/main/assets/icons/icon.ico for Windows

## Resources

### Based On `electron-angular-quick-start`

- [electron-angular-quick-start](https://sourcygen.github.io/electron-angular-quick-start/) by sourcygen

### Electron

- [electronjs.org/docs](https://electronjs.org/docs) - Electron's documentation
- [electron/simple-samples](https://github.com/electron/simple-samples) - Small applications with ideas to take further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - Sample app that teaches you how to use Electron

### Angular

- [angular.io/start](https://angular.io/start) - Getting started with Angular
- [angular.io/docs](https://angular.io/docs) - Angular's documentation
- [cli.angular.io](https://cli.angular.io/) - Angular CLI documentation
