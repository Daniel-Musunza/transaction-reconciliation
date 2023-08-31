const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
// const cors = require('cors');
// import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

// const allowedOrigins = ['https://transaction-reconciliation.vercel.app', 'http://localhost'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// Use CORS middleware with options
// app.use(cors(corsOptions));
// app.use(cors());
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// Serve frontend
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '../frontend/build/static')));

  app.get('/', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, 'build',  'index.html')
    )
  );
  // app.get('/', (req, res) =>
  //   res.sendFile(
  //     path.resolve(__dirname, 'index.html')
  //   )
  // );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));