const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const SESS_SECRET = process.env.SESS_SECRET;
const SESS_TIMEOUT = parseInt(process.env.SESS_TIMEOUT);

// code below to add to sess if want to have login sessions timed out
// cookie: {
//   maxAge: SESS_TIMEOUT
// },
// rolling: true,

const sess = {
  secret: SESS_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

sequelize.sync({ force: false}).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});