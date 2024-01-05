document.addEventListener('DOMContentLoaded', function () {
    const yearFilter = document.getElementById('yearFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    let originalExpenses = [];
    const token = localStorage.getItem('token');

    // Event listener for the "Apply Filter" button
    applyFilterBtn.addEventListener('click', applyYearFilter);

    // Add an event listener to the download button
    downloadBtn.addEventListener('click', download);

    // Load and display expenses and download list
    loadExpenses();
    loadDownloadList();

    async function download() {
        try {
            const response = await getDownloadFile(token);
            handleDownloadResponse(response);
        } catch (error) {
            console.error('Download error:', error);
        }
    }

    async function getDownloadFile(token) {
        return axios.get('download', { headers: { "Authorization": token } });
    }

    function handleDownloadResponse(response) {
        console.log(response, 'download Response');

        if (response.status === 201) {
            const a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();

            const now = new Date();
            const dateTimeString = now.toLocaleString();
            const listItem = createListItem(a, dateTimeString);

            const downloadItem = document.getElementById('downloadItem');
            downloadItem.appendChild(listItem);
        } else {
            throw new Error(response.data.message);
        }
    }

    function createListItem(element, text) {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        listItem.prepend(element);
        return listItem;
    }

    async function loadExpenses() {
        try {
            const res = await axios.get(`expense/get-expenses`, { headers: { "Authorization": token } });
            originalExpenses = res.data.allExpenses;
            console.log(originalExpenses);
            applyYearFilter();
        } catch (error) {
            console.error('Load expenses error:', error);
        }
    }

    async function loadDownloadList() {
        try {
            const list = await axios.get('/premium/previousDownload', { headers: { "Authorization": token } });
            const downloadItem = document.getElementById('downloadItem');
            downloadItem.innerHTML = '';
            console.log(list, "previousDownload");
            console.log(list.data.previousDownloads);

            list.data.previousDownloads.forEach(item => {
                const fileLink = document.createElement('a');
                fileLink.href = item.fileURL;
                fileLink.textContent = 'Download File';
                fileLink.download = 'myexpense.csv';
                const dateTimeString = new Date(item.createdAt).toLocaleString();
                const listItem = createListItem(fileLink, `(last downloaded on ${dateTimeString})`);
                downloadItem.appendChild(listItem);
            });
        } catch (error) {
            console.error('Load download list error:', error);
        }
    }

    function applyYearFilter() {
        const selectedYear = parseInt(yearFilter.value);
        const filteredExpenses = originalExpenses.filter(item => new Date(item.createdAt).getFullYear() === selectedYear);
    
        const expenseTableBody = document.getElementById('expenseTableBody');
        expenseTableBody.innerHTML = '';
    
        let counter = 1;
    
        filteredExpenses.forEach(item => {
            const date = new Date(item.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
            const row = expenseTableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
    
            cell1.textContent = counter;
            cell2.textContent = item.description;
            cell3.textContent = item.amount;
            cell4.textContent = item.category;
            cell5.textContent = formattedDate;
    
            counter++;
        });
    }
    
});
