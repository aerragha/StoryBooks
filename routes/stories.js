const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc    Show add page
// Get      /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// @desc    Process add form
// Get      /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show all stories
// Get      /stories/
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show single story
// Get      /stories/id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) return res.render('error/404');

    res.render('stories/show', {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show edit page
// Get      /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();

    if (!story) return res.render('error/404');

    if (story.user != req.user.id) res.redirect('/stories');
    else {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Update story
// PUT      /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) return res.render('error/404');

    if (story.user != req.user.id) res.redirect('/stories');
    else {
      story = await Story.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Delete story
// DELETE      /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show user stories
// Get      /stories/user/user_id
router.get('/user/:user_id', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      status: 'public',
      user: req.params.user_id,
    })
      .populate('user')
      .lean();
    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
