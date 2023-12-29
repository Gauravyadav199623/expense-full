
const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const DownloadFile=sequelize.define('downloadFile',{
    id:{
        type: Sequelize.INTEGER,
        unique:true,
        autoIncrement: true,
        primaryKey:true,
    },
    fileURL:{
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports=DownloadFile
