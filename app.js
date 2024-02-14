const path=require('path');
const fs=require('fs')

const express=require('express');
const bodyParser=require('body-parser');
// const sequelize = require('./util/database');
const mongoose=require('mongoose')
const helmet=require('helmet');
const morgan=require('morgan');

require('dotenv').config();



const app = express();

const User=require('./models/user');
const ExpenseItem=require('./models/expenses');
const Order=require('./models/orders');
// const forgotPassword=require('./models/forget-password')
// const DownloadFile=require('./models/downloaded-files')

const userRoutes=require('./routes/user')
const expensesRoutes=require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes=require('./routes/premium')
// const PasswordRoutes=require('./routes/password')
// const mainPageRouter=require('./routes/mainpage')

const accessLogStream=fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'});


var cors=require('cors')

// app.use(express.static(path.join(__dirname, 'public')))
// app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('combined',{stream:accessLogStream}))
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));



app.use(bodyParser.json({ extended: false }));

app.use(userRoutes)
// app.use(mainPageRouter)
app.use(expensesRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumRoutes)
// app.use(PasswordRoutes)


// User.hasMany(ExpenseItem);
// ExpenseItem.belongsTo(User)

// User.hasMany(Order);
// Order.belongsTo(User)


// User.hasMany(forgotPassword);
// forgotPassword.belongsTo(User)

// User.hasMany(DownloadFile);
// DownloadFile.belongsTo(User);



mongoose
  .connect(
    'mongodb+srv://gauravyadav199623:2W9IkSwoc34JvuL3@cluster0.arquneu.mongodb.net/expenseTable?retryWrites=true&w=majority'
  )
  .then(result=>{
    app.listen(3000)
  })
  .catch(err=>{
    console.log(err)
  })
