const User = require('../models/user');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const sequelize = require('../util/database');
const ForgotPassword=require('../models/forget-password')

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            user.createForgotPassword({ id, active: true })
                .catch(err => {
                    throw new Error('Failed to create forgot password: ' + err.message);
                });
            sgMail.setApiKey(process.env.SENdGRID_API_KEY);
            const msg = {
                to: email,
                from: 'me',
                subject: 'testing123',
                text: 'hoye ga ya nahe',
                html: `<a href="address">reset password</a>`
            };
            sgMail
                .send(msg)
                .then((response) => {
                    return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your mail ', success: true });
                })
                .catch((error) => {
                    throw new Error(error);
                });

        } else {
            throw new Error("User Doesn't exist");
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: err.message, success: false });
    }
};
