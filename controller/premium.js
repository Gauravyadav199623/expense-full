const User=require('../models/user')
const Expense=require('../models/expenses')
const sequelize=require('../util/database')

console.log('hello premium');

const getUser=async(req,res,next)=>{
    try{
        const userLeaderBoardDetails=await User.findAll({
            // attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'totalCost']],
            // include:[
            //     {
            //         model:Expense,
            //         attributes:[]
            //     }
            // ],
            // group:['user.id'],
            order:[['totalExpense','DESC']]
        })

        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}



module.exports={
    getUser
}