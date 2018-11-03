A web app to store, edit and search job stories organized by products and user types.

## TODO

**The Road to v1.0:**
- [x] **Simplified layout _not_ based on Bootstrap**
    - [x] Simple typographic rules
    - [x] Fixed navbar at top
    - [x] Fixed, non-scrolling sidebar at left
    - [x] Job stories as rows of cards
- [ ] **We will need a new view to display a single job story only**
    - [x] Prepare a UI view to display a single job story
    - [x] Create a separate `route` containing job story `id` (what about pre-filtered URLs?)
    - [x] Editing toolbar should only be displayed in the single job story view
- [ ] **Refined job story layout**
    - [ ] Breadcrumbs divider
    - [ ] **Special layout for single view:**
        - [x] Blocking bg layer
        - [x] Edit btn
        - [x] Close btn
        - [ ] Forces displayed below (first with mock data)
        - [ ] Forces stored and served from DB
        - [ ] Display product and usertypes as tags
    - [ ] **Special layout for editing view:**
        - [x] New job story floating btn
        - [ ] Adjusted editing layout (separated cards)
        - [x] Save & Dismiss btns
        - [ ] Editable forces
        - [ ] Add new force
        - [ ] Define/Edit product
        - [ ] Add new usertype
        - [ ] Remove usertype

**Future feature ideas:**
- Instant search in existing context/motivation/outcome cards while creating new (card spinner selector)
- Ability to add videos with timecode
- Authentication and sharing (add/remove editor accounts, anonymous link based sharing for viewing only, job story has author)
- Teams: editors belong to teams, can start serving external teams
- Built-in tips to write job stories while editing
- Stats for teams: most viewed products, job stories, authors, etc.

## Local development

Figure out your [connection string](https://github.com/iceddev/pg-connection-string) to your postgres instance. You'll need it at step `4`. Check https://postgresapp.com/ if you want to install Postgres to your Mac. 

1. `git clone git@github.com:davidudvardy/lmi-jobstories.git`
2. `cd lmi-jobstories`
3. `npm install`
4. `echo DATABASE_URL=postgres://dudvardy@localhost:5432/lmi-jobstories >> server/.env`  
5. `npm run start:dev`

Now you have the Create React App running at `http://localhost:3000/` and the API server running at `http://localhost:4000`. 

### How does this work?

CRA has a fabulous built-in live reload. Go and check their [readme](https://github.com/facebookincubator/create-react-app). The API server is reloading all changes with [nodemon](https://nodemon.io/). Whenever the server starts, it executes sql migrations from `server/postgrator` with [Postgrator](https://github.com/rickbergfalk/postgrator).

The CRA is proxying requests to API server. Check the `proxy` config from `react-ui/package.json` and the relevant [section in readme](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development).


## Heroku deployment

1. `heroku create jobstories`
2. `heroku addons:create heroku-postgresql:hobby-dev`
3. `heroku git:remote jobstories`
4. `git push heroku master`

Now you have the software running in `https://jobstories.herokuapps.com/`. It is running in production mode. Open your browser and check the logs with `heroku logs`.

Your database has been initialized by running sql migrations from `server/postgrator`.
