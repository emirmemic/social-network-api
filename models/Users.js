const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
userSchema.pre('save', function(next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt for the hash
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // Hash the password using the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      // Set the hashed password on the user object
      user.password = hash;
      next();
    });
  });
});

// Compare input password with hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Find user by ID
userSchema.statics.findById = async function (id) {
  return await this.findOne({ _id: id });
};

const User = mongoose.model("users", userSchema);
module.exports = { User };
