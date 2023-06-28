function fun2() {
    console.log("clicked")

    const inp = "https://api.coinstats.app/public/v1/coins?skip=0&limit=200&currency=INR";
    let data = []
    async function getData() {
        const response = await fetch(inp);
        data = {
            "id": 1,
            "content": await response.json()
        }
        console.log(data)
        fun1(data, inp);
    }
    getData();
}

const fun1 = (data, inp) => {
    console.log(data);
    const DBName = inp + "db";
    const request = indexedDB.open(DBName, 1);

    request.onupgradeneeded = (event) => {
        console.log("upgraded");
        const db = event.target.result;
        const PNotes = db.createObjectStore("PNotes1", { keyPath: "id" });

        var txn = event.target.transaction;

        const st = txn.objectStore("PNotes1");
        // Access the object store
        const addRequest = st.add(data);

        addRequest.onsuccess = function (event) {
            console.log('Data added to IndexedDB successfully');
            //send a request to the localhost 3000 server with the link

            fetch('http://localhost:3000/', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                res = res.json().then((data) => {
                    console.log(data.coins);
                    dt1 = data.coins
                })
            }).catch(error => console.log('Error:', error));



        };

        addRequest.onerror = function (event) {
            console.error('Error adding data to IndexedDB', event.target.error);
        };



    }

    const retriveFromCloud = () => {
        fetch('http://localhost:3000/api', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            res = res.json().then((data) => {
                console.log(data[0].content.coins);
                var data2 = data[0].content.coins;
                // dt1 = data.coins
                const parentElement = document.getElementById('data');
                for (let i = 0; i < data2.length; i++) {
                    parentElement.innerHTML += `<p>${data2[i].name}</p>`;
                }
            })
        }).catch(error => console.log('Error:', error));
    }

    request.onsuccess = (event) => {

        const parentElement = document.getElementById('data');
        console.log("success");
        var button = document.getElementById('btn');
        button.style.display = 'none';
        var dt1 = {};

        const db = event.target.result;

        var transaction = db.transaction('PNotes1', 'readonly');
        var objectStore = transaction.objectStore('PNotes1');

        var getDataRequest = objectStore.getAll();

        getDataRequest.onsuccess = function (event) {
            var data1 = event.target.result;
            data1 = data1[0].content.coins;
            //document.getElementById("data").innerHTML = JSON.stringify(data1[0].content.coins[0].name);

            console.log(data1.length);

            for (let i = 0; i < data1.length; i++) {
                parentElement.innerHTML += `<p>${data1[i].name}</p>`;
            }


            // Handle the retrieved data
            console.log(data1);
            retriveFromCloud();
        };

        transaction.onerror = function (event) {
            console.error('Error opening transaction:', event.target.error);
        };
        // perform operations on the database
        console.log(db + "success");

    }
    request.onerror = (event) => {
        // handle errors
        console.log(event.target.errorCode);


    }
}



window.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById('btn');
    if (el) {
        el.addEventListener('click', fun2);
    }
});
