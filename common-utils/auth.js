export const protect = (req, res, next) => {
  // should have actual logic like validating a jwt token
  // since auth is not in the scope of the task I am just returning a random userId
  if (!req.headers.authorization) {
    return res.status(403).send('user not signed in');
  }
  // should be replaced by jwt token verification
  if (req.headers.authorization !== 'thisisajwttoken') {
    return res.status(403).send('invalid token/session');
  }
  req.user = {
    id: 'somerandomuserid',
    name: 'john doe'
  };
  next();
};
