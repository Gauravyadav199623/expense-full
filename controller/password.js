const User = require('../models/user');
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const sequelize = require('../util/database');
const bcrypt=require('bcrypt');
const ForgotPassword = require('../models/forget-password');

require('dotenv').config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        console.log(user,user.dataValues.id)
        if (user) {
            const id = uuid.v4();
            await user.createForgotPassword({ id, active: true })
                .catch(err => {
                    throw new Error('Failed to create forgot password: ' + err.message);
                });

            const sender = {
                email: 'gauravyadav199623@gmail.com', 
                name: 'gaurav' 
            };

            const receivers = [
                {
                    email: email
                }
            ];

            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'testing123',
                textContent:`Follow the link to reset the password `,
                htmlContent: `<h1>click on the link below to reset the password</h1><br>
                <a href="http://16.171.196.132:3000/password/resetpassword/${id}">Reset your Password</a>`
            })
            .then((response) => {
                return res.status(response.status).json({ message: 'Link to reset password sent to your mail ', success: true });
            })
            .catch((error) => {
                console.log(error);
            });

        } else {
            throw new Error("User Doesn't exist");
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: err.message, success: false });
    }
};

exports.resetPassword= async(req,res)=>{
    try {
        const id=req.param.id;
        const forgetPassword= await ForgotPassword.findOne({where:{id:id}})
        const result=await forgetPassword.update({
            active:false
        });
        res.status(201).send(`
            <html>
            <body>
            <div class="center">
            <div class="container">
            <form onsubmit="onsubmit(event)">
                <div class="data">
                    <label for="new-password">Enter New password:</label>
                    <input type="password" name="new-password" id="pass" required>
                </div>
                <div class="btn">
                    <div class="inner"></div>
                    <button type="submit">reset password</button>
                </div>
            </form>
            </div>
            </div>
            </body>
            </html>
        `)
        res.end()
    
    } catch (err) {
        console.log(err)
    }
}
exports.updatePassword=async(req,res)=>{
    try {
        const newPassword=req.body.pass;
        const{resetPasswordId}=req.param;
        const resetPasswordRequest= await ForgotPassword.findOne({where:{id:resetPasswordId}})

        const user=await User.findOne({where:{id:resetPasswordRequest.userId}})
        if(user){
            let saltRound=10;
            bcrypt.hash(newPassword,saltRound,async(err,hash)=>{
                if(err){
                    console.log(err)
                    throw new Error(err)
                }
                await User.update({password:hash},{where:{id:user.id}})
                console.log(user.id)
                res.status(201).json({message:'password change successfully'})
            })

        }else{
            return res.status(404).json({message:'user not found',success:false})
        }
    } catch (error) {
        console.log(error)
    }
}
