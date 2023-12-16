const loginForm=document.querySelector('#loginForm');



loginForm.addEventListener('submit',onSubmit)

async function onSubmit(e){
    e.preventDefault();
  
    const email=e.target.email.value;
    const password=e.target.password.value;


    let data={
        email,
        password
    }
    console.log(data);
    e.target.email.value='';
    e.target.password.value='';

    const res=await axios.post('http://localhost:3000/login',data)
    console.log(JSON.stringify(res.data)+"okokok"); 
    // console.log(data)


}

