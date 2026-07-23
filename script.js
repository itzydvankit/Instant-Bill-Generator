// ====== SELECT ELEMENTS ======
const addItemBtn = document.getElementById('addItemBtn');
const resetBtn = document.getElementById('resetBtn');
const generateReceiptBtn = document.getElementById('generateReceiptBtn');
const receiptTable = document.querySelector('#receiptTable tbody');
const grandTotalDisplay = document.getElementById('grandTotal');
const receiptOutput = document.getElementById('receiptOutput');

// ====== VARIABLES ======
let items = [];
let grandTotal = 0;

// ====== ADD ITEM BUTTON ======
addItemBtn.addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const quantity = parseInt(document.getElementById('itemQuantity').value);
  const price = parseFloat(document.getElementById('itemPrice').value);

  if (!name || quantity <= 0 || price <= 0) {
    alert('Please enter valid item details.');
    return;
  }

  const total = quantity * price;
  items.push({ name, quantity, price, total });

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${name}</td>
    <td>${quantity}</td>
    <td>₹${price.toFixed(2)}</td>
    <td>₹${total.toFixed(2)}</td>
  `;
  receiptTable.appendChild(row);

  grandTotal += total;
  grandTotalDisplay.textContent = grandTotal.toFixed(2);

  // Clear item inputs
  document.getElementById('itemName').value = '';
  document.getElementById('itemQuantity').value = '';
  document.getElementById('itemPrice').value = '';
});

// ====== RESET BUTTON ======
resetBtn.addEventListener('click', () => {
  document.getElementById('itemName').value = '';
  document.getElementById('itemQuantity').value = '';
  document.getElementById('itemPrice').value = '';
});

// ====== GENERATE RECEIPT BUTTON ======
generateReceiptBtn.addEventListener('click', () => {
  if (items.length === 0) {
    alert('Please add at least one item.');
    return;
  }

  const shopName = document.getElementById('shopName').value.trim().toUpperCase();
  const shopAddress = document.getElementById('shopAddress').value.trim().toUpperCase();

  if (!shopName || !shopAddress) {
    alert('Please enter your shop name and address.');
    return;
  }

  // Create receipt layout
  let receiptHTML = `
    <div style="text-align:center;">
      <h2>${shopName}</h2>
      <p>${shopAddress}</p>
      <hr>
    </div>

    <table style="width:100%; border-collapse:collapse; text-align:center;">
      <thead>
        <tr style="border-bottom:1px solid #000;">
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

    <div style="text-align:right; margin-top:10px;">
      <strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong>
    </div>

    <p style="text-align:center; margin-top:10px;">Thank you for shopping with us!</p>

    <div style="text-align:center; margin-top:15px;">
      <button id="printBtn" style="margin-right:10px;">🖨️ Print Receipt</button>
      <button id="downloadBtn" style="margin-right:10px;">⬇️ Download PDF</button>
    </div>
  `;

  receiptOutput.innerHTML = receiptHTML;
  receiptOutput.style.display = 'block';

  // === PRINT BUTTON ===
  document.getElementById('printBtn').addEventListener('click', () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Receipt</title></head><body>');
    printWindow.document.write(receiptOutput.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  });

  // === DOWNLOAD PDF BUTTON ===
  document.getElementById('downloadBtn').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    // Convert receiptOutput to image first (using html2canvas)
    const canvas = await html2canvas(receiptOutput);
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 550;
    const pageHeight = 800;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 25, 25, imgWidth, imgHeight);
    doc.save(`${shopName}_Receipt.pdf`);
  });
});
