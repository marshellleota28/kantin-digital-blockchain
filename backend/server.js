require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const app = express();
app.use(cors());
app.use(express.json());
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
        const { customer, cart } = req.body;
        // Cari meja yang tersedia
        const tableNumber = Number(await contract.getAvailableTable());
        const orderList = cart
            .map(item => `${item.name} x${item.qty}`)
            .join(" | ");

        const totalPrice = cart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );
        const tx = await contract.placeOrder(
            customer,
            tableNumber,
            orderList,
            totalPrice
        );
        const receipt = await tx.wait();
        res.json({
            success: true,
            customer,
            tableNumber,
            orderList,
            totalPrice,
            hash: tx.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
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
app.get("/order/:id", async(req,res)=>{
    try{
        const data = await contract.getOrder(req.params.id);
        res.json({
            id:Number(data[0]),
            customer:data[1],
            tableNumber:Number(data[2]),
            orderList:data[3],
            totalPrice:Number(data[4]),
            status:data[5]
        });
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

app.get("/orders", async(req,res)=>{
    try{
        const count = Number(await contract.getOrderCount());
        let orders=[];
        for(let i=1;i<=count;i++){
            const data=await contract.getOrder(i);
            orders.push({
                id:Number(data[0]),
                customer:data[1],
                tableNumber:Number(data[2]),
                orderList:data[3],
                totalPrice:Number(data[4]),
                status:data[5]
            });
        }
        res.json(orders);
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
});



app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});


