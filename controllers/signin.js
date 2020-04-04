var jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
};

const getAuthTokenId = () => {
  console.log('getting Auth token');
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: '2 days' });
};

const createSessions = (user) => {
  // create JWT and return user data
  const { email, id } = user;
  const token = signToken(email);
  return { success: 'true', userId: id, token };
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId() :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ?
          createSessions(data) :
          // debug with data but should be a message instead
          Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
};

module.exports = {
  signinAuthentication: signinAuthentication
}