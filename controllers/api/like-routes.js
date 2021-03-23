const router = require('express').Router();
const { Like } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all likes
router.get('/', (req, res) => {
  Like.findAll()
    .then(dbLikeData => res.json(dbLikeData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a like
router.post('/', withAuth, (req, res) => {
  // expects => {user_id: 1, post_id: 2}
  Like.create({
    user_id: req.session.user_id,
    post_id: req.body.post_id
  })
    .then(dbLikeData => res.json(dbLikeData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete a like with given id
router.delete('/:id', withAuth, (req, res) => {
  Like.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbLikeData => {
      if (!dbLikeData) {
        res.status(404).json({ message: 'No like found with this id!' });
        return;
      }
      res.json(dbLikeData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
