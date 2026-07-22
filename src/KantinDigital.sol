// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KantinDigital {

    // ==========================
    // DATA PESANAN
    // ==========================

    // Struct untuk menyimpan satu data pesanan
    struct Order{

        uint256 id;
        string customerName;
        uint256 tableNumber;
        string orderList;
        uint256 totalPrice;
        string status;

    }

    // Menyimpan seluruh pesanan
    Order[] public orders;

    // Nomor ID pesanan otomatis
    uint256 public nextOrderId = 1;

    // ==========================
    // STATUS MEJA
    // ==========================

    mapping(uint256 => bool) public tableAvailable;

    // ==========================
    // EVENT------------------------event
    // ==========================

    event OrderPlaced(
        string customerName,
        uint256 tableNumber,
        string orderList,
        uint256 totalPrice
    );

    event StatusUpdated(
        uint256 tableNumber,
        string status
    );

    // ==========================
    // CONSTRUCTOR-------------------MENENTUKAN JUMLAH NOMOR ANTREAN
    // ==========================

    constructor() {

        for(uint i = 1; i <= 50; i++) {
            tableAvailable[i] = true;
        }

    }

    // ==========================
    // MEMBUAT PESANAN -----------------1 WRITE
    // ========================== 

    function placeOrder(
        string memory _customerName,
        uint256 _tableNumber,
        string memory _orderList,
        uint256 _totalPrice
    ) public {

        require(
            tableAvailable[_tableNumber],
            "Meja sedang digunakan"
        );

        orders.push(
            Order({
                id: nextOrderId,
                customerName: _customerName,
                tableNumber: _tableNumber,
                orderList: _orderList,
                totalPrice: _totalPrice,
                status: "Diproses"
            })
        );

        nextOrderId++;

        // meja menjadi terpakai
        tableAvailable[_tableNumber] = false;
        Order storage newOrder = orders[orders.length - 1];

        emit OrderPlaced(
            newOrder.customerName,
            newOrder.tableNumber,
            newOrder.orderList,
            newOrder.totalPrice
        );
    }

    // ==========================
    // UPDATE STATUS----------------WRITE
    // ==========================

    function updateStatus(
        uint256 orderId,
        string memory _status
    ) public {

    require(
        orderId > 0 && orderId <= orders.length,
        "Order tidak ditemukan"
    );

    Order storage order = orders[orderId - 1];

        order.status = _status;

        if(
            keccak256(bytes(_status))
            ==
            keccak256(bytes("CLEAR"))
        ){

            tableAvailable[order.tableNumber] = true;

        }

        emit StatusUpdated(
            order.tableNumber,
            order.status
        );

    }

    // ==========================
    // MELIHAT PESANAN--------------------------READ
    // ==========================

        function getOrder(
            uint256 orderId
        )
        public
        view
        returns(

            uint256,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory

        )
        {
            require(
                orderId > 0 && orderId <= orders.length,
                "Order tidak ditemukan"
            );

            Order memory order = orders[orderId-1];

            return(

                order.id,
                order.customerName,
                order.tableNumber,
                order.orderList,
                order.totalPrice,
                order.status

            );

        }

    function getOrderCount()
    public
    view
    returns(uint256)
    {

        return orders.length;

    }

    // ==========================
    // MELIHAT STATUS MEJA
    // ==========================

    function isTableAvailable(
        uint256 _tableNumber
    )
        public
        view
        returns(bool)
    {

        return tableAvailable[_tableNumber];

    }

    // ==========================
    // ANTREAN NOMOR MEJA/REMOTE YANG TERSEDIA
    // READ
    // ==========================
    function getAvailableTable() public view returns(uint256){

        // Mengecek nomor antrean mulai dari nomor 1 sampai 10
        for(uint256 i = 1; i <= 50; i++){

            // Jika antrean remote masih tersedia
            if(tableAvailable[i]){

                // Mengembalikan nomor remote atau antrean
                return i;

            }

        }

        // Jika semua meja penuh
        revert("Semua meja penuh");

    }

}