const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');



const app = express();

const User=require('./models/user');
const ExpenseItem=require('./models/expenses');
const Order=require('./models/orders');

const userRoutes=require('./routes/user')
const expensesRoutes=require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes=require('./routes/premium')
const PasswordRoutes=require('./routes/password')

var cors=require('cors')

app.use(cors())


app.use(bodyParser.json({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes)
app.use(expensesRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumRoutes)
app.use('/password',PasswordRoutes)



User.hasMany(ExpenseItem);
ExpenseItem.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User)


sequelize
  .sync()
  // .sync({force:true})
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
