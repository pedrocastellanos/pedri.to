const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } 
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/login');
};

helpers.isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports = helpers;