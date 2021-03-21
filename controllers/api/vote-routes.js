const router = require('express').Router();
const { Vote } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all votes
router.get('/', (req, res) => {
  Vote.findAll()
    .then(dbVoteData => res.json(dbVoteData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a vote
router.post('/', withAuth, (req, res) => {
  // expects => {user_id: 1, post_id: 2}
  Vote.create({
    user_id: req.session.user_id,
    post_id: req.body.post_id
  })
    .then(dbVoteData => res.json(dbVoteData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete a vote with given id
router.delete('/:id', withAuth, (req, res) => {
  Vote.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbVoteData => {
      if (!dbVoteData) {
        res.status(404).json({ message: 'No vote found with this id!' });
        return;
      }
      res.json(dbVoteData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
