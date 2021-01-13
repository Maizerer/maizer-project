const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const keys = require('../config/keys')

const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
}

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: keys.jwt
}



module.exports = passport => {
    passport.use(
        new JwtStrategy(options,  async (payload, done) => {
            try{
                const user = await User.findById(payload.userId).select('login id')

                if (user){
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (e){
                console.log(e)
            }
        })
    )
}