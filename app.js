const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');



const app = express();

const User=require('./models/user');
const ExpenseItem=require('./models/expenses');

const userRoutes=require('./routes/user')
const expensesRoutes=require('./routes/expenses')

var cors=require('cors')

app.use(cors())


app.use(bodyParser.json({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes)
app.use(expensesRoutes)



User.hasMany(ExpenseItem);
ExpenseItem.belongsTo(User)



sequelize
  .sync()
//   .sync({force:true})
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
