const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('boom');
const { config } = require("../../../config/index");
const MongoLib = require('../../../lib/mongo');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb){
      const mongoDB = new MongoLib();
      try {
        const [user] = await mongoDB.getAll("users", {
          // sub, es the user our JSON Web Token
          username: tokenPayload.sub
        });

        // if my user don´t exit, return callback with a boom of unathorized
        if (!user) {
          return cb(boom.unauthorized(), false);
        }
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);
