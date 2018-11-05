const {User,validate} = require('../models/user');
const mongoose = require('mongoose');


app.post('/', async (req, res) => {
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

  await user.save();

  res.send(user);

});

