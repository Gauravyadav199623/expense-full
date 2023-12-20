const express=require('express')


const purchaseController=require('../controller/purchase')

const authenticateMiddleware=require('../MiddleWare/authentication');

const router=express.Router();

router.get('/premiummembership',authenticateMiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus',authenticateMiddleware.authenticate,purchaseController.updateTransactionStatus)


module.exports=router