const Razorpay=require('razorpay');
const Order=require('../models/orders')

require('dotenv').config();


const purchasepremium=async(req,res)=>{
    try{
        console.log("77777777777777777777777777777777777")
        var rzp=new Razorpay({  //!THIS WILL TELL THE RAZOR PAY WHICH COMPANY IS TRYING TO CREATE AN ORDER
            // key_id: process.env.RAZORPAY_KEY_ID,
            key_id: 'rzp_test_sj4XofEAVoh8GW',
            // key_secret: process.env.RAZORPAY_KEY_SECRET
            key_secret: 'lW4M17knv7HFpbcMrdgveb5s'
        })
        const amount=2500;
        rzp.orders.create({amount, currency:"INR"}, (err,order)=>{
            if(err){
                console.log("888888888888888888888888888")
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

const updateTransactionStatus=(req,res)=>{
    try{
        const{payment_id, order_id}=req.body;
        Order.findOne({where:{orderid:order_id}}).then(order=>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(()=>{
                req.user.update({ispremiumuser:true}).then(()=>{
                    return res.status(202).json({success:true, message:"Transaction Successful"})
                }).catch((err)=>{
                    console.log(err);
                })
            }).catch((err)=>{
                throw new Error(err)
            })
        }).catch((err)=>{
            throw new Error(err)
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
  };