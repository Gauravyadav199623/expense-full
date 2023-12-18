const User=require('../models/user')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const saltRounds = 10;
function generateAccessToken(id,name){
    return jwt.sign({userId:id, name:name},'secreteKey')
}



exports.postAddUser=async(req,res,next)=>{
    console.log(req.body)
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password; 
    bcrypt.hash(password,saltRounds, async(err,hash)=>{

        const data=await User.create({name:name, email:email, password:hash});
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
}


exports.userLogin=async(req,res,next)=>{
    console.log(JSON.stringify(req.body)+"123456")
    
    const email=req.body.email;
    const password=req.body.password;
    // const data=await ExpenseUser.create({ email:email, password:password});

    let user=await User.findOne({where:{email:email}})
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
}