const path=require('path');

const express=require('express')

const userController=require('../controller/user');
const UserAuthenticate=require('../MiddleWare/authentication')


const router=express.Router()

router.post('/add-user',userController.postAddUser )

router.post('/login',userController.userLogin)



module.exports = router;