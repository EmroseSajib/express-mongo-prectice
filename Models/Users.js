const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new Schema({
  name: String,

  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email !`,
    },
    required: [true, 'Email is required'],
  },

  password: {
    type: String,
    minlength: [4, 'Password is too short'],

    required: true,
  },
  roles: {
    type: [String],
    required: true,
    default: ['STUDENT'],
  },
  accountStatus: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'REJECTED'],
    default: 'PENDING',
    required: true,
  },
});
// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain text password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = model('User', userSchema);

module.exports = User;
