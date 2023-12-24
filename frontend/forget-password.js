const form=document.querySelector('#forget-password-form')



form.addEventListener('submit',onSubmit)

async function onSubmit(e){
    e.preventDefault();

    const email=e.target.email.value
    console.log(email)
    try {
        const res=await axios.post('http://localhost:3000/password/forget-password',{email})
        console.log(res);
        if(res.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successful sent </div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    } catch (err) {
        console.log(err)
    }
}