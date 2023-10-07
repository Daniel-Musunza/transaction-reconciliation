const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')


// @desc    Get transactions
// @route   GET /api/transactions
const gettransactions = asyncHandler(async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});




const settransaction = asyncHandler(async (req, res) => {
  if (!req.body.policy_number || !req.body.amount) {
    res.status(400);
    throw new Error('Please add a policy Number and amount');
  }


  // Find the user based on the policy number
  const user = await User.findOne({ policy_number: req.body.policy_number });


  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const currentYear = new Date().getFullYear();
  let yearPaid = currentYear - 1; // Default to the previous year
    
  if (user.createdAt) {
    const startYear = new Date(user.createdAt).getFullYear();
    if (startYear > yearPaid) {
      yearPaid = startYear;
    }
  }

  yearPaid += 1; // Increment to the next year

  const coverage_type = user.coverage_type;
  const branch = user.branch;
  const description = `paid ${yearPaid}'s annual premium for ${coverage_type} Insurance`;
  // Create the transaction using user's information
  const transaction = await Transaction.create({
    policy_number: req.body.policy_number,
    amount: req.body.amount,
    modeOfPay: req.body.modeOfPay,
    date_of_payment: new Date().toISOString(),
    client_name: user.name,
    description,
    branch,
    coverage_type
  });
  res.status(200).json(transaction);
});

//total transaction according to background





module.exports = {
  gettransactions,
  settransaction 
}
