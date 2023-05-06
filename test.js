const mongoose = require('mongoose');
const { Schema } = mongoose;

// Set the timeout to 10 seconds
const options = { serverSelectionTimeoutMS: 1000 };

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: false,
  },
});
// Create the model

const User = mongoose.model('User', userSchema);
const createUser = (data) => {
  const user = new User({
    ...data,
  });
  user.save();
  // return user;
};

// Connect to the database

async function closeConnection() {
  try {
    await mongoose
      .connect('mongodb://localhost:27017/userstore', options)
      .then(() => {
        console.log('Connected to database!');
        createUser({ name: 'sajjad', email: 'sajjad@example.com', age: 26 });
      });
  } catch (error) {
    console.log('Failed to connect to database:', error);
  }
}
closeConnection();
