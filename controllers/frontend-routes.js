const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment, Vote } = require('../models');


// get all posts in category 2 (front-end)
router.get('/', (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            category: 2
        },
        attributes: [
            'id',
            'post_text',
            'post_url',
            'title',
            'category',
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
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('frontend', { 
                posts,
                loggedIn: req.session.loggedIn,
                isAdmin: req.session.isAdmin
      
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;