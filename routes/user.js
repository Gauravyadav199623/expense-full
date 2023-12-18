const path=require('path');

const express=require('express')

const userController=require('../controller/user');

const router=express.Router()

router.post('/add-user',userController.postAddUser )

router.post('/login',userController.userLogin)


module.exports = router;