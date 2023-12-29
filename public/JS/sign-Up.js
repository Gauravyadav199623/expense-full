const loginForm=document.querySelector('#loginForm');



loginForm.addEventListener('submit',onSubmit)

async function onSubmit(e){
    e.preventDefault();
    const name=e.target.name.value;
    const email=e.target.email.value;
    const password=e.target.password.value;


    let data={
        name,
        email,
        password
    }
    console.log(data);
    e.target.name.value='';
    e.target.email.value='';
    e.target.password.value='';

    const res=await axios.post('http://43.205.127.17:3000/add-user',data)
    console.log(data)

}

