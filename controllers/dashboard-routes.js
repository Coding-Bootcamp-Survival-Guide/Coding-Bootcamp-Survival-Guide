const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const { Post, User, Comment, Like } = require('../models');


// get all posts admin loggedIn user
router.get('/admin', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
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
            res.render('dashboard-admin', { 
                posts, 
                loggedIn: true, 
                isAdmin: req.session.isAdmin 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get all likess for a non-admin user
router.get('/', withAuth, (req, res) => {
    User.findAll({
        where: {
            // use the ID from the session
            id: req.session.user_id
        },
        include: [
            {
                model: Like,
                attributes: ['id', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['id', 'title', 'category', 'post_text', 'post_url', 'user_id', 'created_at'],
                    include: [ {
                        model: User,
                        attributes: ['username']
                    },
                    {                        
                        model: Like,
                        attributes: ['id', 'post_id', 'user_id', 'created_at']       
                    },
                    {
                        model: Comment,
                        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at']       
                    }],
                }
            }
        ]
    })
        .then(dbUserData => {
            // serialize data before passing to template
            const users = dbUserData.map(user => user.get({ plain: true }));
            res.render('dashboard', { 
                users, 
                loggedIn: true,
                isAdmin: req.session.isAdmin 
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get all likes for a non-admin user
// router.get('/', withAuth, (req, res) => {
//     Like.findAll({
//         where: {
//             // use the ID from the session
//             user_id: req.session.user_id
//         },
//         include: [
//             {
//                 model: Post,
//                 attributes: ['id', 'title', 'category', 'post_text', 'post_url', 'user_id', 'created_at'],
//                 include: [ {
//                     model: User,
//                     attributes: ['username']
//                 },
//                 {
//                     model: Like,
//                     attributes: ['id', 'post_id', 'user_id', 'created_at']
//                 },
//                 {
//                     model: Comment,
//                     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at']
//                 } ]
//             },
//             {  
//                 model: User,
//                 attributes: ['username']
//             }
//         ]
//     })
//         .then(dbLikeData => {
//             // serialize data before passing to template
//             const likes = dbLikeData.map(like => like.get({ plain: true }));
//             res.render('dashboard', { 
//                 likes, 
//                 loggedIn: true,
//                 isAdmin: req.session.isAdmin 
//             })
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// find a single post
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            res.render('edit-post', {
                post,
                loggedIn: true,
                isAdmin: req.session.isAdmin 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// add a single post
router.get('/new/', withAuth, (req, res) => {

    res.render('new-post', {
        loggedIn: true
    });

});

module.exports = router;