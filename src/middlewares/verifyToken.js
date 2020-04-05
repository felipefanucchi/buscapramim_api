const jwt = require('jsonwebtoken');

module.exports = function(request, response, next) {
  const token = request.headers.authorization;
  if(!token) return response.status(401).json({error: 'Access Denied'});

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    request.user = verified;
    next();
  } catch (err) {
    return response.status(400).send({error: 'Invalid token!'});
  }
}
