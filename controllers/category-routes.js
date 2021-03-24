const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment, Like } = require('../models');

//get all posts in category 1 (pick a camp)
router.get('/:category_name', (req, res) => {
    const categoryNames = ['pick-camp', 'pre-course', 'tools', 'frontend', 'backend', 'self-care'];
    let category = categoryNames.indexOf(category_name) + 1;
    Post.findAll({
        where: {
            // use the ID from the session
            category: category
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
                attributes: ['username', 'profile_pic']
            },
            {
                model: Like,
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
            res.render(category_name, { 
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