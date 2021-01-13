const {Router} = require('express')
const router = Router()
const passport = require('passport')
const User = require('../models/User')



router.get('/api/users', function(req, res, next) {
    passport.authenticate('jwt',async function(err, user, info) {
        const superUsers = await User.find({ superUser: true})
        if (err) { return next(err) }
        if (user) {
            const users = await User.find({}).lean()
            const body = {}
            if (users.length){
                body.users = users
                body.isSuperUser = false
            }else{
                return res.status(404).json( {
                    message: 'Пользователи не найдены'
                })
            }
            superUsers.forEach(element => {
                if (element.login === user.login){
                    body.isSuperUser = true
                }
            });
            return res.status(200).json(body)     
    }else{
        return res.redirect('/login')
    }
    })(req, res, next)
  })

module.exports = router