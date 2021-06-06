const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {getUsersConnection, matchPassword}  = require('../db/usersDb')
 
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's User
  const user = await getUsersConnection().get('users').find({email}).value()
  if (!user) {
    return done(null, false, { message: 'Not User found.' });
  } else {
    // Match Password's User
    const match = await matchPassword(password, user.password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = getUsersConnection().get('users').find({id}).value()
  if (!user) {
    done({message: 'Invalid Credentials'}, null)
  } else {
    done(null, user)
  }
});

// const user = getUsersConnection().get('users').find({id}).value()
// return done(user);