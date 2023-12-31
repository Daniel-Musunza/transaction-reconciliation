import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + '/api/transactions/'
// Get user transactions
const gettransactions = async (token) => {
 
  const response = await axios.get(API_URL)

  return response.data
}

const addtransaction = async (transactionData) => {

  const response = await axios.post(API_URL , transactionData)

  return response.data
}

const transactionService = {
  gettransactions,
  addtransaction,
}


export default transactionService
