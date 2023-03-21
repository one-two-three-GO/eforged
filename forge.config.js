module.exports = {
	packagerConfig: {
		name: 'eForged',
		executableName: 'eforged',
		icon: './workspaces/electron-app/main/assets/icons/icon',
	},
	makers: [
		{
			name: '@electron-forge/maker-dmg',
			config: {},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-squirrel',
			config: {},
		},
	],
	plugins: [
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				mainConfig: './webpack.main.config.js',
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [
						{
							html: './workspaces/electron-app/renderer/index.html',
							js: './workspaces/electron-app/renderer/index.ts',
							name: 'main_window',
							preload: {
								js: './workspaces/electron-app/renderer/preload.ts',
							},
						},
					],
				},
			},
		},
	],
};
