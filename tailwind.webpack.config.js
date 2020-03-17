/**
 * Config file sets up angular build process to include Tailwind CSS
 * 
 */

const purgecss = require('@fullhuman/postcss-purgecss')({
    // Specify the paths to all of the template files in your project
    content: ['./src/**/*.html', './src/**/*.component.ts'],
    // Regex updated for Tailwind CSS
    defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
});

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
                        ...(config.mode === 'production' ? [purgecss] : [])
                    ]
                }
            }
        ]
    });
    return config;
};