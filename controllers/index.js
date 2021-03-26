const router = require('express').Router();

const apiRoutes = require('./api');

const homeRoutes = require('./home-routes.js');

const dashboardRoutes = require('./dashboard-routes.js');

const categoryRoutes = require('./category-routes.js');

router.use('/', homeRoutes);

router.use('/dashboard', dashboardRoutes);

router.use('/category', categoryRoutes) 

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;