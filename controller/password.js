const User = require('../models/user');
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const sequelize = require('../util/database');
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
                htmlContent: `<a href="address">reset password</a>`
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