const path=require('path');

const express=require('express')

const userController=require('../controller/user');
const UserAuthenticate=require('../MiddleWare/authentication')


const router=express.Router()

router.post('/add-user',userController.postAddUser )

router.post('/login',userController.userLogin)
router.get('/views/sign-Up',userController.loginpage)
router.get("/login",(req,res,next)=>{
    res.sendFile("login.html",{root:"views"})
})
router.get('/sign-Up',(req,res,next)=>{
    res.sendFile("sign-Up.html",{root:'views'})
})
router.get('/add-expense.html',(req,res,next)=>{
    res.sendFile('add-Expense.html',{root:'views'})
})



module.exports = router;