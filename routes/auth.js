const {Router} = require('express')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')
const keys = require('../config/keys')
const router = Router()




router.post('/api/reg', async (req,res) => {
    const candidate = await User.findOne({ login: req.body.login})
    const users = await User.find({}).lean()
    superUser = false
    if (!users.length){
        superUser = true
    }
    if (candidate){
        res.status(409).json({
            message: 'Пользователь с таким логином уже есть.'
        })
    }else{
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            name: req.body.name,
            login: req.body.login,
            password: bcrypt.hashSync(password, salt), 
            gender: req.body.gender,
            date: req.body.date,
            superUser
        })
        await user.save()
        res.status(200).json({
            message: "Пользователь успешно создан"
        })
    }
}) 

router.post('/api/login', async (req,res) => {
    const candidate = await User.findOne({ login: req.body.login})
    if (candidate){
        const truePassword = bcrypt.compareSync(req.body.password, candidate.password)
        if(truePassword){
            const token = jwt.sign({
                login: candidate.login,
                userId: candidate._id,
                type: 'accsess'
            }, keys.jwt, {expiresIn: 60*60})
            const refreshToken = jwt.sign({
                id: uuid(),
                type: 'refresh'
            },keys.jwt, {expiresIn: 2592000})
            res.cookie('jwt', token, {
                httpOnly: true
            })
            res.status(200).json({
                token: `Bearer ${token}`,
                refreshToken
            })
        }else{
            res.status(401).json({
                message: 'Пароль неверный. Попробуйте еще раз'
            })
        }
    }else{
        res.status(401).json({
            message: 'Такой пользователь не найден. Попробуйте другой.'
        })
    }
})

router.get('/api/nonauth', (req,res) => {
    res.status(200).json({
        auth: false
    })
}) 



router.get('/api/auth', passport.authenticate('jwt', {session:false, failureRedirect: '/api/nonauth'}), (req,res) => {
    res.status(200).json({
        auth: true
    })
}) 

router.get('/api/logout', (req,res) => {
    res.clearCookie('jwt')
    res.redirect('/')
}) 


module.exports = router