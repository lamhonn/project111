#
# Running with Docker Compose
#
To start the frontend, database and API using Docker:

```bash
docker compose up
```

- The frontend will be available at [http://localhost:5173/](http://localhost:5173/)
- The database runs in a separate container and is accessible from the frontend container as `db` on port `3306`.
- API runs in a seperate container and is accessible from the API container as 'api' on port '4000'

- if you make changes to the db/init.sql file, remember to reset the database volume:
```bash
docker compose down
docker volume rm project111_db_data
docker compose up --build
```

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
