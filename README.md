A web app to store, edit and search job stories organized by products and user types.

## Local development

Figure out your [connection string](https://github.com/iceddev/pg-connection-string) to your postgres instance. You'll need it at step `4`. Check https://postgresapp.com/ if you want to install Postgres to your Mac. 

1. `git clone git@github.com:davidudvardy/lmi-jobstories.git`
2. `cd lmi-jobstories`
3. `npm install`
4. `echo DATABASE_URL=postgres://dudvardy@localhost:5432/lmi-jobstories >> server/.env`  
5. `npm run start:dev`

Now you have the Create React App -app running in `http://localhost:3000/` and the API server running in `http://localhost:4000`. 

### How does this work?

CRA has a fabulous built-in live reload. Go and check their [readme](https://github.com/facebookincubator/create-react-app). The API server is reloading all changes with [nodemon](https://nodemon.io/). Whenever the server starts, it executes sql migrations from `server/postgrator` with [Postgrator](https://github.com/rickbergfalk/postgrator).

The CRA is proxying requests to API server. Check the `proxy` config from `react-ui/package.json` and the relevant [section in readme](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development).


## Heroku deployments

1. `heroku create lmi-jobstories`
2. `heroku addons:create heroku-postgresql:hobby-dev`
3. `heroku git:remote lmi-jobstories`
4. `git push heroku master`

Now you have the software running in `https://lmi-jobstories.herokuapps.com/`. It is running in production mode. Open your browser and check the logs with `heroku logs`.

Your database has been initialized by running sql migrations from `server/postgrator`.
