# nextjs-tailwindcss template

next.js template including tailwindcss, **check out** the [jsx-tailwind](https://github.com/andybroger/nextjs-tailwindcss/tree/jsx-tailwind) branch if you need support for @apply rules in styled-jsx.

**Features**

- Includes Tailwindcss
- Includes postcss-preset-env
- now uses tailwindcss 1.4.x purge method on production builds

## usage

1. Clone this repo
2. npm install
3. npm run dev

## notes

**styles/main.css**
The styles/main.css files includes tailwindcss imports and also supports global styles. It is processed by postcss and with postcss-preset-env supports nesting and other cool stuff.

**postcss.config.js**
The configuration file for postcss.

**tailwind.config.js**
You should know that file, its the default config generated with `npx tailwindcss init`. It's where your tailwindcss config goes.

**pages/\_app.js**
Here we integrate `styles/main.css` into the app.
