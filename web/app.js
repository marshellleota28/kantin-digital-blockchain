// =====================================================
// DATA MENU KANTIN
// =====================================================

const daftarMenu = {

    Makanan: [
        { nama: "Nasi Goreng", harga: 18000 },
        { nama: "Mie Goreng", harga: 17000 },
        { nama: "Ayam Geprek", harga: 22000 },
        { nama: "Bakso", harga: 15000 },
        { nama: "Soto Ayam", harga: 20000 }
    ],

    Minuman: [
        { nama: "Es Teh", harga: 5000 },
        { nama: "Es Jeruk", harga: 7000 },
        { nama: "Kopi", harga: 12000 },
        { nama: "Cappuccino", harga: 18000 },
        { nama: "Jus Alpukat", harga: 15000 }
    ]

};

// =====================================================
// MENGAMBIL KOMPONEN HTML
// =====================================================

const kategori = document.getElementById("category");
const menuSelect = document.getElementById("menu");
const harga = document.getElementById("price");
const jumlah = document.getElementById("quantity");
const total = document.getElementById("total");

const result = document.getElementById("result");

// =====================================================
// URL BACKEND
// =====================================================

const API = "http://localhost:3000";

// =====================================================
// MENAMPILKAN HASIL TRANSAKSI
// =====================================================

function tampilkan(teks) {
    result.innerText = teks;
}

// =====================================================
// MENAMPILKAN MENU BERDASARKAN KATEGORI
// =====================================================

function loadMenu() {

    const items = daftarMenu[kategori.value] || [];
    menuSelect.innerHTML = "";

    if (items.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Belum ada menu";
        menuSelect.appendChild(option);
        harga.value = "";
        total.value = "";
        return;
    }

    items.forEach((item) => {

        const option = document.createElement("option");
        option.value = item.nama;
        option.textContent = item.nama;
        menuSelect.appendChild(option);

    });

    menuSelect.value = items[0].nama;
    updateHarga();

}

// =====================================================
// MENGHITUNG HARGA DAN TOTAL
// =====================================================

function updateHarga() {

    const items = daftarMenu[kategori.value] || [];
    const item = items.find(
        x => x.nama === menuSelect.value
    );

    if (!item) {
        harga.value = "";
        total.value = "";
        return;
    }

    const qty = Number(jumlah.value || 1);

    harga.value =
        "Rp " + item.harga.toLocaleString("id-ID");

    total.value =
        "Rp " +
        (item.harga * qty)
        .toLocaleString("id-ID");

}

// =====================================================
// EVENT
// =====================================================

kategori.onchange = loadMenu;
menuSelect.onchange = updateHarga;
jumlah.oninput = updateHarga;

// Tampilkan menu pertama
loadMenu();

// =====================================================
// PESAN MAKANAN
// =====================================================

document.getElementById("orderBtn").onclick = async () => {

    // Mengambil data dari form
    const customer = document.getElementById("customer").value.trim();
    const tableNumber = Number(document.getElementById("tableNumber").value);
    const category = kategori.value;
    const menu = menuSelect.value;
    const quantity = Number(jumlah.value || 1);

    // Validasi input
    if (!customer) {
        tampilkan("Silakan isi nama pembeli terlebih dahulu.");
        return;
    }

    if (!menu) {
        tampilkan("Silakan pilih menu terlebih dahulu.");
        return;
    }

    if (quantity <= 0) {
        tampilkan("Jumlah pesanan minimal 1.");
        return;
    }

    try {

        const response = await fetch(API + "/order", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                customer,
                tableNumber,
                category,
                menu,
                quantity

            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Pesanan gagal dikirim.");
        }

        tampilkan(
`Pesanan Berhasil!

Nama Pembeli : ${customer}
Nomor Meja   : ${tableNumber}
Kategori     : ${category}
Menu         : ${menu}
Jumlah       : ${quantity}

Tx Hash :
${data.hash}`
        );

    } catch (err) {

        tampilkan(
`Pesanan Gagal!

${err.message}`
        );

    }

};

// =====================================================
// UPDATE STATUS
// =====================================================

document.getElementById("statusBtn").onclick = async () => {
    const status = prompt("Masukkan Status Baru");
    if (!status) return;
    try {
        const response = await fetch(API + "/status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status
            })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error);
        }
        tampilkan(

`Status Berhasil!

Nomor Meja : ${data.tableNumber}

Status Pesanan :
${data.oldStatus} → ${data.newStatus}

Status Meja :
${data.newStatus === "CLEAR"
    ? "Terpakai → Kosong"
    : "Terpakai"}

Tx Hash :

${data.hash}`
        );

    } catch (err) {
        tampilkan(
`Gagal Update Status

${err.message}`
        );
    }
};

// =====================================================
// LIHAT PESANAN
// =====================================================

document.getElementById("readBtn").onclick = async () => {

    try {
        const response = await fetch(API + "/order");
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Gagal mengambil data.");
        }
        tampilkan(
`Nama Pembeli : ${data.customer}
Nomor Meja   : ${data.tableNumber}
Kategori     : ${data.category}
Menu         : ${data.menu}
Jumlah       : ${data.quantity}
Status       : ${data.status}`
        );

    } catch (err) {

        tampilkan(
`Gagal mengambil data!

${err.message}`
        );

    }
};