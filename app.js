const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');

const app = express();
const ExpenseUser=require('./models/expense-user')
var cors=require('cors')
const bcrypt = require('bcrypt');
app.use(cors())

app.use(bodyParser.json({ extended: false }));
const saltRounds = 10;





app.post('/post-expense', async(req,res,next)=>{
    console.log(req.body)
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password; 
    bcrypt.hash(password,saltRounds, async(err,hash)=>{

        const data=await ExpenseUser.create({name:name, email:email, password:hash});
        // const userEmail = await ExpenseUser.findOne({ where: { userEmail: email } });
        // if(!userEmail){
        // const data=await ExpenseUser.create({name:name, email:email, password:password});
        //     res.status(201).json({newUser:data})
        // }else{
        //     res.status(404).json({error:"USER Already exist"})
        // }
        res.status(201).json({expenseAdded:data, redirect: '/login'})
        // res.redirect('/login')
    })
})


app.post('/login',async(req,res,next)=>{
    console.log(JSON.stringify(req.body)+"123456")
    
    const email=req.body.email;
    const password=req.body.password;
    // const data=await ExpenseUser.create({ email:email, password:password});

    let user=await ExpenseUser.findOne({where:{email:email}})
    // let userData=user.toJSON()
    // console.log(JSON.stringify(userData)+"user Data");
    if (user){
        console.log(JSON.stringify(user.dataValues)+"<-User");
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result==true){
                res.status(200).json({  message: 'User login successfully' });
                // res.render('dashboard', { message: 'User login successfully' });
            }else{
                res.status(401).json({message:"User not authorized"})
            }
        })
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
