

const User=require('../models/user')
const Expense=require('../models/expenses')
const sequelize=require('../util/database')


exports.postExpense=async(req,res,next)=>{
    try{
        var t=await sequelize.transaction()
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;
        const userId=req.user.id //!belong to users(pass with the help of token) not expense(stored in expense with the help of foreign key)
        console.log(userId)
        const data=await Expense.create({
            amount:amount,description:description,category:category, userId:userId,
        },{transaction:t});
        const totalExpense=Number(req.user.totalExpense)+Number(amount)
        console.log(totalExpense);
        
        User.update({totalExpense:totalExpense},{
            where:{id:req.user.id},
            transaction:t
        })
        t.commit()
        res.status(201).json({expenseAdded:data})
    }catch(err){
        t.rollback()
        console.log(err);
    }
}

exports.getExpenses=async(req,res,next)=>{
    try{
        const expenses=await Expense.findAll({where:{userId:req.user.id}});
        
        res.status(200).json({allExpenses:expenses})
    }catch(err){
        
        console.log(err);
    }
}

exports.deleteExpense=async(req,res,next)=>{
    try{
        const id=req.params.id;
        console.log(id)
        const expense=await Expense.findByPk(id)
        if(!id){
            return res.status(404).json({ error: 'expense not found' });
        }
        const delItem=await expense.destroy({where:{id:id,userId:req.user.id}})
        if(delItem){
            return res.status(200).json({message:'Expense Deleted Successfully'})
        }else{
            return res.status(404).json({message:"Expense doesn't belong to the user"})
        }
    }catch(err){
        console.log(err);
    }
}