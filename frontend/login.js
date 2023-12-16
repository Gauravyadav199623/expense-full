const loginForm=document.querySelector('#loginForm');
const messageElement = document.querySelector('#message')



loginForm.addEventListener('submit',onSubmit)

async function onSubmit(e){
    e.preventDefault();
  
    const email=e.target.email.value;
    const password=e.target.password.value;
    messageElement.innerText=""


    let data={
        email,
        password
    }
    console.log(data);
    e.target.email.value='';
    e.target.password.value='';

    try {
        const res = await axios.post('http://localhost:3000/login', data);
        if (res.status === 200) {
            messageElement.innerText = res.data.message;
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            messageElement.innerText = error.response.data.message;
        } else if (error.request) {
            // The request was made but no response was received
            messageElement.innerText = 'No response from server';
        } else {
            // Something happened in setting up the request that triggered an Error
            messageElement.innerText = 'Error in setting up the request';
        }
    }


}

