const express      = require('express'),
      router       = express.Router({ mergeParams: true }),
      Place        = require('../models/place'),
      Comment      = require('../models/comment'),
      middleware   = require('../middleware')

// NEW Comments
router.get('/new', middleware.isLoggedIn, (req, res) => {
    // find place by id
    Place.findById(req.params.id, (err, place) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { place: place })
        }
    })
})

// CREATE Comments
router.post('/', middleware.isLoggedIn, (req, res) => {
    Place.findById(req.params.id, (err, place) => {
        if (err) {
            console.log(err)
            res.redirect("/place")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Oops, something went wrong.")
                    console.log(err)
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username

                    // save comment
                    comment.save()
                    place.comments.push(comment)
                    place.save()
                    req.flash("success", "Successfully added comment.")
                    res.redirect('/place/' + place._id)
                }
            })
        }
    })
})

// EDIT Comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render('comments/edit', { place_id: req.params.id, comment: foundComment })
        }
    })
})

// UPDATE Comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect('/place/' + req.params.id)
        }
    })
})

// DELETE Comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted successfully.")
            res.redirect("/place/" + req.params.id)
        }
    })
})

module.exports = router