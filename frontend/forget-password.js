const form=document.querySelector('#forget-password-form')



form.addEventListener('submit',onsubmit)

async function onSubmit(){
    e.preventDefault();

    const email=e.target.email.value
    try {
        const res=await axios.post('/password/forget-password',email)
        console.log(res);
    } catch (err) {
        console.log(err)
    }
}