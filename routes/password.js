const express=require('express')
const router=express.Router()

const passwordController=require('../controller/password')


router.post('/forget-password',passwordController.forgotPassword)


router.get('/resetPassword/:id', passwordController.resetPassword);
router.post('/updatePassword/:resetPasswordId', passwordController.updatePassword);




module.exports=router;