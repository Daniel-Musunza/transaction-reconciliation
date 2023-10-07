const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(
  {
   
      origin: ["https://transaction-reconciliation.vercel.app"],
      methods: ["POST", "GET", "PUT", "DELETE"]
  }
));
// app.use(cors(
//   {
   
//       origin: ["http://localhost:3001"],
//       methods: ["POST", "GET", "PUT", "DELETE"]
//   }
// ));


app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get("/", (req, res) => {
  res.json("IRT API");
})

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
