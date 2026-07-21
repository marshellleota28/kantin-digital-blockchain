const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();

app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
);

const contractAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

const abi = [
    "function placeOrder(string,uint256,string,string,uint256)",
    "function updateStatus(string)",
    "function getOrder() view returns(string,uint256,string,string,uint256,string)"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);


// API UNTUK PEMESANAN

app.post("/order", async (req, res) => {

    try {

        const {
            customer,
            tableNumber,
            category,
            menu,
            quantity
        } = req.body;

        const tx = await contract.placeOrder(
            customer,
            tableNumber,
            category,
            menu,
            quantity
        );

        await tx.wait();

        res.json({
            success: true,
            hash: tx.hash
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// update STATUS PEMESANAN 
app.post("/status", async (req, res) => {

    try {

        const { status } = req.body;

        // Ambil data sebelum update
        const before = await contract.getOrder();
        console.log(before);

        const tableNumber = Number(before[1]);
        const oldStatus = before[5];

        // Baru Update status
        const tx = await contract.updateStatus(status);
        await tx.wait();

        res.json({
            success: true,
            hash: tx.hash,
            tableNumber,
            oldStatus,
            newStatus: status,
            tableStatus: status === "CLEAR"
                ? "Terpakai → Kosong"
                : "Terpakai"

                });

    } catch (err) {

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});


//STATUS MELIHAT PEMESANAN

app.get("/order", async (req, res) => {
    try {
        const data = await contract.getOrder();

        res.json({

        customer: data[0],
        tableNumber: Number(data[1]),
        category: data[2],
        menu: data[3],
        quantity: Number(data[4]),
        status: data[5]

        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
