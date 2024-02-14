

const User=require('../models/user')
const Expense=require('../models/expenses')
// const sequelize=require('../util/database')
const mongoose =require('mongoose')

// const AWS=require('aws-sdk')
const S3Services=require('../services/S3services')
const UserServices=require('../services/userservices')

const DownloadFile=require('../models/downloaded-files')




// download expenses
const downloadExpense=async(req,res,next)=>{
    try {
        // Get the expenses for the current user
        // const expenses=await UserServices.getExpenses(req);
        const expenses=await Expense.find({'user.userId':req.user._id})
        console.log(expenses,'<<<<<<<<<<<<<<<<<down');

        // Convert the expenses to a JSON string
        const stringifiedExpenses=JSON.stringify(expenses);

        // Generate a file name based on the user's ID and the current date
        const userId=req.user._id;
        const fileName=`Expense${userId}/${new Date()}.txt`;
        //chrome doesn't know how to handel the txt file by itself so it download it

        // Call the uploadToS3 function to upload the stringified expenses to S3
        // Await the promise returned by uploadToS3 to get the URL of the uploaded file
        const fileURL= await S3Services.uploadToS3(stringifiedExpenses,fileName);//! s3bucket
         //uploadToS3 return promise thats the only reason that await works
        //  const downloadedFile=await req.user.createDownloadFile({fileURL:fileURL})//!kim
        console.log(fileURL,userId,"NEW DOWNLOAD FILE");
        const downloadedFile= new DownloadFile({
            fileUrl:fileURL,
            userId:userId
        })
        await downloadedFile.save();


        console.log(fileURL)

        // Send a JSON response back to the client with the URL of the file
        res.status(201).json({fileURL:fileURL,downloadedFile:downloadedFile,success:true});
    } catch (err) {
        // If there's an error, log it and send a JSON response back to the client with an error message
        console.log(err);
        res.status(500).json({fileURL:'', success:false, err:err})
    }
};



const postExpense=async(req,res,next)=>{
    // var t=await sequelize.transaction()//?it roll back the post request if a error occur
//*In Sequelize, a transaction is a set of database operations that are executed as a single unit of work. If all operations within the transaction succeed, the transaction is committed and all changes made within the transaction are permanently saved in the database. If any operation within the transaction fails, the transaction is rolled back, and all changes made within the transaction are discarded.
//By grouping related operations together into a single transaction, you can ensure that your database remains in a consistent state even when errors occur.
    const session= await mongoose.startSession();
    session.startTransaction()
    try{
        const amount=req.body.amount;
        const description=req.body.description;
        const category=req.body.category;
        const userId=req.user._id //!belong to users(pass with the help of token) not expenseDB(stored in expense with the help of foreign key)
        console.log(userId,"userId")
        const expense=new Expense(
            {
                amount:amount,
                description:description,
                category:category, 
                user: {
                    name: req.user.name,
                    userId: req.user
                  },
                  
            },
            // {
            //     transaction:t
            // }
        );
        console.log(expense,"expense")
        console.log(req.user,"req.user")
        console.log(amount,"amount")
        const savedExpense= await expense.save({session});
        if(req.user.totalExpense){

            const totalExpense=Number(req.user.totalExpense)+Number(amount)
            await User.updateOne(
                {
                    _id:userId   // Filter Criteria
    
                },
                {
                    totalExpense:totalExpense    // Update Data
                },
                {
                    session  //optional
                }
            )
        }
        else{
            await User.updateOne(
                {
                    _id:userId   // Filter Criteria
    
                },
                {
                    totalExpense:amount    // Update Data
                },
                {
                    session  //optional
                }
            )
        }
        // console.log(totalExpense,"totalExpense");
        
        // await t.commit()
        await session.commitTransaction()
        session.endSession()
        res.status(201).json({expenseAdded:savedExpense})
    }catch(err){
        // t.rollback()
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}


const getExpenses=async(req,res,next)=>{
    try{
        console.log(req.user,"req.user.user")
        const expenses=await Expense.find({'user.userId':req.user._id});
        console.log(expenses,"expenses--expenses");
        res.status(200).json({allExpenses:expenses})
    }catch(err){
        
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

const deleteExpense=async(req,res,next)=>{
    // let t=await sequelize.transaction()
    try{
        const id=req.params.id;

        // console.log(id,"<<<id>>>")
        const delItem=await Expense.findByIdAndDelete(id)
        // if(!expense){
        //     return res.status(404).json({ error: 'expense not found' });
        // }
        // const delItem=await expense.destroy({where:{id:id,userId:req.user.id}})
        console.log(delItem,"deleted item");
        if(delItem){
            const totalExpense=Number(req.user.totalExpense)-Number(delItem.amount)
            // console.log(totalExpense);
        
            await User.updateOne({_id:req.user._id},{totalExpense:totalExpense}
            
            // transaction:t
        )
            // await t.commit()
            return res.status(200).json({message:'Expense Deleted Successfully'})
            
        }else{
            return res.status(404).json({message:"Expense doesn't belong to the user"})
        }
    }catch(err){
        // await t.rollback()
        console.log(err);
        res.status(500).json({ error: err.toString() });
    }
}

module.exports={
    postExpense,
    getExpenses,
    deleteExpense,
    downloadExpense
}