// ====== SELECT ELEMENTS ======
const addItemBtn = document.getElementById("addItemBtn");
const resetBtn = document.getElementById("resetBtn");
const generateReceiptBtn = document.getElementById("generateReceiptBtn");
const newBillBtn = document.getElementById("newBillBtn");

const receiptTable = document.querySelector("#receiptTable tbody");
const grandTotalDisplay = document.getElementById("grandTotal");
const receiptOutput = document.getElementById("receiptOutput");

const shopNameInput = document.getElementById("shopName");
const shopAddressInput = document.getElementById("shopAddress");
const itemNameInput = document.getElementById("itemName");
const itemQuantityInput = document.getElementById("itemQuantity");
const itemPriceInput = document.getElementById("itemPrice");

// ====== VARIABLES ======
let items = [];
let grandTotal = 0;

// ====== ADD ITEM ======
addItemBtn.addEventListener("click", () => {

    const name = itemNameInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);

    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert("Please enter valid item details.");
        return;
    }

    const total = quantity * price;

    items.push({
        name,
        quantity,
        price,
        total
    });

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>₹${price.toFixed(2)}</td>
        <td>₹${total.toFixed(2)}</td>
    `;

    receiptTable.appendChild(row);

    grandTotal += total;
    grandTotalDisplay.textContent = grandTotal.toFixed(2);

    itemNameInput.value = "";
    itemQuantityInput.value = "";
    itemPriceInput.value = "";

    itemNameInput.focus();
});

// ====== RESET ITEM INPUTS ======
resetBtn.addEventListener("click", () => {

    itemNameInput.value = "";
    itemQuantityInput.value = "";
    itemPriceInput.value = "";

    itemNameInput.focus();

});

// ====== GENERATE RECEIPT ======
generateReceiptBtn.addEventListener("click", () => {

    if (items.length === 0) {
        alert("Please add at least one item.");
        return;
    }

    const shopName = shopNameInput.value.trim().toUpperCase();
    const shopAddress = shopAddressInput.value.trim().toUpperCase();

    if (!shopName || !shopAddress) {
        alert("Please enter Shop Name and Shop Address.");
        return;
    }

    let receiptHTML = `
    <div style="text-align:center;">
        <h2>${shopName}</h2>
        <p>${shopAddress}</p>
        <hr>
    </div>

    <table style="width:100%;border-collapse:collapse;text-align:center;">
        <thead>
            <tr>
                <th>Item</th>
                <th>Price (₹)</th>
                <th>Qty</th>
                <th>Total (₹)</th>
            </tr>
        </thead>
        <tbody>
    `;

    items.forEach(item => {

        receiptHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>${item.total.toFixed(2)}</td>
        </tr>
        `;

    });

    receiptHTML += `
        </tbody>
    </table>

    <div style="text-align:right;margin-top:15px;">
        <strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong>
    </div>

    <p style="text-align:center;margin-top:20px;">
        Thank you for shopping with us!
    </p>

    <div style="text-align:center;margin-top:20px;">
        <button id="printBtn">🖨️ Print Receipt</button>
        <button id="downloadBtn">⬇️ Download PDF</button>
    </div>
    `;

    receiptOutput.innerHTML = receiptHTML;
    receiptOutput.style.display = "block";

    // ===== PRINT =====
    document.getElementById("printBtn").onclick = () => {

        const printWindow = window.open("", "", "width=900,height=700");

        printWindow.document.write(`
            <html>
            <head>
                <title>Receipt</title>
            </head>
            <body>
                ${receiptOutput.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();

    };

    // ===== PDF =====
    document.getElementById("downloadBtn").onclick = async () => {

        const { jsPDF } = window.jspdf;

        const canvas = await html2canvas(receiptOutput);

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "pt", "a4");

        const pdfWidth = 550;
        const pdfHeight = canvas.height * pdfWidth / canvas.width;

        pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);

        pdf.save(shopName + "_Receipt.pdf");

    };

});

// ====== GENERATE NEW BILL ======
newBillBtn.addEventListener("click", () => {

    if (!confirm("Do you want to generate a new bill?")) return;

    // Clear array
    items = [];

    // Reset total
    grandTotal = 0;
    grandTotalDisplay.textContent = "0.00";

    // Clear table
    receiptTable.innerHTML = "";

    // Clear inputs
    shopNameInput.value = "";
    shopAddressInput.value = "";
    itemNameInput.value = "";
    itemQuantityInput.value = "";
    itemPriceInput.value = "";

    // Remove receipt
    receiptOutput.innerHTML = "";
    receiptOutput.style.display = "none";

    shopNameInput.focus();

});