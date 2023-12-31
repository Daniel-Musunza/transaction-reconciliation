const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    policy_number: {
      type: String,
      unique: true,
    },
    id_number: {
      type: Number,
    },
    branch: {
      type: String,
      required: [true, 'Please select a branch'],
    },
    coverage_type: {
      type: String,
    },
    annual_premium: {
      type: Number,
    },
    password: {
      type: String
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
