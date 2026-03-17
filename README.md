#
# Running with Docker Compose
#
To start the frontend and database using Docker:

```bash
docker compose up
```

- The frontend will be available at [http://localhost:5173/](http://localhost:5173/)
- The database runs in a separate container and is accessible from the frontend container as `db` on port `3306`.

# Project 111 (Restaurant Tablet Frontend) - README

## How to run the first time

Clone the project. In the project directory, run:

### `npm i`

And then run:

### `npm run dev`

Runs the app in the development mode using vite.\
Open [http://localhost:5173/](hhttp://localhost:5173/) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Environment configuration

API URLs and runtime IDs are now configured via `.env` files.

1. Copy values from `.env.example` to your environment-specific file.
2. For local development, update `.env.development`.

Current local backend defaults:

- `VITE_GRAPHQL_ENDPOINT=http://localhost:5432/graphql`
- `VITE_ORGANIZATION_ID=org-1`
- `VITE_MENU_ID=menu-1`
- `VITE_TABLE_ID=table-1`

## Seed local PostgreSQL with previous mock data

The former frontend mock data has been converted to SQL in `db/seed_mock_data.sql`.

Example import:

```bash
psql -h localhost -p 5432 -U <user> -d <database> -f db/seed_mock_data.sql
```


## Notes:

- Project run on Node 24.5.0. Use nvm for efficient version swapping.

- Make sure to push changes to **dev** branch first - main branch should be used as a latest stable release branch, which will later be used for pipelines too.

    - merging dev to main should happen only in controlled manner and after rigorous testing!


## Other scripts:

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Runs eslint

### `npm run preview`

Runs vite preview
