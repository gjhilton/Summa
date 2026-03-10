/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(config) {
    config.css = {
      postcss: "src/config/postcss.config.cjs",
    }
    return config
  },
}
