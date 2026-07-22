const API = "http://localhost:3000";

// ======================

// LOAD SEMUA MENU

// ======================
async function loadMenu() {

    const res = await fetch(API + "/menu");

    const data = await res.json();

    const table = document.getElementById("menuTable");

    table.innerHTML = "";

    data.forEach(menu => {

        table.innerHTML += `
        <tr>

            <td>${menu.id}</td>

            <td>${menu.name}</td>

            <td>${menu.category}</td>

            <td>Rp ${menu.price}</td>

            <td>${menu.status}</td>

        <td>

        <div class="d-flex justify-content-center gap-2">

        <button
        class="btn btn-outline-warning"
        onclick="editMenu(${menu.id})">

        <i class="bi bi-pencil-square"></i>

        </button>

        <button
        class="btn btn-outline-danger"
        onclick="deleteMenu(${menu.id})">

        <i class="bi bi-trash-fill"></i>

        </button>

        </div>

        </td>
        </tr>
        `;
    });
}

loadMenu();

// ======================

// TAMBAH MENU

// ======================
async function addMenu() {

    const name = document.getElementById("name").value;

    const category = document.getElementById("category").value;

    const price = document.getElementById("price").value;

    const status = document.getElementById("status").value;

    await fetch(API + "/menu", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({
            name,
            category,
            price,
            status

        })

    });

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";

    loadMenu();

}

// ======================
// EDIT MENU
// ======================
async function editMenu(id){

    const name = prompt("Nama Menu");

    if(name === null) return;

    const category = prompt("Kategori (Makanan/Minuman)");

    if(category === null) return;

    const price = prompt("Harga");

    if(price === null) return;

    const status = prompt("Status (Ready/Habis)");

    if(status === null) return;

    await fetch(API + "/menu/" + id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name,
            category,
            price,
            status

        })

    });

    loadMenu();

}

// ======================
// HAPUS MENU
// ======================
async function deleteMenu(id){

    const confirmDelete = confirm("Yakin ingin menghapus menu ini?");

    if(!confirmDelete) return;

    await fetch(API + "/menu/" + id,{

        method:"DELETE"

    });

    loadMenu();

}