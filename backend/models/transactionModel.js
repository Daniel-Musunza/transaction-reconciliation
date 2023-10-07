const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    
    date_of_payment: {
      type: String
    },
    policy_number: {
      type: String
    },
    client_name: {
      type: String,
    },
    branch: {
      type: String,
      ref: 'User',
    },
    coverage_type: {
      type: String,
    },
    description: {
      type: String
    },
    amount: {
      type: Number
    },
    modeOfPay:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
