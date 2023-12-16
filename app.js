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
    console.log(JSON.stringify(req.body)+"123456")
    
    const email=req.body.email;
    const password=req.body.password;
    // const data=await ExpenseUser.create({ email:email, password:password});

    let user=await ExpenseUser.findOne({where:{email:email}})
    if (user) {
        let pass=await ExpenseUser.findOne({where:{password:password}})
        if(pass){
            res.status(200).json({  message: 'User login successfully' });
            // res.render('dashboard', { message: 'User login successfully' });
        }else{
            res.status(401).json({message:"User not authorized"})
        }
      } else {
        res.status(404).json({ message: "user not found" });
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
