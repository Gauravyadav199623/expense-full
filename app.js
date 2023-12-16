const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');

const app = express();
const ExpenseUser=require('./models/expense-user')
var cors=require('cors')
app.use(cors())

app.use(bodyParser.json({ extended: false }));





app.post('/post-expense', async(req,res,next)=>{
    console.log(req.body)
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password; 
    const data=await ExpenseUser.create({name:name, email:email, password:password});
    // const userEmail = await ExpenseUser.findOne({ where: { userEmail: email } });
    // if(!userEmail){
    //     res.status(201).json({newUser:data})
    // }else{
    //     res.status(404).json({error:"USER Already exist"})
    // }
    res.status(201).json({expenseAdded:data})
})
app.post('/login',async(req,res,next)=>{
    console.log(req.body)
    const email=req.body.email;
    const password=req.body.password;
    let user=await ExpenseUser.findOne({where:{email:email}})
    if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: "user not found" });
      }
})


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
