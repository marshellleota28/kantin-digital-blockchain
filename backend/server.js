require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const menuFile = path.join(__dirname, "data", "menu.json");
const ordersFile = path.join(__dirname, "data", "orders.json");

// ======================
// BACA MENU
// ======================
function readMenu(){
    const data = fs.readFileSync(menuFile,"utf8");
    return JSON.parse(data);
}
// ======================
// BACA ORDERS
// ======================

function readOrders(){
    const data = fs.readFileSync(
        ordersFile,
        "utf8"
    );
    return JSON.parse(data);
}
// ======================
// SIMPAN MENU
// ======================
function saveMenu(menu){
    fs.writeFileSync(
        menuFile,
        JSON.stringify(menu, null, 4)
    );
}
// ======================
// SIMPAN ORDERS
// ======================
function saveOrders(orders){
    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders,null,4)
    );
}
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);

const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
    "function placeOrder(string,uint256,string,uint256)",
    "function updateStatus(uint256,string)",
    "function getOrder(uint256) view returns(uint256,string,uint256,string,uint256,string)",
    "function getOrderCount() view returns(uint256)",
    "function getAvailableTable() view returns(uint256)"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);


// API UNTUK PEMESANAN
app.post("/order", async (req, res) => {

    try {
        const { customer, paymentMethod, cart } = req.body;
        // Cek apakah menu masih tersedia
            const menu = readMenu();
            for (const cartItem of cart) {
                const item = menu.find(m => m.name === cartItem.name);
                if (!item) {
                    return res.status(400).json({
                        success: false,
                        error: `${cartItem.name} tidak ditemukan`
                    });
                }
                if (item.status === "Habis") {
                    return res.status(400).json({
                        success: false,
                        error: `${item.name} sedang habis`
                    });
                }
            }
        // Cari meja yang tersedia
        const tableNumber = Number(await contract.getAvailableTable());
        const orderList = cart
            .map(item => `${item.name} x${item.qty}`)
            .join(" | ");

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );
        // ======================
        // SIMPAN KE BLOCKCHAIN
        // ======================
        const tx = await contract.placeOrder(
            customer,
            tableNumber,
            orderList,
            totalPrice
        );
        const receipt = await tx.wait();
        // ======================
        // SIMPAN KE orders.json
        // ======================
        const orders = readOrders();
        const orderId =
            orders.length > 0
                ? orders[orders.length - 1].id + 1
                : 1;
        orders.push({
            id: orderId,
            customer,
            paymentMethod,
            tableNumber,
            orderList,
            totalPrice,
            status: "Diproses",
            createdAt:new Date().toLocaleString("id-ID"),
            hash: tx.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });
        saveOrders(orders);
        // ======================
        // RESPONSE KE USER
        // ======================
        res.json({
            success: true,
            customer,
            paymentMethod,
            tableNumber,
            orderList,
            totalPrice
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// update STATUS PEMESANAN 
app.post("/status", async (req, res) => {
    try{
        const { orderId, status } = req.body;
        const tx = await contract.updateStatus(orderId, status);
        const receipt = await tx.wait();
        const orders=readOrders();
        const index=orders.findIndex(
            o=>o.id==orderId
        );
        if(index!=-1){
            orders[index].status=status;
            saveOrders(orders);
        }
        res.json({
            success:true,
            hash:tx.hash,
            blockNumber:receipt.blockNumber,
            gasUsed:receipt.gasUsed.toString()
        });

    }catch(err){

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

});

//STATUS MELIHAT PEMESANAN
app.get("/order/:id",(req,res)=>{
    try{
        const orders=readOrders();
        const order=orders.find(
            o=>o.id==req.params.id
        );
        if(!order){
            return res.status(404).json({
                success:false,
                error:"Pesanan tidak ditemukan"
            });
        }
        res.json(order);
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }

});
//=====================
//ADMIN
//=====================
app.get("/orders",(req,res)=>{
    try{
        const orders=readOrders();
        res.json(orders);
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
});

//=====================
// MENU
//=====================
app.get("/menu",(req,res)=>{
    try{
        const menu = readMenu();
        res.json(menu);
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
});

//=====================
// VERIFIKASI HASH
//=====================
app.post("/verify", (req, res) => {
    try{
        const { hash } = req.body;
        const orders = readOrders();
        const order = orders.find(
            o => o.hash === hash
        );
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Transaction Hash tidak ditemukan."
            });
        }
        res.json({
            success:true,
            data:order
        });
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
});

//=====================
// BLOCKCHAIN INFO
//=====================

app.get("/blockchain-info", async (req, res) => {
    try {
        const network = await provider.getNetwork();
        res.json({
            network: "Ethereum Local (Anvil)",
            chainId: Number(network.chainId),
            contractAddress: contractAddress,
            status: "Connected"
        });
    } catch (err) {
        res.status(500).json({
            network: "Ethereum Local (Anvil)",
            status: "Disconnected",
            error: err.message
        });
    }
});

//=====================
// TAMBAH MENU
//=====================
app.post("/menu", (req, res) => {
    try {
        const { name, category, price, status } = req.body;
        const menu = readMenu();
        const newMenu = {
            id: menu.length > 0
                ? menu[menu.length - 1].id + 1
                : 1,
            name,
            category,
            price: Number(price),
            status
        };
        menu.push(newMenu);
        saveMenu(menu);
        res.json({
            success: true,
            message: "Menu berhasil ditambahkan",
            data: newMenu
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//=====================
// EDIT MENU
//=====================
app.put("/menu/:id", (req, res) => {

    try {

        const id = Number(req.params.id);

        const { name, category, price, status } = req.body;

        const menu = readMenu();

        const index = menu.findIndex(item => item.id === id);

        if (index === -1) {

            return res.status(404).json({
                success: false,
                message: "Menu tidak ditemukan"
            });

        }

        menu[index] = {
            id,
            name,
            category,
            price: Number(price),
            status
        };

        saveMenu(menu);

        res.json({
            success: true,
            message: "Menu berhasil diperbarui"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

//=====================
// HAPUS MENU
//=====================
app.delete("/menu/:id", (req, res) => {

    try {

        const id = Number(req.params.id);

        let menu = readMenu();

        const menuExists = menu.some(item => item.id === id);

        if (!menuExists) {

            return res.status(404).json({
                success: false,
                message: "Menu tidak ditemukan"
            });

        }

        menu = menu.filter(item => item.id !== id);

        saveMenu(menu);

        res.json({
            success: true,
            message: "Menu berhasil dihapus"
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


