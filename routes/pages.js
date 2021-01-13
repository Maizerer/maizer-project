const path = require('path')
const {Router} = require('express')
const passport = require('passport')
const router = Router()

router.get('/', (req, res) => {
    res.sendFile('../public/index.html')
})

router.get('/login', function(req, res, next) {
    passport.authenticate('jwt', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.sendFile(path.resolve( __dirname,'../public/login.html')) 
    }else{
        return res.redirect('/')
    }
    })(req, res, next)
  })

router.get('/reg', function(req, res, next) {
    passport.authenticate('jwt', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.sendFile(path.resolve( __dirname,'../public/reg.html')) 
    }else{
        return res.redirect('/')
    }
    })(req, res, next)
  })

router.get('/users',passport.authenticate('jwt', {session:false, failureRedirect: '/login'}), (req,res) => {
    res.sendFile(path.resolve( __dirname,'../public/users.html'))
})


module.exports = router