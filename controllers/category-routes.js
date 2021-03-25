const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment, Like } = require('../models');

//get all posts in category 1 (pick a camp)
router.get('/:category_id', (req, res) => {
    const categoryNames = ['pick-camp', 'pre-course', 'tools', 'frontend', 'backend', 'self-care', 'finish-line'];
    const category_id = req.params.category_id;
    let categoryName = categoryNames[category_id-1];
    Post.findAll({
        where: {
            // use the ID from the session
            category_id: category_id
        },
        attributes: [
            'id',
            'post_text',
            'post_url',
            'post_image',
            'title',
            'category_name',
            'category_id',
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
                attributes: ['username', 'profile_pic', 'bootcamp']
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
            res.render(categoryName, { 
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