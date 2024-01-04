const form = document.getElementById("form");

form.addEventListener("submit",async (e)=>{
    e.preventDefault();
  try {
        const email=document.getElementById("email")
        const data={
            email: email.value
        }
        const response=await axios.post("/forgot-password",data) 
        if (response.status==200){
            alert("link sent successfully please check your mail..")
        }
    
    } catch (error) {
    console.log(error)
    alert("error")}
   
})

// const togglebtn=document.getElementById("toggle")
// const body=document.body
// const option=document.getElementsByClassName("option")[0];
// togglebtn.addEventListener("click",()=>{
//   togglebtn.classList.toggle("ri-xrp-fill")
 
//     option.classList.toggle("active");
// })