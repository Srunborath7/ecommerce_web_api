function checkUser(req, res, next) {
  if (req.session.user) {
     res.locals.session = req.session;
    next(); // user is logged in, proceed
  } else {
    res.redirect('/api/login');
  }
}

module.exports = checkUser;