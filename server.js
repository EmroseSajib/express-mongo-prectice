var express = require('express');
var app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
// Enable CORS for all routes
app.use(cors());
const connectDB = require('./db');
const User = require('./Models/Users');
app.use(express.json());

app.post('/register', async (req, res, next) => {
  const { name, email, password, accountStatus } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Invalid Data ' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Semilar email insert' });
    }
    if (password.length < 5) {
      return res.status(400).json({ message: 'Password length too short' });
    }
    user = new User({
      name,
      email,
      password,
      accountStatus,
    });
    await user.save();
    return res
      .status(201)
      .json({ message: 'Data inserted sucessfully !!', user });
  } catch (error) {
    next(error);
  }
});
app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email or Password feild are empty' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const isMatched = await bcrypt.compare(password, user?.password);

    console.log(isMatched);

    if (!isMatched) {
      return res.status(400).json({ message: 'Password not match' });
    }
    return res.status(201).json({ message: 'User login successfully!!' });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Server Error Occurred' });
});

connectDB('mongodb://localhost:27017/userdata')
  .then(() => {
    console.log('Data-Base Connected!');
    app.listen(3000, () => {
      console.log('I am listening on port 3000');
    });
  })
  .catch((e) => {
    console.log(e);
  });
