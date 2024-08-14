// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name for this user.'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name for this user.'],
  },
  birthday: {
    type: Date,
    required: [true, 'Please provide a birthday for this user.'],
  },
  workplace: {
    type: String,
    required: [true, 'Please provide a workplace for this user.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email for this user.'],
  },
  country: {
    type: String,
    required: [true, 'Please provide a country for this user.'],
  },
  gender: {
    type: String,
    required: [true, 'Please provide a gender for this user.'],
  },
  id_num: {
    type: String,
    required: [true, 'Please provide an ID number for this user.'],
  },
  hobby: {
    type: String,
    required: [true, 'Please provide a hobby for this user.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password for this user.'],
  },
  role: {
    type: String,
    required: [true, 'Please provide a role for this user.'],
  }

});

export default mongoose.models.User || mongoose.model('User', UserSchema);
