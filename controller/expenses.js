const UserExpense=require('../models/expenses')




exports.postExpense=async(req,res,next)=>{
    const amount=req.body.amount;
    const description=req.body.description;
    const category=req.body.category;
    const id=req.user.id
    console.log(id)
    const data=await UserExpense.create({
        amount:amount,description:description,category:category, userId:id
    });
    res.status(201).json({expenseAdded:data})
}

exports.getExpenses=async(req,res,next)=>{
    const expenses=await UserExpense.findAll({where:{userId:req.user.id}});
    res.status(200).json({allExpenses:expenses})
}

exports.deleteExpense=async(req,res,next)=>{
    const id=req.params.id;
    console.log(id)
    const expense=await UserExpense.findByPk(id)
    if(!id){
        return res.status(404).json({ error: 'expense not found' });
    }
    const delItem=await expense.destroy({where:{id:id,userId:req.user.id}})
    if(delItem){
        return res.status(200).json({message:'Expense Deleted Successfully'})
    }else{
        return res.status(404).json({message:"Expense doesn't belong to the user"})
    }
}