const User = require('../models/user');
const uuid = require('uuid');
const jwt=require("jsonwebtoken")

const sequelize = require('../util/database');
const bcrypt=require('bcrypt');
const ForgotPassword = require('../models/forget-password');
var nodemailer = require('nodemailer');
const NODE_MAILER_EMAIL=process.env.NODE_MAILER_EMAIL
const NODE_MAILER_PASSWORD=process.env.NODE_MAILER_PASSWORD

const WEBSITE=process.env.WEBSITE
const secret=process.env.TOKEN_SECRET

require('dotenv').config();

exports.forgotPasswordGet=(req,res)=>{
    res.sendFile("forgotpassword.html",{root:"views"})
}



exports.forgotPasswordPost=async(req,res)=>{

    const email=req.body.email;
  
    
 
     try {
      //finding that user present or not present
         const oldUser=await User.findOne({
             where:{
                 email:email,
             }
         })
         //if not present then 
         if (!oldUser){
             return res.status(404).json({"message": "User not found"})
         }
         //if present then
        const id=uuid.v4()
        //create a in db using uuid.v4() for unique id
         await oldUser.createForgotPassword({
            id:id,
            active:true
            // expiresby:new Date()
         })
         //also creating a jwt token for more secure authentication
         const token=jwt.sign({email:oldUser.email ,id:oldUser.id},secret,{expiresIn:"10m"})
         //sending the link with uuid and token 
         const link=`${WEBSITE}/resetpassword/${id}/${token}`

         //createing a transporter using nodemailer
         var transporter = nodemailer.createTransport({
             service: 'outlook',
           
             auth: {
                 user: NODE_MAILER_EMAIL,//user Email
                 pass: NODE_MAILER_PASSWORD //user Email password
             }
           });
           
           //creating a option for interface of the mail
           var mailOptions = {
             from: process.env.NODE_MAILER_EMAIL,
             to: oldUser.email,
             subject: 'Reset Password',
             
             text:" reset your password",
             html:`<p> reset your password</p>
             <a href=${link}>Reset password</a>`,
           };
           
           //sending mail
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
           })
        
           //sending response of successful
        res.status(200).send(link)
 
 
     } catch (error) {
         console.log(error)
         res.status(500).json({"message": "Internal server error"})
         
     }
 
 
 
 }




 exports.resetPasswordGet = async (req, res) => {
    const { id, token } = req.params;

    try {
        const forgotPassword = await ForgotPassword.findOne({
            where: {
                id: id,
                active: true,
            }
        });

        if (!forgotPassword) {
            return res.status(401).send(`<html>
                <h1>Link expired</h1>
                <a href="/">home</a>
            </html>`);
        }

        try {
            const verify = jwt.verify(token, secret);
            await forgotPassword.update({
                active: false
            });

            res.status(200).sendFile("changepassword.html", { root: "views" });
        } catch (tokenError) {
            await forgotPassword.update({
                active: false
            });
            return res.status(401).json({ message: "expired token" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.resetPasswordPost = async (req, res) => {
    const { id, token } = req.params;
  
    try {
        const forgotPassword = await ForgotPassword.findOne({ where: { id } });
  
        if (!forgotPassword) {
            return res.status(404).json({ message: "Reset entry not found" });
        }
  
        const oldUser = await User.findOne({ where: { id: forgotPassword.userId } });
  
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }
  
        try {
            const verify = jwt.verify(token, secret);
            const { password, confirmPassword } = req.body;
  
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Password and confirmPassword do not match" });
            }
  
            const hashedPassword = await bcrypt.hash(password, 10);
  
            await User.update({ password: hashedPassword }, { where: { id: oldUser.id } });
  
            res.status(200).json({ message: "Password reset successfully" });
        } catch (tokenError) {
            console.error("Token Verification Error:", tokenError);
            return res.status(401).json({ message: "Token verification failed" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
};
