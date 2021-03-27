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
            'post_image',
            'title',
            'category_id',
            'category_name',
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

// get all likes for a non-admin user
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
                    attributes: ['id', 'title', 'category_id', 'category_name', 'post_text', 'post_url', 'post_image', 'user_id', 'created_at'],
                    include: [{
                        model: User,
                        attributes: ['username', 'profile_pic', 'bootcamp']
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

            //console.log(users)

            let cat1Likes = []
            let cat2Likes = []
            let cat3Likes = []
            let cat4Likes = []
            let cat5Likes = []
            let cat6Likes = []
            let cat7Likes = []

            users.forEach((user) => {
                if (user.likes.length > 0) {
                    user.likes.forEach(like => {
                        console.log(like.post.category_name);
                        switch (like.post.category_name) {
                            case "pick-camp":
                                cat1Likes.push(like.post)
                                break;
                            case "pre-course":
                                cat2Likes(like.post)
                                break;
                            case "tools":
                                cat3Likes(like.post)
                                break;
                            case "frontend":
                                cat4Likes(like.post)
                                break;
                            case "backend":
                                cat4Likes(like.post)
                                break;
                            case "self-care":
                                cat4Likes(like.post)
                                break;
                            case "finish-line":
                                cat4Likes(like.post)
                                break;
                        }
                    })
                }
            });

            /* forEach using if/else instead of switch case
            users.forEach(user => {
                if (user.likes.length > 0) {
                    user.likes.forEach(like => {
                        if (like.post.category_name === 'pick-camp') {
                            cat1Likes.push(like.post)
                        } else if (like.post.category_name === 'pre-course') {
                            cat2Likes.push(like.post)
                        } else if (like.post.category_name === 'tools') {
                            cat3Likes.push(like.post)
                        } else if (like.post.category_name === 'frontend') {
                            cat4Likes.push(like.post)
                        } else if (like.post.category_name === 'backend') {
                            cat5Likes.push(like.post)
                        } else if (like.post.category_name === 'self-care') {
                            cat6Likes.push(like.post)
                        } else if (like.post.category_name === 'finish-line') {
                            cat7Likes.push(like.post)
                        }
                    })
                }
            })
            */

            res.render('dashboard', {
                users,
                cat1Likes,
                cat2Likes,
                cat3Likes,
                cat4Likes,
                cat5Likes,
                cat6Likes,
                cat7Likes,
                loggedIn: true,
                isAdmin: req.session.isAdmin
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// THE GET ON THE LIKES PRODUCES THE SAME RESULTS AS THE GET ON THE USER FOR ALL OF THEIR LIKES
// SAVING FOR NOW IN CASE THERE IS A PROBLEM WITH THE GET ON THE USER
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
//                 attributes: ['username', 'profile_pic', 'bootcamp']
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
            'post_image',
            'title',
            'category_id',
            'category_name',
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            const categoryNames = ["pick-camp", "pre-course", "tools", "frontend", "backend", "self-care", "finish-line"];
            let category_id = categoryNames.indexOf(dbPostData.category_name) + 1;
            dbPostData.category_id = category_id;
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