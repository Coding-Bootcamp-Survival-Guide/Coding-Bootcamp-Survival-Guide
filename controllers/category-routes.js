const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment, Like } = require('../models');

//get all posts in selected category
router.get('/:category_name', (req, res) => {
    const categoryName = req.params.category_name;
    Post.findAll({
        where: {
            // use the category name from the session
            category_name: req.params.category_name
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
                    attributes: ['username', 'profile_pic']
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
                profilePic: req.session.profilePic,
                isAdmin: req.session.isAdmin
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;