var jwt = require('jsonwebtoken');
var config = require('./config');
var swig  = require('swig');
function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    {
        var login=swig.compileFile(__dirname+'/views/login.html')
       output=login()
       res.end(output)
    }
    else{
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.',value:0 });
    // if everything good, save to request for use in other routes
    var login=swig.compileFile(__dirname+'/views/template.html')
    output=login()
    res.end(output)
    next();
  });
}
}
module.exports = verifyToken;