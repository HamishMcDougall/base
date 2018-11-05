
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const mongoose = require('mongoose')
const Joi = require('joi')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost/vueformgenerator', {
    useNewUrlParser: true
  })
  .then(() => console.log('Connect to MongoDB'))
  .catch(err => console.error('Could not connect', err))

// Body parser, to access `req.body`
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Sessions to create `req.session`
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))


//create user 
//
//
// Need to add the email confimation
///
//

const {User,validate} = require('../models/user');
// POST `/api/create` to log in the user and add him to the `req.session.authUser`
app.post('/api/create', async (req, res)=> {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find if the email exists
  let user = await User.findOne({
    email: req.body.email
  })
  if (user) return res.status(400).send('User is alread registered.');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
    const salt = await bcrypt.genSalt(11);
    user.password = await bcrypt.hash(user.password,salt);

  await user.save();
  
  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send(_.pick(user, ['id','name', 'email']));
});




// POST `/api/auth` to auth email and password
app.post('/api/auth', async (req, res)=> {
  const {error} = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find if the email exists
  let user = await User.findOne({
    email: req.body.email
  })
  if (!user) return res.status(400).send('Invalid email or password.');
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword)  return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();

  
  res.header('x-auth-token', token).send(_.pick(user, ['id','name', 'email']));
  
});

function validateAuth(req) {
  const schema = {
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(req, schema);
}

// Add POST - /api/logout
app.post('/api/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})




var keySecret = 'sk_test_krN7ivlrfhpgP6yts66H7lkN'
var stripe = require('stripe')(keySecret)



app.post('/api/payment', function(req, res) {
  var token = req.body.stripeToken;
  var email = req.body.email;
 


  const customer = stripe.customers.create({
    email: email,
    source: token,
    receipt_email: email
  }, function(err, customer) {
    if (err) { console.warn(err) } else {
  

      var id = customer.id

      const subscription = stripe.subscriptions.create({
        customer: id,
        items: [{
          plan: "Gold",
      }],
      }, function(err, charge) {
        if (err) { console.warn(err) } else {
         res.status(200).send(charge)
        }
      });
      
   
    }
  });




  // this is a single chage

  /*

     const subscription = stripe.subscriptions.create({
        customer: id,
        items: [{
          plan: "Gold",
      }],
      }, function(err, charge) {
        if (err) { console.warn(err) } else {
         res.status(200).send(charge)
        }
      });


  var charge = stripe.charges.create({
    amount: 1700, // create a charge for 1700 cents USD ($17)
    currency: 'usd',
    description: 'Bargain Basement Charge',
    source: token,
  }, function(err, charge) {
    if (err) { console.warn(err) } else {
      res.status(200).send(charge)
    }
  })

  */
});




app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
