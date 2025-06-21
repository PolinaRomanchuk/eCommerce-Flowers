# eCommerce-Application

# ctrl+alt+wear

Welcome to our eCommerce application! This platform replicates real-world shopping experiences in a digital environment. It's a comprehensive online shopping portal that provides an interactive and seamless experience to users. From product discovery to checkout, the application ensures a smooth journey for the user, enhancing their engagement and boosting their purchasing confidence. `ctrl+alt+wear` is a headless eCommerce web application for clothing retail built with ReactJS and integrated with the Commercetools platform. This project is designed to provide a seamless online shopping experience for end users.

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

## Features

* Browse a catalog of apparel
* Add products to the shopping cart
* Place orders via Commercetools
* Responsive design for desktop and mobile

## Tech Stack

* **Language:** TypeScript, JavaScript (ESNext)
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
CT_PROJECT_KEY=<your_project_key>
CT_CLIENT_ID=<your_client_id>
CT_CLIENT_SECRET=<your_client_secret>
CT_API_URL=<commercetools_api_url>
```

## Available Scripts

| Script           | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `npm run build`  | Build production bundle using Webpack                                                      |
| `npm run start`  | Launch development server with hot-reloading (Webpack Dev Server on port 3500)             |
| `npm run lint`   | Run ESLint on all files (`eslint .`) and auto-fix issues                                   |
| `npm run format` | Format code with Prettier (`prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,scss,md}"`) |
| `npm test`       | Run Jest test                                                                              |

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
│   │   ├── context           # Login context
│   │   ├── Error             # Error page
│   │   ├── Footer            # Footer component
│   │   ├── Header            # Header component
│   │   ├── login             # Login page
│   │   ├── MainPage          # Main page of app
│   │   ├── modal             # Modal windows implementation
│   │   ├── Product           # Product page
│   │   ├── registrationForm  # Registration page
│   │   ├── userProfile       # Client profile page
│   │   └── index.tsx         # Application entry point
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

This project is licensed under the MIT License.
