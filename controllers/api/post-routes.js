const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Like } = require('../../models');
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a single post
router.get('/:id', (req, res) => {
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
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a post
router.post('/', withAuth, (req, res) => {
  const categoryNames = ["pick-camp", "pre-course", "tools", "frontend", "backend", "self-care", "finish-line"];
  let category_id = categoryNames.indexOf(req.body.category_name) + 1;
  
  Post.create({
    title: req.body.title,
    category_name: req.body.category_name,
    category_id: category_id,
    post_text: req.body.post_text.trim(),
    post_url: req.body.post_url,
    post_image: req.body.post_image,
    user_id: req.session.user_id
  })
    .then(dbPostData => {
      res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update the title, text or URL of the post
router.put('/:id', withAuth, (req, res) => {
  const categoryNames = ["pick-camp", "pre-course", "tools", "frontend", "backend", "self-care", "finish-line"];
  let category_id = categoryNames.indexOf(req.body.category_name) + 1;

  Post.update(
    {
      title: req.body.title,
      category_name: req.body.category_name,
      category_id: category_id,
      post_text: req.body.post_text,
      post_url: req.body.post_url,
      post_image: req.body.post_image
      },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    const categoryNames = ["pick-camp", "pre-course", "tools", "frontend", "backend", "self-care", "finish-line"];
    let category_id = categoryNames.indexOf(dbPostData.category_name) + 1;
    dbPostData.category_id = category_id;
  
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// delete a post with a given id
router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
