const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const userSchema= new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  ispremius:{
    type:Boolean
  },
  totalExpense:{
    type:Number
  }
});

module.exports=mongoose.model('User', userSchema);



// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email:{
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   password: Sequelize.STRING,
//   ispremiumuser:Sequelize.BOOLEAN,
//   totalExpense:Sequelize.INTEGER
  
// });

// module.exports = User;
