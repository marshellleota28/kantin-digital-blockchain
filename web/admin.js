const API = "http://localhost:3000";

let showArchive = false;
let detailModal;

// ======================
// LOAD SEMUA PESANAN
// ======================
async function loadOrders() {

    try {

        const response = await fetch(`${API}/orders`);
        const orders = await response.json();

        // Filter data
        const data = showArchive
            ? orders
            : orders.filter(order => order.status !== "CLEAR");

        // Statistik
        document.getElementById("totalOrder").innerHTML = data.length;

        document.getElementById("diprosesCount").innerHTML =
            data.filter(o => o.status === "Diproses").length;

        document.getElementById("selesaiCount").innerHTML =
            data.filter(o => o.status === "Selesai").length;

        document.getElementById("aktifCount").innerHTML =
            data.filter(o => o.status !== "CLEAR").length;

        // Isi tabel
        const table = document.getElementById("orderTable");
        table.innerHTML = "";

        data.forEach(order => {

            table.innerHTML += `

            <tr>

            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.tableNumber}</td>
            <td>${order.paymentMethod}</td>
            <td>

            Rp ${order.totalPrice.toLocaleString("id-ID")}

            </td>

            <td>

            ${order.status}

            </td>

            <td>

            <button
            class="btn btn-warning btn-sm me-1"
            onclick="changeStatus(${order.id}, 'Diproses')">

            Diproses

            </button>

            <button
            class="btn btn-success btn-sm me-1"
            onclick="changeStatus(${order.id}, 'Selesai')">

            Selesai

            </button>

            <button
            class="btn btn-danger btn-sm"
            onclick="changeStatus(${order.id}, 'CLEAR')">

            CLEAR

            </button>

            </td>

            <td>

            <button
            class="btn btn-primary btn-sm"
            onclick="showDetail(${order.id})">

            <i class="bi bi-eye-fill"></i>

            Detail

            </button>

            </td>

            </tr>

            `;

        });

    } catch (err) {

        console.error(err);

        alert("Gagal mengambil data dari server.");

    }

}

// ======================
// UBAH STATUS
// ======================
async function changeStatus(orderId, status) {

    try {

        const response = await fetch(`${API}/status`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                orderId: orderId,
                status: status

            })

        });

        const result = await response.json();

        if (result.success) {

            alert(`Status berhasil diubah menjadi ${status}`);
            loadOrders();
        } else {
            alert(result.error);
        }
    } catch (err) {

        console.error(err);

    }

}

// ======================
// REFRESH
// ======================
document
    .getElementById("refresh")
    .addEventListener("click", loadOrders);

// ======================
// TAMPILKAN / SEMBUNYIKAN RIWAYAT
// ======================
document
    .getElementById("toggleArchive")
    .addEventListener("click", () => {

        showArchive = !showArchive;

        document.getElementById("toggleArchive").innerHTML =
            showArchive
                ? "📂 Sembunyikan Riwayat"
                : "📂 Tampilkan Riwayat";

        loadOrders();

    });

// ======================
// LOAD PERTAMA
// ======================
loadOrders();

// ======================
// INISIALISASI MODAL
// ======================
detailModal = new bootstrap.Modal(
    document.getElementById("detailModal")
);

// ======================
// DETAIL PESANAN
// ======================
async function showDetail(id){

    try{

        const response = await fetch(`${API}/order/${id}`);
        const order = await response.json();

        document.getElementById("detailContent").innerHTML = `

<div class="container-fluid">

    <div class="row mb-3">
        <div class="col-5 fw-bold">Nama Pembeli</div>
        <div class="col-7">${order.customer}</div>
    </div>

    <div class="row mb-3">
        <div class="col-5 fw-bold">Nomor Antrean</div>
        <div class="col-7">${order.tableNumber}</div>
    </div>

    <div class="row mb-3">
        <div class="col-5 fw-bold">Metode Pembayaran</div>
        <div class="col-7">${order.paymentMethod}</div>
    </div>

    <div class="row mb-3">
        <div class="col-5 fw-bold">Daftar Pesanan</div>
        <div class="col-7">${order.orderList}</div>
    </div>

    <div class="row mb-3">
        <div class="col-5 fw-bold">Total Harga</div>
        <div class="col-7">
            Rp ${order.totalPrice.toLocaleString("id-ID")}
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-5 fw-bold">Status</div>
        <div class="col-7">
            <span class="badge bg-primary">
                ${order.status}
            </span>
        </div>
    </div>

    <hr>

    <h5 class="mb-3">
        🔗 Informasi Blockchain
    </h5>

    <div class="row mb-3">

        <div class="col-5 fw-bold">

            Transaction Hash

        </div>

        <div class="col-7">

            <small
            id="txHash"
            style="word-break:break-all;">

                ${order.hash}

            </small>

            <br><br>

            <button
            class="btn btn-outline-primary btn-sm"
            onclick="copyHash('${order.hash}')">

                📋 Salin Hash

            </button>

        </div>

    </div>
    <div class="row mb-3">
        <div class="col-5 fw-bold">
            Block Number
        </div>

        <div class="col-7">
            ${order.blockNumber}
        </div>
    </div>

    <div class="row">
        <div class="col-5 fw-bold">
            Gas Used
        </div>

        <div class="col-7">
            ${order.gasUsed}
        </div>
    </div>

</div>

`;

    detailModal.show();

} catch (err) {

    console.error(err);

    alert("Gagal mengambil detail pesanan.");

}

}

// ======================
// SALIN HASH
// ======================
async function copyHash(hash) {
    console.log("Hash yang akan disalin:", hash);
    try {
        await navigator.clipboard.writeText(hash);
        alert("Transaction Hash berhasil disalin.");
    } catch (err) {
        console.error(err);
        alert("Gagal menyalin Transaction Hash.");
    }
}
// ======================
// PASTE HASH
// ======================

async function pasteHash() {

    try {

        const hash = await navigator.clipboard.readText();

        document.getElementById("verifyHash").value = hash;

    } catch (err) {

        alert("Clipboard tidak dapat diakses.");

    }

}

// ======================
// VERIFIKASI HASH
// ======================

async function verifyHash() {

    const hash = document
        .getElementById("verifyHash")
        .value
        .trim();

    if (hash === "") {

        alert("Transaction Hash masih kosong.");

        return;

    }

    try {

        const response = await fetch(`${API}/verify`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                hash: hash
            })

        });

        const result = await response.json();
        const infoResponse = await fetch(`${API}/blockchain-info`);
        const blockchain = await infoResponse.json();

        if (!result.success) {

            document.getElementById("verifyResult").innerHTML = `

<div class="alert alert-danger">

<h5>❌ Transaction Hash Tidak Valid</h5>

Hash tidak ditemukan pada blockchain.

</div>

`;

            return;

        }

        const order = result.data;

        document.getElementById("verifyResult").innerHTML = `

        <div class="alert alert-success">

        <h3 class="mb-3">

        ✅ Transaksi Valid

        </h3>

        <hr>

        <h5 class="text-success">

        ⛓️ Informasi Blockchain

        </h5>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Network

        </div>

        <div class="col-8">

        ${blockchain.network}

        </div>

        </div>
        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Chain ID

        </div>

        <div class="col-8">

        ${blockchain.chainId}

        </div>

        </div>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Smart Contract

            </div>

            <div class="col-8">

                Kantin Digital

            </div>

        </div>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Contract Address

            </div>

            <div class="col-8">

                <small style="word-break:break-all">

                    ${blockchain.contractAddress}

                </small>

            </div>

        </div>

        <div class="row mb-4">

        <div class="col-4 fw-bold">

        Status Blockchain

        </div>

        <div class="col-8">

        <span class="badge bg-success">

        <span class="badge bg-success">

            ${blockchain.status}

            </span>

        </span>

        </div>

        </div>

        <hr>

        <h5 class="text-primary">

        🧾 Informasi Transaksi

        </h5>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Nama Pembeli

        </div>

        <div class="col-8">

        ${order.customer}

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Nomor Remote

        </div>

        <div class="col-8">

        ${order.tableNumber}

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Metode Pembayaran

        </div>

        <div class="col-8">

        ${order.paymentMethod}

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Daftar Pesanan

        </div>

        <div class="col-8">

        ${order.orderList}

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Total

        </div>

        <div class="col-8">

        Rp ${Number(order.totalPrice).toLocaleString("id-ID")}

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Status Pesanan

        </div>

        <div class="col-8">

        ${order.status}

        </div>

        </div>

        <div class="row mb-4">

        <div class="col-4 fw-bold">

        Waktu Transaksi

        </div>

        <div class="col-8">

        ${order.createdAt}

        </div>

        </div>

        <hr>

        <h5 class="text-dark">

        🔐 Bukti Blockchain

        </h5>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Transaction Hash

        </div>

        <div class="col-8">

        <small style="word-break:break-all">

        ${order.hash}

        </small>

        </div>

        </div>

        <div class="row mb-2">

        <div class="col-4 fw-bold">

        Block Number

        </div>

        <div class="col-8">

        ${order.blockNumber}

        </div>

        </div>

        <div class="row mb-3">

        <div class="col-4 fw-bold">

        Gas Used

        </div>

        <div class="col-8">

        ${order.gasUsed}

        </div>

        </div>

        <hr>

        <div class="text-center">

        <span class="badge bg-success fs-6">

        ✔ Integrity Verified

        </span>

        </div>

        <hr>

        <h5 class="text-danger">

        🔒 Analisis Keamanan

        </h5>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Status Integritas

            </div>

            <div class="col-8">

                <span class="badge bg-success">

                    ✔ Verified

                </span>

            </div>

        </div>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Validasi Hash

            </div>

            <div class="col-8">

                Hash sesuai dengan transaksi blockchain

            </div>

        </div>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Data Transaksi

            </div>

            <div class="col-8">

                Tidak mengalami perubahan

            </div>

        </div>

        <div class="row mb-2">

            <div class="col-4 fw-bold">

                Status Smart Contract

            </div>

            <div class="col-8">

                Aman (Validasi berhasil)

            </div>

        </div>        




        </div>

        `;

    } catch (err) {

        console.error(err);

        alert("Terjadi kesalahan saat verifikasi.");

    }

}
    