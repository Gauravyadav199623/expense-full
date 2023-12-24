

const myForm = document.querySelector('#my-form');
const expenseAmount = document.querySelector('#amount');
const description = document.querySelector('#description');
const category = document.querySelector('#category');
const userList = document.querySelector('#users');
const premiumBtn = document.querySelector('#rzpUl');
const leaderBoardUl = document.querySelector('#leaderBoardUl');




function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function displayOnScreen(){
   
    try{
        const token=localStorage.getItem('token')
        const res=await axios
        .get(`http://localhost:3000/expense/get-expenses`,{headers:{"Authorization":token}});
        console.log(JSON.stringify(res.data)+"inget");
        userList.innerHTML='';
        leaderBoardUl.innerHTML=''
        let TAmount=0
        
        const decodedToken=parseJwt(token)
        console.log(decodedToken);
        isPremiumUser = decodedToken.ispremiumuser;
        
        if(isPremiumUser){
            showPremium()
            leaderBoardSection()
            }

        res.data.allExpenses.forEach(item => {
            const li=document.createElement('li')
            TAmount+=item.amount
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
            console.log(token)
            
        });
        const li=document.createElement('li')
        li.appendChild(document.createTextNode(`Total Amount $${TAmount}`))
        userList.appendChild(li);
        
    }catch(err){
        console.log(err)
    }
}


function showPremium(){
    document.getElementById('rzpUl').style.display = 'none';
    const p = document.querySelector('p');
    p.textContent = 'You are a premium user';
    p.className='para'
    document.body.appendChild(p);
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

        const token=localStorage.getItem('token')

        const res= await axios
        .post(`http://localhost:3000/expense/post-expense`,data,{headers:{"Authorization":token}});
        id=res.data.id;
        console.log(JSON.stringify(res.data)+"inpost");
         return displayOnScreen()

    }
    catch(err){
        console.log(err)
    }
}


async function del(id,li){
    const token=localStorage.getItem('token')
    li.remove();
    try{
        const res=await axios
        .delete(`http://localhost:3000/expense/delete-expense/${id}`,{headers:{"Authorization":token}});
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

    }catch(err){
        console.log(err);
    }
} 
premiumBtn.addEventListener('click',premiumFunction)

async function premiumFunction(e){
    e.preventDefault();
    const token=localStorage.getItem('token')
    const decodedToken=parseJwt(token)
        console.log(decodedToken);
        let isPremiumUser = decodedToken.ispremiumuser;
    
    // let isPremiumUser = JSON.parse(localStorage.getItem('ispremiumuser'));
    // isPremiumUser=true
    if(isPremiumUser){
        showPremium()
        // leaderBoardSection()
    }
    const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}});
    console.log(response);
    var options=
    {
        "key":response.data.key_id, //enter the key id generated from the dashboard(unique identifier of the company)
        "order_id":response.data.order.id, //for one time payment
        //this handler function will handel the success payment
        "handler":async function(response){
            const res=await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers:{"Authorization":token}})

            alert('You are a Premium User Now')
            console.log(res.data,'<<<<<<<<<<<<<<<<<<<<res.data')
            
            showPremium()
            localStorage.setItem('token',res.data.token)
            
            
            leaderBoardSection()
        
            // displayOnScreen()
        

        }
    };
    const rzp1= new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', function(response){
        console.log(response);
        alert('Something went wrong')
    })
}

function leaderBoardSection(){
    
    var leaderBoardBtn = document.getElementById("newButton");
    if (!leaderBoardBtn) {
      
      leaderBoardBtn = document.createElement("button");
      let text = document.createTextNode("Leader Board");
      leaderBoardBtn.appendChild(text);
      leaderBoardBtn.id = "newButton";
      leaderBoardBtn.className = "btn btn-outline-info";
      document.body.appendChild(leaderBoardBtn);
      
      tableBtn=document.createElement('button')
      let textTable=document.createTextNode('Expenses Table')
      tableBtn.appendChild(textTable)
      tableBtn.id='showTable';
      tableBtn.className='btn btn-outline-secondary'
      document.body.appendChild(tableBtn);



      
      // Create the table and add it to the body
      var table = document.createElement('table');
      table.id = 'expensesTable';
      table.style.width = '100%';
      table.style.display = 'none';  // Initially hide the table
      table.innerHTML = `
          <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Income</th>
              <th>Expense</th>
          </tr>
      `;
      document.body.appendChild(table);
    }

    

    leaderBoardBtn.addEventListener('click',async()=>{
        console.log('hi')
        const token=localStorage.getItem('token')
        const usersOnLeaderBoard= await axios.get('http://localhost:3000/premium/leaderBoard',{headers:{"Authorization":token}})

        console.log(usersOnLeaderBoard.data,'kkkkkkkkkkkkkkkkkk')
       
        
        let leadUser=document.getElementById('leaderBoardUl')
        leadUser.innerHTML=""
        leadUser.innerHTML+='<h1>Leader Board</h1>'
        usersOnLeaderBoard.data.forEach(user => {
            leadUser.innerHTML += `<li>Name - ${user.name} -- Total Expenses - ${user.totalExpense}</li>`
          });

          document.getElementById('showTable').addEventListener('click', function() {
            document.getElementById('expensesTable').style.display = 'block';  // Show the table
        });
    })
    document.getElementById('showTable').addEventListener('click', async function() {
        // Show the table
        document.getElementById('expensesTable').style.display = 'block';
    
        // Call your function that fetches the data
        const data = await axios.get(`http://localhost:3000/expense/get-expenses`);
    
        // Get the table element from your HTML
        const table = document.getElementById('expensesTable');
    
        // Clear out the existing table data
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    
        // Add a new row for each item in your data
        data.forEach(item => {
            const row = table.insertRow();
            const dateCell = row.insertCell();
            const descCell = row.insertCell();
            const catCell = row.insertCell();
            const incomeCell = row.insertCell();
            const expenseCell = row.insertCell();
    
            // Fill the cells with data
            dateCell.textContent = item.date;
            descCell.textContent = item.description;
            catCell.textContent = item.category;
            incomeCell.textContent = item.income;
            expenseCell.textContent = item.expense;
        });
    });


    var br = document.createElement("br");
    document.body.appendChild(br);
    
}







displayOnScreen()