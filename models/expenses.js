const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const expenseSchema= new Schema({
  amount:{
    type:Number,
    required:true
  },
  description:{
    type: String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
},
{
  timestamps: true, // this option adds createdAt and updatedAt fields
}
)

module.exports=mongoose.model('Expense',expenseSchema)


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   amount: Sequelize.INTEGER,
//   description: Sequelize.STRING,
//   category: Sequelize.STRING
// });

// module.exports = Expense;
