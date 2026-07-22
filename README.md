# Kantin Digital Blockchain
Implementasi sistem **Kantin Digital berbasis Blockchain** menggunakan **Solidity**, **Foundry**, dan **Node.js**. Proyek ini bertujuan untuk mencatat transaksi kantin secara aman, transparan, dan tidak dapat dimanipulasi dengan memanfaatkan teknologi blockchain Ethereum.

---
## Tentang Proyek
Kantin Digital Blockchain merupakan implementasi smart contract Ethereum untuk mengelola transaksi pada sistem kantin digital. Backend dibangun menggunakan **Node.js** dan berkomunikasi dengan smart contract melalui **Ethers.js**.
Dengan blockchain, setiap transaksi memiliki hash yang tersimpan secara permanen sehingga integritas data dapat terjamin.

---
## Fitur
- Smart Contract berbasis Solidity
- Backend REST API menggunakan Express.js
- Integrasi blockchain menggunakan Ethers.js
- Konfigurasi menggunakan dotenv
- Unit testing smart contract dengan Foundry
- Deployment smart contract menggunakan Forge

---
## Teknologi

Teknologi dan Kegunaan
Solidity -- Smart Contract
Foundry -- Development & Testing
Node.js -- Backend
Express.js -- REST API
Ethers.js -- Interaksi dengan Blockchain
dotenv -- Konfigurasi Environment

---
# 📂 Struktur Project

```
my-dapp
│
├── backend
│   ├── data
│   │   ├── menu.json
│   │   └── orders.json
│   └── server.js
│
├── script
│
├── src
│   └── KantinDigital.sol
│
├── test
│   └── KantinDigital.t.sol
│
├── web
│   ├── index.html
│   ├── admin.html
│   ├── admin-menu.html
│   ├── app.js
│   ├── admin.js
│   └── admin-menu.js
│
├── foundry.toml
├── package.json
└── README.md
```

---

# ✨ Fitur

## Pelanggan

- Melihat daftar menu
- Memesan makanan
- Memilih metode pembayaran
- Nomor remote diberikan otomatis
- Bukti transaksi blockchain
- Riwayat transaksi

---

## Admin

- Dashboard pesanan
- Mengubah status pesanan
- Mengelola menu
- Dashboard statistik
- Detail transaksi
- Verifikasi Transaction Hash
- Monitoring blockchain

---

# Smart Contract

Smart contract dibuat menggunakan Solidity.

## Write Function

### 1. placeOrder()

Digunakan untuk membuat pesanan baru.

Fungsi ini akan:

- Menyimpan data pesanan
- Mengurangi ketersediaan remote
- Menghasilkan Transaction Hash
- Menyimpan data ke blockchain

---

### 2. updateStatus()

Digunakan admin untuk mengubah status pesanan.

Status yang tersedia:

- Diproses
- Selesai
- CLEAR

Apabila status menjadi **CLEAR**, maka remote kembali tersedia.

---

## Read Function

Smart contract menyediakan beberapa fungsi read:

- getOrder()
- getOrderCount()
- getAvailableTable()
- isTableAvailable()

---

# Cara Menjalankan Project

## 1. Clone Repository

```bash
git clone https://github.com/marshellleota28/kantin-digital-blockchain.git
cd kantin-digital-blockchain
```

---

## 2. Install Dependency

```bash
npm install
```

---

## 3. Jalankan Blockchain (Terminal 1)

```bash
anvil
```

---

## 4. Deploy Smart Contract (Terminal 2)

```bash
forge script script/KantinDigital.s.sol:KantinDigitalScript \
--rpc-url http://127.0.0.1:8545 \
--private-key <PRIVATE_KEY> \
--broadcast
```

Setelah deploy, salin Contract Address ke backend.

---

## 5. Jalankan Backend (Terminal 3)

```bash
cd backend
npm install
node server.js
```

Server berjalan di:

```
http://localhost:3000
```

---

## 6. Jalankan Frontend (Terminal 4)

```bash
cd web
python3 -m http.server 8000
```

Buka browser:

```
http://localhost:8000
```

---

# Alur Sistem

1. Pelanggan membuka halaman utama.
2. Sistem menampilkan daftar menu.
3. Pelanggan mengisi nama.
4. Pelanggan memilih metode pembayaran.
5. Pelanggan memilih menu.
6. Sistem memanggil fungsi `placeOrder()`.
7. Blockchain menghasilkan Transaction Hash.
8. Data transaksi disimpan.
9. Admin melihat daftar pesanan.
10. Admin mengubah status menggunakan `updateStatus()`.
11. Jika status menjadi **CLEAR**, remote kembali tersedia.
12. Admin dapat melakukan verifikasi transaksi menggunakan Transaction Hash.

---

# Verifikasi Blockchain

Aplikasi menyediakan halaman verifikasi transaksi blockchain.

Informasi yang ditampilkan:

- Transaction Hash
- Block Number
- Gas Used
- Contract Address
- Network
- Chain ID
- Status Blockchain
- Data Pesanan
- Status Integritas
- Security Analysis

---

# Bukti Perubahan State

## Sebelum Pemesanan

```
Remote 1 : Available
Jumlah Pesanan : 0
```

## Setelah placeOrder()

```
Remote 1 : In Use
Jumlah Pesanan : 1
Status : Diproses
```

## Setelah updateStatus(CLEAR)

```
Remote 1 : Available
Status : CLEAR
```

---

# 👨‍💻 Authors

### Marshell Leota Timang
- **NIM:** 672023059
- **Program Studi:** S1 Teknik Informatika
- **Universitas:** Universitas Kristen Satya Wacana

### Tiska Jasia Yaspis Rasunde
- **NIM:** 672023294
- **Program Studi:** S1 Teknik Informatika
- **Universitas:** Universitas Kristen Satya Wacana
---

# Lisensi

Project ini dibuat untuk keperluan Tes Rancang.
