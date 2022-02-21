const GasPlugin = require('gas-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.ts'
    },
    output: {
        filename: 'dist/[name].js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ]
    },
    plugins: [
        new GasPlugin(),
    ]
};