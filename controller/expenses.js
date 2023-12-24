

const User=require('../models/user')
const Expense=require('../models/expenses')
const sequelize=require('../util/database')


exports.postExpense=async(req,res,next)=>{
    var t=await sequelize.transaction()//?it roll back the post request if a error occur
//*In Sequelize, a transaction is a set of database operations that are executed as a single unit of work. If all operations within the transaction succeed, the transaction is committed and all changes made within the transaction are permanently saved in the database. If any operation within the transaction fails, the transaction is rolled back, and all changes made within the transaction are discarded.
//By grouping related operations together into a single transaction, you can ensure that your database remains in a consistent state even when errors occur.

    try{
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
        
        await User.update({totalExpense:totalExpense},{
            where:{id:req.user.id},
            transaction:t
        })
        await t.commit()
        res.status(201).json({expenseAdded:data})
    }catch(err){
        t.rollback()
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}


exports.getExpenses=async(req,res,next)=>{
    try{
        const expenses=await Expense.findAll({where:{userId:req.user.id}});
        
        res.status(200).json({allExpenses:expenses})
    }catch(err){
        
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

exports.deleteExpense=async(req,res,next)=>{
    let t=await sequelize.transaction()
    try{
        const id=req.params.id;
        console.log(id)
        const expense=await Expense.findByPk(id)
        if(!expense){
            return res.status(404).json({ error: 'expense not found' });
        }
        const delItem=await expense.destroy({where:{id:id,userId:req.user.id}})
        console.log(delItem);
        if(delItem){
            const totalExpense=Number(req.user.totalExpense)-Number(expense.amount)
            console.log(totalExpense);
        
            await User.update({totalExpense:totalExpense},{
            where:{id:req.user.id},
            transaction:t
        })
            await t.commit()
            return res.status(200).json({message:'Expense Deleted Successfully'})
            
        }else{
            return res.status(404).json({message:"Expense doesn't belong to the user"})
        }
    }catch(err){
        await t.rollback()
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}