const User=require('../models/user')
const Expense=require('../models/expenses')
const sequelize=require('../util/database')

console.log('hello premium');

const getUser=async(req,res,next)=>{
    try{
        const users=await User.findAll()
        const expenses=await Expense.findAll()
        const individualSum={}
        console.log(expenses,'expensesssssssssssssssssss')
        // console.log(users,'userssssssssssssssssssssss')
        expenses.forEach(expense => {
            console.log(expense.amount)
            if(individualSum[expense.userId]){
                individualSum[expense.userId]+=expense.amount
            }else{
                individualSum[expense.userId]=expense.amount
            }
        });
        let userLeaderBoardDetails=[];
        users.forEach(user=>{
            userLeaderBoardDetails.push({name:user.name,totalCost:individualSum[user.id] || 0})
        })
        console.log(userLeaderBoardDetails,'userLeaderBoardDetails')
        userLeaderBoardDetails.sort((a,b)=>b.totalCost-a.totalCost)
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}



module.exports={
    getUser
}