const list_element = document.getElementById('list');
const pagination_element = document.getElementById('pagination');

let current_page = 1;
let rows = 5;

function DisplayList(items, wrapper, rows_per_page, page) {
    wrapper.innerHTML = '';
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];

        // Create your list item here and append it to the wrapper
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`Expense: $${item.amount}- ${item.description}- ${item.category}`));

        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm';
        deleteBtn.appendChild(document.createTextNode('Delete'));
        li.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', () => del(item.id, li));

        var editBtn = document.createElement('button');
        editBtn.className = 'btn btn-outline-info btn-sm float-right';
        editBtn.appendChild(document.createTextNode('Edit'));
        li.appendChild(editBtn);

        editBtn.addEventListener('click', () => edit(item, item.id));

        wrapper.appendChild(li);
    }
}

function SetupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = '';

    let page_count = Math.ceil(items.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
        let btn = PaginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

function PaginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (current_page == page) button.classList.add('active');

    button.addEventListener('click', function () {
        current_page = page;
        DisplayList(items, list_element, rows, current_page);
        SetupPagination(items, pagination_element, rows);
    });

    return button;
}

async function displayOnScreen() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/expense/get-expenses`, { headers: { "Authorization": token } });

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

        DisplayList(res.data.allExpenses, list_element, rows, current_page);
        SetupPagination(res.data.allExpenses, pagination_element, rows);

    } catch (err) {
        console.log(err);
    }
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