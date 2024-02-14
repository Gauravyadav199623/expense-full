const mongoose=require('mongoose')

const Schema= mongoose.Schema;

const OrderSchema=new Schema({
    paymentid:{
        type:String,
        require:true
    },
    orderid:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})
module.exports=mongoose.model('Order',OrderSchema)




// const Sequelize=require('sequelize');
// const sequelize = require('../util/database');

// //id, name,password,phone,role


// const Order=sequelize.define('order',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     paymentid:Sequelize.STRING,//get after successful payment(ie after we try to do the payment)
//     orderid:Sequelize.STRING, //get from razorpay(initially when order get created)
//     status:Sequelize.STRING //initially pending
// })

// module.exports=Order