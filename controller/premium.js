const User=require('../models/user')
const Expense=require('../models/expenses')
const sequelize=require('../util/database')
const downloadedFile=require('../models/downloaded-files')

// console.log('hello premium');

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
const getPreviousDownload=async(req,res,next)=>{
    try {
        const list=await downloadedFile.findAll({where:{userId:req.user.id}})
        // console.log(list,"list")
        res.status(200).json({previousDownloads:list})
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.toString() });

    }
}



module.exports={
    getUser,
    getPreviousDownload
}