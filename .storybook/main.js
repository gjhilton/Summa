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
    config.define = {
      ...config.define,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0"),
    }
    return config
  },
}
