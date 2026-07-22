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
## Struktur Project
```
kantin-digital-blockchain/
│
├── backend/          # Backend Express
├── lib/              # Library Foundry
├── script/           # Script deployment
├── src/              # Smart Contract Solidity
├── test/             # Unit Testing
├── foundry.toml
├── package.json
└── README.md
```

---
## Instalasi
Clone repository
```bash
git clone https://github.com/marshellleota28/kantin-digital-blockchain.git
```
Masuk ke folder project
```bash
cd kantin-digital-blockchain
```
### Install Backend
```bash
cd backend
npm install
```
### Konfigurasi Environment
Salin file `.env.example` menjadi `.env`, kemudian isi konfigurasi berikut.
```env
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
```
---
## Menjalankan Backend

```bash
npm start
```

atau

```bash
node index.js
```

---
## Smart Contract
Compile smart contract
```bash
forge build
```
Menjalankan unit test
```bash
forge test
```
Deploy smart contract
```bash
forge script
```

---
## Dokumentasi Smart Contract
Smart contract **KantinDigital.sol** digunakan untuk mengelola transaksi serta status meja pada kantin digital.

### Struktur Data
Setiap pesanan disimpan menggunakan struktur berikut.

| Field    b         | Tipe    | Keterangan |
|-------             |------   |------------|
| id                 | uint256 | ID pesanan |
| customerName       | string  | Nama pelanggan |
| tableNumber        | uint256 | Nomor meja |
| orderList          | string  | Daftar pesanan |
| totalPrice         | uint256 | Total harga |
| status             | string  | Status pesanan |

---

### Fungsi Smart Contract
| Function                         | Jenis | Deskripsi |
|----------                        |-------|-----------|
| `placeOrder()`                   | Write | Menambahkan pesanan baru dan mengubah status meja menjadi digunakan. |
| `updateStatus()`                 | Write | Mengubah status pesanan. Jika status menjadi **CLEAR**, meja kembali tersedia. |
| `getOrder()`                     | Read  | Mengambil informasi pesanan berdasarkan ID. |
| `getOrderCount()`                | Read  | Mengembalikan jumlah seluruh pesanan. |
| `isTableAvailable()`             | Read  | Mengecek apakah suatu meja masih tersedia. |
| `getAvailableTable()`            | Read  | Mengembalikan nomor meja pertama yang masih kosong. |

---
### Event
Smart contract menyediakan dua event utama.
Event dan Fungsi
`OrderPlaced` -- Dipanggil ketika pesanan baru berhasil dibuat.
`StatusUpdated` -- Dipanggil ketika status pesanan diperbarui.

---
### Mekanisme Sistem
```
Pelanggan
     │
     ▼
Membuat Pesanan
     │
     ▼
Backend Express
     │
     ▼
Ethers.js
     │
     ▼
Smart Contract
     │
     ▼
Blockchain Ethereum
```

Alur perubahan status meja:

```
Meja Tersedia
      │
      ▼
placeOrder()
      │
      ▼
Meja Digunakan
      │
      ▼
updateStatus("CLEAR")
      │
      ▼
Meja Tersedia Kembali
```

---

## Tujuan

Project ini dikembangkan sebagai implementasi teknologi blockchain pada sistem transaksi kantin digital dengan tujuan:

- Mempelajari pengembangan smart contract menggunakan Solidity.
- Mengintegrasikan backend Node.js dengan blockchain Ethereum.
- Menjamin keamanan dan integritas data transaksi.
- Menjadi media pembelajaran teknologi blockchain.

---
## Tim Pengembang
Marshell Leota Timang -- 672023062 
Tiska Jasia Yaspis Rasunde -- 672023294

---
## License
Project ini dibuat untuk keperluan pembelajaran dan pengembangan akademik.
