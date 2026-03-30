<div className="appContainer">

  {/* HEADER */}
  <div className="header">
    <h3>🧾 Add Order</h3>
    <p>Create new order</p>
  </div>

  {/* RETAILER */}
  <div className="cardItem">
    <p>Select Retailer</p>
    <select
      value={retailerId}
      onChange={(e) => setRetailerId(e.target.value)}
    >
      <option value="">Select Retailer</option>
      {retailers.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  </div>

  {/* PAYMENT */}
  <div className="cardItem">
    <p>Payment Type</p>

    <select
      value={paymentType}
      onChange={(e) => setPaymentType(e.target.value)}
    >
      <option value="CASH">Cash</option>
      <option value="CREDIT">Credit</option>
    </select>

    {paymentType === "CREDIT" && (
      <input
        type="number"
        placeholder="Credit Days"
        value={creditDays}
        onChange={(e) => setCreditDays(e.target.value)}
      />
    )}
  </div>

  {/* ITEMS */}
  {items.map((item, i) => (
    <div key={i} className="cardItem">

      <p>Product</p>

      <select
        value={item.product_id}
        onChange={(e) =>
          handleChange(i, "product_id", e.target.value)
        }
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          value={item.qty}
          onChange={(e) =>
            handleChange(i, "qty", e.target.value)
          }
          placeholder="Qty"
        />

        <input value={item.price} readOnly />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          placeholder="Trade %"
          value={item.trade_discount}
          onChange={(e) =>
            handleChange(i, "trade_discount", e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Special %"
          value={item.special_discount}
          onChange={(e) =>
            handleChange(i, "special_discount", e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Cash %"
          value={item.cash_discount}
          onChange={(e) =>
            handleChange(i, "cash_discount", e.target.value)
          }
        />
      </div>

      <div className="highlightCard">
        <p>Final Qty: {item.final_qty}</p>
        <p>Rate: ₹{item.net_rate}</p>
        <h3>₹ {item.total}</h3>
      </div>

      <button onClick={() => removeItem(i)}>❌ Remove</button>
    </div>
  ))}

  {/* ADD BUTTON */}
  <button className="cardItem" onClick={addItem}>
    ➕ Add Product
  </button>

  {/* TOTAL */}
  <div className="highlightCard">
    <p>Total</p>
    <h2>₹ {total}</h2>
  </div>

  <button className="cardItem" onClick={handleSubmit}>
    Submit Order
  </button>

</div>