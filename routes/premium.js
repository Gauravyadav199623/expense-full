const express=require('express');
const router=express.Router()

const premiumController=require('../controller/premium');

const authenticateMiddleware=require('../MiddleWare/authentication')


router.get('/leaderBoard',authenticateMiddleware.authenticate, premiumController.getUser)


module.exports=router