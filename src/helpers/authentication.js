const helpers = {};

helpers.Authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } 
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/login');
};

module.exports = helpers;