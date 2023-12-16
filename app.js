const path=require('path');

const express=require('express');
const bodyParser=require('body-parser');
const sequelize = require('./util/database');




app.post('/post-expense', async(req,res,next)=>{
    console.log(req.body)
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password; 
    const data=await ExpenseUser.create({name:name, email:email, password:password});
    const userEmail = await ExpenseUser.findOne({ where: { userEmail: email } });
    // if(!userEmail){
    //     res.status(201).json({newUser:data})
    // }else{
    //     res.status(404).json({error:"USER Already exist"})
    // }
})


sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
