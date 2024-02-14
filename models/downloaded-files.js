const mongoose=require('mongoose')

const Schema = mongoose.Schema;


const downloadSchema= new Schema({
    fileUrl:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
},
{
  timestamps: true, // this option adds createdAt and updatedAt fields
}
)
module.exports=mongoose.model("Download",downloadSchema)





// const sequelize=require('../util/database')
// const Sequelize=require('sequelize')

// const DownloadFile=sequelize.define('downloadFile',{
//     id:{
//         type: Sequelize.INTEGER,
//         unique:true,
//         autoIncrement: true,
//         primaryKey:true,
//     },
//     fileURL:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// })
// module.exports=DownloadFile
