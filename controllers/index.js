const router = require('express').Router();

const apiRoutes = require('./api');

const homeRoutes = require('./home-routes.js');

const dashboardRoutes = require('./dashboard-routes.js');

const toolsRoutes = require('./tools-routes.js');
const frontendRoutes = require('./frontend-routes.js');
const backendRoutes = require('./backend-routes.js');
const decompressRoutes = require('./decompress-routes.js');

router.use('/', homeRoutes);

router.use('/dashboard', dashboardRoutes);

router.use('/tools', toolsRoutes);

router.use('/frontend', frontendRoutes);

router.use('/backend', backendRoutes);

router.use('/decompress', decompressRoutes);

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;