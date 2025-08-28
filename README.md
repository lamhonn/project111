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

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


## Notes:

- Project run on Node 24.5.0. Use nvm for efficient version swapping.

- Make sure to push changes to **dev** branch first - main branch should be used as a latest stable release branch, which will later be used for pipelines too.

    - merging dev to main should happen only in controlled manner and after rigorous testing!


## Other scripts:

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
