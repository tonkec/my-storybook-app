module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-docs', 'storybook-addon-mock/register'],
    core: {
        builder: "webpack5",
    }
};