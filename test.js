
const Sib=require('sib-api-v3-sdk')

require('dotenv').config()

const client=Sib.ApiClient.instance

const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.API_KEY


const tranEmailApi=new Sib.TransactionalEmailsApi()

const sender={
    email:'gauravyadav199623@gmail.com',
    name:'Gaurav'
}

const receivers=[
    {
        email:'gauravyadav199623@outlook.com'
    }
]
tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject: 'mic testing 123',
    textContent:`chal ja bhai`,
    htmlContent:`
    <h1>heading</h1>
    <a href=''>VISIT</a>`
})
.then(console.log)
.catch(console.log)
