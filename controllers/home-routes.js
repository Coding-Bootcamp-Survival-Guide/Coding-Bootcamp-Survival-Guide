// USED BY controllers/index.js

const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

const { Post, User, Comment, Vote } = require('../models');

// Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. 
// In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied). 

router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_text',
        'post_url',
        'title',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Vote,
          attributes: ['id', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
    .then(dbPostData => {
        // You did not need to serialize data before when you built API routes, because the res.json() method 
        // automatically does that for you.
        const posts = dbPostData.map(post => post.get({ plain: true }));
        
        // This will loop over and map each Sequelize object into a serialized version of itself, saving the 
        // results in a new posts array.
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    
      res.render('login');  
});

// find a single post
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_text',
      'post_url',
      'title',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Vote,
        attributes: ['id', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn,
        userId: req.session.user_id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;