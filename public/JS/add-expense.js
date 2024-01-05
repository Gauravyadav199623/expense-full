

const myForm = document.querySelector('#my-form');
const expenseAmount = document.querySelector('#amount');
const description = document.querySelector('#description');
const category = document.querySelector('#category');
const userList = document.querySelector('#users');
const premiumBtn = document.querySelector('#rzpUl');
const leaderBoardUl = document.querySelector('#leaderBoardUl');
const downloadBtn = document.querySelector('#downloadBtn');
const list_element=document.getElementById('list')
const pagination_element=document.getElementById('pagination')
const rowsSelect = document.getElementById('rows');






function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

let current_page=1
let rows= parseInt(rowsSelect.value)

// Function to display a list of items on a page
function DisplayList(items,wrapper,rows_per_page,page){
    wrapper.innerHTML=''
    page--;

    let start=rows_per_page*page
    let end=start+rows_per_page
    let paginatedItems=items.slice(start,end)

    // Create the table and add it to the wrapper
    var table = document.createElement('table');
    table.id = 'expensesTable';
    table.className = "table table-striped table-hover table-bordered align-middle";
    table.style.width = '100%';

    // Add table header
    table.innerHTML = `
        <div class="container-fluid"> 
        <tr class="table-primary">
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Expense Amount</th>
            <th></th>
            <th></th>
        </tr>
        </div>
    `;

 // Loop through the items and add each one to the table
    for(let i=0;i<paginatedItems.length;i++)
    {
        let item=paginatedItems[i]
        // Create a new row
        const row = table.insertRow();

        // Create cells in the row
        const dateCell = row.insertCell();
        const descCell = row.insertCell();
        const catCell = row.insertCell();
        const expenseCell = row.insertCell();
        const deleteCell = row.insertCell();
        const editCell = row.insertCell();

        const date = new Date(item.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;  // Months are 0-based in JavaScript
        const day = date.getDate();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Fill the cells with data
        dateCell.textContent = formattedDate;
        descCell.textContent = item.description;
        catCell.textContent = item.category;
        expenseCell.textContent = item.amount;


      // Create delete button
      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.appendChild(document.createTextNode('Delete'));
      deleteBtn.addEventListener('click', () => del(item.id, row));
      deleteCell.appendChild(deleteBtn);
        // remove this before demo
      var editBtn = document.createElement('button');
      editBtn.className = 'btn btn-outline-info btn-sm float-right';
      editBtn.appendChild(document.createTextNode('Edit'));
      editBtn.addEventListener('click', () => edit(item, item.id));
      editCell.appendChild(editBtn);

    }
    wrapper.appendChild(table)
}
// Function to set up the pagination for the list
function SetupPagination(items,wrapper,rows_per_page){
    wrapper.innerHTML='';

    let page_count=Math.ceil(items.length/rows_per_page)// Calculate the number of page

    // Create and add the "Previous" button
    let previousBtn = document.createElement('button');
    previousBtn.innerHTML = '<<';
    previousBtn.addEventListener('click', function() {
        previousPage(items);
    });
    wrapper.appendChild(previousBtn);

    
    
    for(let i=1;i<page_count+1;i++)
    {
        let btn=paginationButton(i,items)// Create a button for each page
        wrapper.appendChild(btn)
    }
    // Create and add the "Next" button
    let nextBtn = document.createElement('button');
    nextBtn.innerHTML = '>>';
    nextBtn.addEventListener('click', function() {
        nextPage(items);
    });
    wrapper.appendChild(nextBtn);
}
// Function to go to the next page
function nextPage(items) {
    if (current_page < Math.ceil(items.length / rows)) {
        current_page++;
        DisplayList(items, list_element, rows, current_page);
        SetupPagination(items, pagination_element, rows);
    }
}

// Function to go to the previous page
function previousPage(items) {
    if (current_page > 1) {
        current_page--;
        DisplayList(items, list_element, rows, current_page);
        SetupPagination(items, pagination_element, rows);
    }
}

// Function to create a button for a specific page
function paginationButton(page,items){
    let button=document.createElement('button')
    button.innerHTML=page;

    if(current_page==page) button.classList.add('active');// If the current page is the same as the page number, add the 'active' class to the button
    
    current_page=page;

    button.addEventListener('click',function(){
        current_page=page
        DisplayList(items,list_element,rows,current_page);
        SetupPagination(items,pagination_element,rows);

    });
    return button

}

async function displayOnScreen(){
   
    try{
        const token=localStorage.getItem('token')
        const res=await axios
        .get(`expense/get-expenses`,{headers:{"Authorization":token}});
        console.log(JSON.stringify(res.data)+"inget");
        userList.innerHTML='';
        leaderBoardUl.innerHTML=''
        
        
        const decodedToken=parseJwt(token)
        // console.log(decodedToken);
        isPremiumUser = decodedToken.ispremiumuser;
        
        if(isPremiumUser){
            showPremium()
            leaderBoardSection()
            }

            
            DisplayList(res.data.allExpenses, list_element, rows, current_page);
            SetupPagination(res.data.allExpenses, pagination_element, rows);
            
            rowsSelect.addEventListener('change', function() {
                rows = parseInt(this.value);
                current_page=1
                DisplayList(res.data.allExpenses, list_element, rows, current_page);
                SetupPagination(res.data.allExpenses, pagination_element, rows);
              });
      
        
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
        // console.log(JSON.stringify(data)+"data!!!")
        e.target.amount.value='';
        e.target.category.value='';
        e.target.description.value='';

        const token=localStorage.getItem('token')

        const res= await axios
        .post(`expense/post-expense`,data,{headers:{"Authorization":token}});
        id=res.data.id;
        // console.log(JSON.stringify(res.data)+"inpost");
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
        .delete(`expense/delete-expense/${id}`,{headers:{"Authorization":token}});
        // console.log(res);
        // console.log("id="+id);
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
        // console.log(JSON.stringify(res.data)+"???")
        // console.log(updatedItem+"inside");
        
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
        // console.log(decodedToken);
        let isPremiumUser = decodedToken.ispremiumuser;
    
    // let isPremiumUser = JSON.parse(localStorage.getItem('ispremiumuser'));
    // isPremiumUser=true
    if(isPremiumUser){
        showPremium()
        // leaderBoardSection()
    }
    const response=await axios.get('purchase/premiummembership',{headers:{"Authorization":token}});
    // console.log(response);
    var options=
    {
        "key":response.data.key_id, //enter the key id generated from the dashboard(unique identifier of the company)
        "order_id":response.data.order.id, //for one time payment
        //this handler function will handel the success payment
        "handler":async function(response){
            const res=await axios.post('purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers:{"Authorization":token}})

            alert('You are a Premium User Now')
            console.log(res.data,'<<<<<<<<<<<<<<<<<<<<res.data')
            
            showPremium()
            localStorage.setItem('token',res.data.token)
            
            
            leaderBoardSection()
        
            displayOnScreen()
        

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
      
    }

    

    leaderBoardBtn.addEventListener('click',async()=>{
        const token=localStorage.getItem('token')
        const usersOnLeaderBoard= await axios.get('premium/leaderBoard',{headers:{"Authorization":token}})

        // console.log(usersOnLeaderBoard.data,'kkkkkkkkkkkkkkkkkk')
       
        
        let leadUser=document.getElementById('leaderBoardUl')
        leadUser.innerHTML=""
        leadUser.innerHTML+='<h1>Leader Board</h1>'
        usersOnLeaderBoard.data.forEach(user => {
            leadUser.innerHTML += `<li>Name - ${user.name} -- Total Expenses - ${user.totalExpense}</li>`
          });

    })    
}

downloadBtn.addEventListener('click',download)
reportbtn.addEventListener('click',()=>{
    try {
        if (!isPremiumUser) {
            return alert('Not a premium user. Buy premium to avail this option');
        }
        window.location.href = 'history';

    } catch (error) {
        console.log(error);
    }
})

async function download() {
    try {
        // Check if the user is a premium user
        if (!isPremiumUser) {
            return alert('Not a premium user. Buy premium to avail this option');
        }

        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Make a GET request to download the file
        const response = await axios.get('download', { headers: { "Authorization": token } });

        // Log the response
        console.log(response, 'download Response');

        // Check if the response status is 201 (Created)
        if (response.status === 201) {
            // Create a new anchor element for the file link
            var a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();

            // // Get the current date and time
            // const now = new Date();

            // // Format the date and time in a user-friendly format
            // const dateTimeString = now.toLocaleString();

            // // Create a new list item
            // const listItem = document.createElement('li');
            // listItem.textContent = ` downloaded on ${dateTimeString}`;

            // // Append the file link to the list item
            // listItem.prepend(a);

            // // Append the list item to the download list
            // const downloadList = document.getElementById('downloadList');
            // downloadList.appendChild(listItem);

            
        } else {
           
            throw new Error(response.data.message);
        }
    } catch (err) {
        // Log any errors
        console.log(err);
    }
}





displayOnScreen()