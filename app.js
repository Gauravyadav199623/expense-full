const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');

const jwt = require('jsonwebtoken');

const app = express();

const ExpenseUser=require('./models/user');
const ExpenseItem=require('./models/expenses');

var cors=require('cors')
const bcrypt = require('bcrypt');
// const Expense = require('./models/expenses');
// const User = require('./models/user');

app.use(cors())

app.use(bodyParser.json({ extended: false }));
const saltRounds = 10;

function generateAccessToken(id,name){
    return jwt.sign({userId:id, name:name},'secreteKey')
}



app.post('/add-user', async(req,res,next)=>{
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
        res.status(201).json({userAdded:data, redirect: '/login'})
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
                res.status(200).json({  message: 'User login successfully',token: generateAccessToken(user.id, user.name)});
                // res.render('dashboard', { message: 'User login successfully' });
            }else{
                res.status(401).json({message:"User not authorized"})
            }
        })
      } else {
        res.status(404).json({ message: "user not found" });
      }
})


app.post('/expense/post-expense',(req,res,next)=>{
    const token=req.header('Authorization');
    console.log(token);
    const user=jwt.verify(token,'secreteKey');
    console.log("userID>>>>>>",user.userId)
    ExpenseUser.findByPk(user.userId).then(user=>{
        console.log(JSON.stringify(user));
        req.user=user; //kim
        next();
    })   
})
app.post('/expense/post-expense',async(req,res,next)=>{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.category;
    const id=req.user.id
    console.log(id)
    const data=await ExpenseItem.create({
        amount:amount,description:description,category:category, userId:id
    });
    res.status(201).json({expenseAdded:data})
})

app.get('/expense/get-expenses',(req,res,next)=>{
    const token=req.header('Authorization');
    console.log(token);
    const user=jwt.verify(token,'secreteKey');
    console.log("userID>>>>>>",user.userId)
    ExpenseUser.findByPk(user.userId).then(user=>{
        console.log(JSON.stringify(user));
        req.user=user; //kim
        next();
    })   
})
app.get('/expense/get-expenses',async(req,res,next)=>{
    const expenses=await ExpenseItem.findAll({where:{userId:req.user.id}});
    res.status(200).json({allExpenses:expenses})
})


app.delete('/expense/delete-expense/:id',async(req,res,next)=>{
    const id=req.params.id;
    console.log(id)
    const expense=await ExpenseItem.findByPk(id)
    if(!id){
        return res.status(404).json({ error: 'expense not found' });
    }
    await expense.destroy()
    res.status(200).json({message:'Expense Deleted Successfully'})
})

ExpenseUser.hasMany(ExpenseItem);
ExpenseItem.belongsTo(ExpenseUser)



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
