module.exports = {
    framework: '@storybook/react',
    stories: ['../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-docs'],
    core: {
        builder: "@storybook/builder-vite",
    },
    async viteFinal(config, { configType }) {
        // customize the Vite config here
        return config;
    }
};