// =============================
// DATA MENU
// =============================
let foods = [];

let drinks = [];

// =============================
// CART
// =============================

let cart = [];
document.getElementById("customer").value = "";
renderCart();
// =============================
// LOAD MENU
// =============================
async function loadMenu() {
    const response = await fetch("http://localhost:3000/menu");
    const menu = await response.json();
    foods = menu.filter(item => item.category === "Makanan");
    drinks = menu.filter(item => item.category === "Minuman");
    const foodList = document.getElementById("foodList");
    const drinkList = document.getElementById("drinkList");
    foodList.innerHTML = "";
    drinkList.innerHTML = "";
    foods.forEach(item => {
        foodList.innerHTML += createCard(item);
    });
    drinks.forEach(item => {
        drinkList.innerHTML += createCard(item);
    });
}

// =============================
// CARD MENU
// =============================
function createCard(item){
    const isHabis = item.status === "Habis";
    return `
    <div class="col-md-4">
        <div class="card shadow-sm h-100">
            <div class="card-body text-center">
                <h5>${item.name}</h5>
                <h6 class="text-success">
                    Rp ${item.price.toLocaleString("id-ID")}
                </h6>

                ${
                    isHabis
                    ?
                    ``
                    :
                    `
                    <div class="d-flex justify-content-center align-items-center mb-3">
                        <button
                            class="btn btn-danger btn-sm"
                            onclick="decreaseQty('${item.name}')">
                            -
                        </button>
                        <input
                            id="qty-${item.name}"
                            class="form-control mx-2 text-center"
                            value="1"
                            readonly
                            style="width:60px;">
                        <button
                            class="btn btn-success btn-sm"
                            onclick="increaseQty('${item.name}')">
                            +
                        </button>
                    </div>
                    `
                }
                <button
                    class="btn ${isHabis ? "btn-secondary" : "btn-primary"} w-100"
                    ${isHabis ? "disabled" : `onclick="addToCartQty('${item.name}')"`}>
                    ${isHabis ? "Habis" : "Tambah ke Keranjang"}
                </button>
            </div>
        </div>
    </div>
    `;
}

//  Function Quantity (+ dan -)


function increaseQty(name){

    const input=document.getElementById("qty-"+name);

    input.value=parseInt(input.value)+1;

}

function decreaseQty(name){

    const input=document.getElementById("qty-"+name);

    if(parseInt(input.value)>1){

        input.value=parseInt(input.value)-1;

    }

}

// =============================
// TAMBAH KE CART
// =============================
function addToCartQty(name){

    const item = [...foods, ...drinks].find(x => x.name === name);

    const qty = parseInt(document.getElementById("qty-" + name).value);

    const found = cart.find(x => x.name === name);

    if(found){

        found.qty += qty;

    }else{

        cart.push({

            ...item,

            qty: qty

        });

    }

    document.getElementById("qty-" + name).value = 1;

    renderCart();

}

// =============================
// RENDER CART
// =============================

function renderCart(){

    const body = document.getElementById("cartBody");

    body.innerHTML="";

    let total=0;

    cart.forEach((item,index)=>{

        const subtotal=item.price*item.qty;

        total+=subtotal;

        body.innerHTML+=`

<tr>

    <td>${item.name}</td>

    <td>Rp ${item.price.toLocaleString("id-ID")}</td>

    <td>

        <button
        class="btn btn-danger btn-sm"
        onclick="cartMinus(${index})">

        -

        </button>

        <span class="mx-2">

            ${item.qty}

        </span>

        <button
        class="btn btn-success btn-sm"
        onclick="cartPlus(${index})">

        +

        </button>

    </td>

    <td>

        Rp ${subtotal.toLocaleString("id-ID")}

    </td>

    <td>

        <button
        class="btn btn-danger btn-sm"
        onclick="removeItem(${index})">

        Hapus

        </button>

    </td>

</tr>

`;

    });

    document.getElementById("grandTotal").innerText=

        total.toLocaleString("id-ID");

}

// Quantity di Cart
function cartPlus(index){

    cart[index].qty++;

    renderCart();

}

function cartMinus(index){

    cart[index].qty--;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    renderCart();

}



// =============================
// HAPUS ITEM
// =============================

function removeItem(index){

    cart.splice(index,1);

    renderCart();

}

// =============================
// PESAN
// =============================
document.getElementById("orderBtn").addEventListener("click", async () => {
    const customer = document.getElementById("customer").value;
    const paymentMethod =
        document.getElementById("paymentMethod").value;
    if(customer.trim() === ""){
        alert("Nama pembeli harus diisi");
        return;
    }
    if(paymentMethod === ""){
    alert("Silakan pilih metode pembayaran");
    return;
    }
    if(cart.length === 0){
        alert("Keranjang masih kosong");
        return;
    }
 try{

    const response = await fetch("http://localhost:3000/order",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            customer,
            paymentMethod,
            cart
        })
    });

    if(!response.ok){

        const err = await response.json();

        throw new Error(err.error || "Terjadi kesalahan");

    }

    const data = await response.json();

if(data.success){

    document.getElementById("result").textContent =

`========================================

PESANAN BERHASIL

========================================
Nama Pembeli: ${customer}

Nomor Antrean: ${data.tableNumber}

Metode Pembayaran: ${paymentMethod}

Total Harga: Rp ${data.totalPrice.toLocaleString("id-ID")}

Daftar Pesanan
${data.orderList}


========================================

Terima kasih telah menggunakan
Kantin Digital Berbasis Blockchain Ethereum.

========================================`;

    cart = [];
    renderCart();

    document.getElementById("customer").value = "";

    document.getElementById("paymentMethod").selectedIndex = 0;

}else{

    alert(data.error);

}

}catch(err){

    console.log(err);
    alert(err.message);

}

});

loadMenu();