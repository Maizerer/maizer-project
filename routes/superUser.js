const path = require('path')
const {Router} = require('express')
const passport = require('passport')
const router = Router()
const User = require('../models/User')

router.post('/api/deleteuser', function(req, res, next) {
    passport.authenticate('jwt',async function(err, user, info) {
        if (err) { return next(err); }
        const superUsers = await User.find({ superUser: true}).lean()
        let isSuperUser = false
        superUsers.forEach(element => {
            if (element.login === user.login){
                isSuperUser = true
            }
        });
        if (isSuperUser){
            const userLogin = req.body.login
            User.findOneAndRemove({ login: userLogin}, function(err){
                if(err) {throw err}})
            res.status(200).json({ message: 'Пользователь успешно удален'})
        }else{
            return res.redirect('/login')
        }
    })(req, res, next)
})

router.post('/api/setsuper', function(req, res, next) {
    passport.authenticate('jwt',async function(err, user, info) {
        if (err) { return next(err); }
        const superUsers = await User.find({ superUser: true}).lean()
        let isSuperUser = false
        superUsers.forEach(element => {
            if (element.login === user.login){
                isSuperUser = true
            }
        });
        if (isSuperUser){
            const userLogin = req.body.login
            User.findOneAndUpdate({ login: userLogin},{ superUser: true}, function(err){
                if(err) {throw err}})
            res.status(200).json({ message: `Теперь пользователь с логином ${userLogin} тоже администратор`})
        }else{
            return res.redirect('/login')
        }
    })(req, res, next)
})

module.exports = router