const API = "http://localhost:3000";

let showArchive = false;

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

                <td>${order.orderList}</td>

                <td>Rp ${order.totalPrice.toLocaleString("id-ID")}</td>

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