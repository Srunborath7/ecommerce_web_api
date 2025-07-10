function checkUser(req, res, next) {
  if (req.session.user) {
     res.locals.session = req.session;
    next(); // user is logged in, proceed
  } else {
    //res.redirect('/api/login');
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
}

module.exports = checkUser;