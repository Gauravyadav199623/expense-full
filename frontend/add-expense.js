const myForm = document.querySelector('#my-form');
const expenseAmount = document.querySelector('#amount');
const description = document.querySelector('#description');
const category = document.querySelector('#category');
const userList = document.querySelector('#users');


async function displayOnScreen(){
    try{
        const res=await axios
        .get(`http://localhost:3000/expense/get-expenses`);
        console.log(JSON.stringify(res.data)+"inget");
        userList.innerHTML='';

        res.data.allExpenses.forEach(item => {
            const li=document.createElement('li')
            li.appendChild(document.createTextNode(`Expense: $${item.amount}- ${item.description}- ${item.category}`));
            


            var deleteBtn=document.createElement('button');
            deleteBtn.className='btn btn-outline-danger btn-sm'
            deleteBtn.appendChild(document.createTextNode('Delete'))
            li.appendChild(deleteBtn);

            deleteBtn.addEventListener('click',()=>del(item.id,li))

            var editBtn=document.createElement('button');
            editBtn.className='btn btn-outline-info btn-sm float-right'
            editBtn.appendChild(document.createTextNode('Edit'));
            li.appendChild(editBtn)

            editBtn.addEventListener('click',()=>edit(item,item.id))

            userList.appendChild(li);

        });

    }catch(err){
        console.log(err)
    }
}

myForm.addEventListener('submit',onSubmit);

async function onSubmit(e){
    try{
        e.preventDefault();
        const amount = e.target.amount.value;
        const category=e.target.category.value;
        const description=e.target.description.value;

        let data={
            amount,
            category,
            description
        }
        console.log(JSON.stringify(data)+"data!!!")
        e.target.amount.value='';
        e.target.category.value='';
        e.target.description.value='';

        const res= await axios
        .post(`http://localhost:3000/expense/post-expense`,data);
        id=res.data.id;
        console.log(JSON.stringify(res.data)+"inpost");
         return displayOnScreen()

    }
    catch(err){
        console.log(err)
    }
}


async function del(id,li){
    li.remove();
    try{
        const res=await axios
        .delete(`http://localhost:3000/expense/delete-expense/${id}`);
        console.log(res);
        console.log("id="+id);
    }catch(err){
        console.log(err)
    }
}


async function edit(item,id){
    let updatedItem={
        amount :item.amount,
            description :item.description,
            category:item.category
    }
    console.log(updatedItem);
    try{
        const res=await axios
        .put(`http://crudcrud.com/api/d712e69e2fdc4cb9b117c5ce26161699/practice/${id}`,updatedItem);
        console.log(JSON.stringify(res.data)+"???")
        console.log(updatedItem+"inside");
        
        amount.value = updatedItem.amount;
        description.value = updatedItem.description;
        category.value = updatedItem.category;

    }
    catch(err){
        console.log(err);
    }
} 




displayOnScreen()