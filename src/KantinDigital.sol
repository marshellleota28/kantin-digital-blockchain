// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KantinDigital {

    // ==========================
    // DATA PESANAN
    // ==========================

    string public customerName;
    uint256 public tableNumber;
    string public category;
    string public menuName;
    uint256 public quantity;
    string public status;

    // ==========================
    // STATUS MEJA
    // true  = tersedia
    // false = sedang dipakai
    // ==========================

    mapping(uint256 => bool) public tableAvailable;

    // ==========================
    // CONSTRUCTOR
    // Mengaktifkan meja 1 - 10
    // ==========================

    constructor() {

        for(uint i = 1; i <= 10; i++) {
            tableAvailable[i] = true;
        }

    }

    // ==========================
    // MEMBUAT PESANAN
    // ==========================

    function placeOrder(
        string memory _customerName,
        uint256 _tableNumber,
        string memory _category,
        string memory _menuName,
        uint256 _quantity
    ) public {

        require(
            tableAvailable[_tableNumber],
            "Meja sedang digunakan"
        );

        customerName = _customerName;
        tableNumber = _tableNumber;
        category = _category;
        menuName = _menuName;
        quantity = _quantity;

        status = "Diproses";

        // meja menjadi terpakai
        tableAvailable[_tableNumber] = false;
    }

    // ==========================
    // UPDATE STATUS
    // ==========================

    function updateStatus(
        string memory _status
    ) public {

        status = _status;

        // jika pesanan selesai
        // meja otomatis kosong kembali

        if(
            keccak256(bytes(_status))
            ==
            keccak256(bytes("CLEAR"))
        ){

            tableAvailable[tableNumber] = true;

        }

    }

    // ==========================
    // MELIHAT PESANAN
    // ==========================

    function getOrder()
        public
        view
        returns(
            string memory,
            uint256,
            string memory,
            string memory,
            uint256,
            string memory
        )
    {

        return(
            customerName,
            tableNumber,
            category,
            menuName,
            quantity,
            status
        );

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

}