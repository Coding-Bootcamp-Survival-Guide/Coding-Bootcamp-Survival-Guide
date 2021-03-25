const path = require('path'); // added for front end
const express = require('express');
const routes = require('./controllers/');
// inporting the connection to sequilize
const sequelize = require('./config/connection');
const session = require('express-session');
// added for front end
const exphbs = require('express-handlebars'); 
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();
const SESS_SECRET = process.env.SESS_SECRET;
const SESS_TIMEOUT = parseInt(process.env.SESS_TIMEOUT);

const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({helpers});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = {
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_TIMEOUT
    },
    resave: false,
    saveUninitialized: true,
    rolling: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bring in front end when ready
//app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);


// turn on connection to db and server
// force:true, drops and re-creates all of the database tables and associations on startup.
// necessary if have new table associations
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});