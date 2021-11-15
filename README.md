# How to run the project

#### Yarn

npm i -g yarn

### Installing

Below is a series of step by step instructions that tell you how to get a development env running.

Create a local clone of the repository

git clone repo

Enter the cloned repositories' directory

cd tradingview-frontend

Install the projects dependencies

yarn

Create a `.env` file based on the [.env.example template](.env.example)

Export the contents of the created `.env` file to the current terminal session.

set -o allexport; source .env; set +o allexport

Start the backend server or alternatively update the `REACT_APP_API_HOST` value to point to a deployed backend URL.

Start the projects development server
yarn start

The project should now be available at http://localhost:3000

## Environments

Below is a detailed list of the current deployed environments, how they can accessed and any other relevant information.

### Development

> This environment is deployed to automatically on every merge to the `develop` branch.
