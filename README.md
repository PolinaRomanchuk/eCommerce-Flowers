# eCommerce-Application

# FloralMuse

Welcome to FloralMuse – Your Digital Garden of Elegance!
FloralMuse is an eCommerce platform designed to bring the beauty of nature into your home with just a few clicks. Our online flower and plant boutique offers a seamless, visually enchanting shopping experience, where every bloom and leaf is just a tap away.
Built with ReactJS and powered by a robust eCommerce backend, FloralMuse combines aesthetic elegance with intuitive functionality. Discover a curated selection of fresh flowers, exotic plants, handcrafted bouquets.
Shop effortlessly. Let FloralMuse inspire your space. 🌿🌸

https://floral-muse.netlify.app/

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Requirements](#requirements)
* [Installation & Running](#installation--running)
* [Configuration](#configuration)
* [Available Scripts](#available-scripts)
* [Git Hooks (Husky)](#git-hooks-husky)
* [Project Structure](#project-structure)
* [License](#license)
* [Links](#links)

## Features

* Browse a catalog of flowers
* Add products to the shopping cart
* Place orders via Commercetools
* Responsive design for desktop and mobile

## Tech Stack

* **Language:** TypeScript
* **Library:** ReactJS (v19)
* **Bundler:** Webpack
* **Styling:** Sass (SCSS)
* **Linting:** ESLint, Stylelint
* **Formatting:** Prettier
* **Testing:** Jest
* **Git Hooks:** Husky, lint-staged
* **eCommerce Platform:** Commercetools

## Requirements

* Node.js (latest LTS version recommended)
* npm (v9+) or Yarn
* Commercetools account and API credentials

## Installation & Running

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd ctrl-alt-wear
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and fill in your credentials (see [Configuration](#configuration)).
4. Start the development server:

   ```bash
   npm run start
   ```
5. Open your browser and navigate to: [http://localhost:3500](http://localhost:3500)

## Configuration

Set up environment variables in a `.env` file at the project root:

```env
REACT_APP_CT_PROJECT_KEY=<your>
REACT_APP_CT_CLIENT_ID=<your>
REACT_APP_CT_CLIENT_SECRET=<your>
REACT_APP_CT_API_URL=<your>
REACT_APP_CT_AUTH_URL=<your>
```

## Available Scripts

| Script           | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `npm run build`  | Build production bundle using Webpack                                                      |
| `npm run start`  | Launch development server with hot-reloading (Webpack Dev Server on port 3500)             |
| `npm run lint`   | Run ESLint on all files (`eslint .`) and auto-fix issues                                   |
| `npm run format` | Format code with Prettier (`prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,scss,md}"`) |
| `npm run test`       | Run Jest test                                                                              |

## Git Hooks (Husky)

A pre-commit hook ensures code quality by running:

1. Prettier formatting check (fails if any file remains unformatted)
2. ESLint lint-and-fix (fails on any remaining warnings or errors)

Example in `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 2️⃣ Check formatting; fail if any file is unformatted
./node_modules/.bin/prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,scss,md}" || exit 1
# 1️⃣ Lint & auto‑fix, but fail on any remaining errors or warnings
./node_modules/.bin/eslint --fix . --max-warnings=0 || exit 1
```

## Project Structure

```
├── .husky                    # Husky Git hooks
├── __mocks__                 # File for work with svg in React
├── dist                      # Compiled output (auto-generated)
├── public                    # File with redirects
├── src                       # Application source code
│   ├── assets                # Static resources (images, svg`s)
│   ├── components            # React components directory
│   │   ├── About             # About page
│   │   ├── App               # Main app component
│   │   ├── Cart              # Cart page
│   │   ├── Catalog           # Catalog page
│   │   ├── Error             # Error page
│   │   ├── Footer            # Footer component
│   │   ├── Header            # Header component
│   │   ├── LoginPage         # Login page
│   │   ├── MainPage          # Main page of app
│   │   ├── Product           # Product page
│   │   ├── Registration      # Registration page
│   │   ├── User              # Client profile page
│   │   └── index.tsx         # Application entry point
│   ├── context               # Login context
│   ├── services              # App services
│   ├── styles                # Global styles of app
│   ├── types                 # TypeScript types
│   ├── utils                 # Project utils
│   ├── declaration.d.ts      # File with modules for correct work with React
│   └── index.html            # HTML template for HtmlWebpackPlugin
├── .env.example              # Example of env file
├── .gitignore                # Git configuration
├── .prettierrc               # Prettier configuration
├── eslint.config.js          # ESLint rules
├── jest.config.ts            # Jest tests configuration
├── jest.setup.ts             # Jest setups
├── package-lock.json         # NodeModules file
├── package.json              # Scripts and dependencies
├── README.md                 # Description of the project
├── tsconfig.json             # TypeScript configuration
└── webpack.config.js         # Webpack configuration             
```

## License

This is a non-commercial, educational project only. No real transactions, payments, or deliveries occur. All product images and descriptions are placeholders for demonstration purposes.

## Links

Design & Inspiration:
* Color schemes & UI references: [webflow](https://webflow.com/templates/category/retail-and-e-commerce-websites)
* Wireframing: [firma](https://www.figma.com/design/IipuMMeEIXSz5jh2Hm7IVO/Untitled?node-id=14-150&t=MOxCOHiQbsyCs51N-0)

Media & Assets:
* Icons: [flaticon](https://www.flaticon.com/)
* Product data: [bloomandwild](https://www.bloomandwild.com/) and [beardsanddaisies](https://www.beardsanddaisies.co.uk/)
* Images: [freepik](https://ru.freepik.com/)
