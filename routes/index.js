const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user')

// root route
router.get('/', (req, res) => {
    res.render('landing')
})

// show register form
router.get('/register', (req, res) => {
    res.render("register", { page: 'register' }) 
})

// handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("register", { error: err.message })
        }
        passport.authenticate("local") (req, res, () => {
            req.flash("success", `Welcome, ${user.username}`)
            res.redirect("/place")
        })
    })
})

// show login form
router.get('/login', (req, res) => {
    res.render("login", { page: 'login' })
})

// handling login logic
router.post('/login', passport.authenticate("local",
    {
        successRedirect: "/place",
        failureRedirect: "/login"
    }), (req, res) => {
})

// logout route
router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success", "Logged you out!")
    res.redirect("/place")
})

module.exports = router