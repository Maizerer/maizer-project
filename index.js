const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const authRoutes = require('./routes/auth')
const pageRoutes = require('./routes/pages')
const userRoutes = require('./routes/users')
const superUser = require('./routes/superUser')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000
const app = express()


app.use(cookieParser(keys.cookie))
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))
app.use(authRoutes)
app.use(pageRoutes)
app.use(userRoutes)
app.use(superUser)
mongoose.set('useFindAndModify', false)

app.use(passport.initialize())
require('./middleware/passport')(passport)

async function start () {
    try{
        await mongoose.connect(keys.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()