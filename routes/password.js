const express=require('express')
const router=express.Router()

const passwordController=require('../controller/password')


router.post('/forget-password',passwordController.sendEmail)


module.exports=router