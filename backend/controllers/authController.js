
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send response with token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// Sign up new user
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: existingUser.email === email ?
          'Email already in use' : 'Username already taken'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      credits: 100 // Initial credits for new users
    });

    createSendToken(newUser, 200, res);
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email/username and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account is not active. Please contact support.'
      });
    }

    // If everything is ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update current user password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
