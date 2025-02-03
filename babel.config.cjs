module.exports = {
    presets: [
        [
            "@babel/preset-env",
            { targets: { esmodules: true }, modules: "commonjs" },
        ],
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
        [
            "babel-preset-vite",
            {
                env: true,
                glob: false,
            },
        ],
    ],
    plugins: [
        "@babel/plugin-transform-runtime",
        "babel-plugin-transform-import-meta",
    ],
};
