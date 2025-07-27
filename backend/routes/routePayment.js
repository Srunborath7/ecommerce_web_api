const payment = require("express").Router();
const db = require("../connection/connection");
const checkUser = require("../middleware/auth");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// Helper: Generate invoice PDF and return a Promise
function generateInvoice(order, items, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Customer ID: ${order.user_id}`);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    doc.text("Items:");
    items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.product_name} - Qty: ${item.quantity} x $${item.unit_price.toFixed(2)}`
      );
    });

    const total = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    doc.moveDown();
    doc.text(`Total: $${total.toFixed(2)}`);

    doc.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
}

// POST: Complete PayPal payment and generate invoice
payment.post("/payments/:orderId/success", checkUser, (req, res) => {
  const orderId = req.params.orderId;
  const { paypalInfo } = req.body;

  const orderSQL = `SELECT * FROM orders WHERE id = ?`;
  const itemsSQL = `
    SELECT oi.product_id, oi.quantity, oi.unit_price, p.name AS product_name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `;

  // Step 1: Get order info
  db.query(orderSQL, [orderId], (err, orderResult) => {
    if (err || orderResult.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult[0];

    // Step 2: Get order items
    db.query(itemsSQL, [orderId], (err, items) => {
      if (err) return res.status(500).json({ message: "Error fetching items" });

      // Step 3: Update order status to 'paid'
      const updateOrderSQL = `UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      db.query(updateOrderSQL, [orderId], (err) => {
        if (err) {
          console.error("Failed to update order status:", err);
          return res.status(500).json({ message: "Failed to update order status" });
        }

        // Step 4: Insert payment record
        const { id, amount, currency_code } =
          paypalInfo.purchase_units[0].payments.captures[0];

        const insertPaymentSQL = `
          INSERT INTO payments (order_id, method, transaction_id, amount, currency)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(
          insertPaymentSQL,
          [orderId, "PayPal", id, amount.value, currency_code],
          async (err) => {
            if (err) {
              console.error("Insert payment error:", err);
              return res.status(500).json({ message: "Failed to record payment" });
            }

            // Step 5: Update inventory for each item (OUT)
            const inventorySQL = `
              INSERT INTO inventory (product_id, quantity, action, description, created_by)
              VALUES (?, ?, 'OUT', 'Order payment', ?)
            `;

            items.forEach((item) => {
              db.query(inventorySQL, [item.product_id, item.quantity, order.user_id], (err) => {
                if (err) {
                  console.error("Inventory update error:", err);
                  // Continue processing others even if one fails
                }
              });
            });

            // Step 6: Generate invoice PDF
            const invoiceDir = path.join(__dirname, "../invoices");
            if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

            const invoicePath = path.join(invoiceDir, `invoice_order_${orderId}.pdf`);

            try {
              await generateInvoice(order, items, invoicePath);
              res.status(200).json({
                message: "Payment successful, invoice generated",
                invoice: `/invoices/invoice_order_${orderId}.pdf`,
              });
            } catch (err) {
              console.error("Invoice generation error:", err);
              res.status(500).json({ message: "Failed to generate invoice" });
            }
          }
        );
      });
    });
  });
});

module.exports = payment;
