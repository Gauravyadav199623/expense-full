const Razorpay=require('razorpay');
const Order=require('../models/orders')
const userController=require('../controller/user')

const jwt = require('jsonwebtoken'); 

require('dotenv').config();


const purchasepremium=async(req,res)=>{
    try{
        // console.log("77777777777777777777777777777777777")
        var rzp=new Razorpay({  //!THIS WILL TELL THE RAZOR PAY WHICH COMPANY IS TRYING TO CREATE AN ORDER
            key_id: process.env.RAZORPAY_KEY_ID,
            // key_id: 'rzp_test_sj4XofEAVoh8GW',
            key_secret: process.env.RAZORPAY_KEY_SECRET
            // key_secret: 'lW4M17knv7HFpbcMrdgveb5s'
        })
        const amount=2500;//its in paisa i think
        rzp.orders.create({amount, currency:"INR"}, (err,order)=>{
            if(err){
                // console.log("888888888888888888888888888")
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status:'PENDING'})
            .then(()=>{
                return res.status(201).json({order, key_id:rzp.key_id})//key of the company in which user trying to create an order
            }).catch(err=>{
                throw new Error(err);
            })
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message:'Some thing went wrong', error:err})
    }
}

const updateTransactionStatus=async (req,res)=>{
    try {
        const userId=req.user.id
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });

        // Create promises for the updates
        const orderUpdate = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const userUpdate = req.user.update({ ispremiumuser: true });

        // Use Promise.all to run the updates concurrently(when ever we are calling a promise inside another promise while the promises are not dependent on each other)
        await Promise.all([orderUpdate, userUpdate]);//mind the square bracket

        return res.status(202).json({ success: true, message: "Transaction Successful",token:userController.generateAccessToken(userId,undefined,true) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
  };