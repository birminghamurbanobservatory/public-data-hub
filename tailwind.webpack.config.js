/**
 * Config file sets up angular build process to include Tailwind CSS
 * 
 */

module.exports = (config, options) => {

    console.log(`Using '${config.mode}' mode`);

    config.module.rules.push({
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require('postcss-import'),
                        require('tailwindcss')('./tailwind.config.js'),
                        require('autoprefixer'),
                    ]
                }
            }
        ]
    });
    return config;
};