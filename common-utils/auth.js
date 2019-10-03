export const authenticate = (req, res, next) => {
  // should have actual logic like validating a jwt token
  // since auth is not in the scope of the task I am just returning a random userId
  req.user = {
    id: 'somerandomuserid',
    name: 'john doe'
  };
  next();
};
