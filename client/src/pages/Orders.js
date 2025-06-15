import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const ORDER_STATUSES = {
  1: "Gaida",
  2: "Apstiprināts"
}

const OFFER_TYPES = {
  1: "Spēļu valūta",
  2: "Konti",
};

const Orders = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/getOrders/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Kļūda", error));
  }, [userId]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const fetchOrders = async () => {
    const response = await fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/${userId}`);
    const data = await response.json();
    setOrders(data.orders || []);
  };

  const approveOrder = async (id) => {
    try {
      const response = await fetch(`https://rentbazaar-app.azurewebsites.net/api/orders/updateOrder/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Error updating");

      window.location.reload();
    } catch (error) {
      console.error("Error", error);
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Mani pasūtījumi</h2>

      <div className="row gy-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="col-12">
              <div
                className="card shadow-lg rounded border border-secondary"
                style={{ backgroundColor: "#fafafa", padding: "1.5rem" }}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                  <div>
                    <h5 className="card-title mb-2">Pasūtījuma numurs #{order.id}</h5>
                    <p className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          order.status === 2
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {ORDER_STATUSES[order.status] || "Unknown status"}
                      </span>
                    </p>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <strong>Datums:</strong>{" "}
                      {format(new Date(order.createdAt), "dd.MM.yyyy")}
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm mt-3"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrderId === order.id
                        ? "Aizvērt detaļas"
                        : "Parādīt detaļas"}
                    </button>
                  </div>

                  <div className="d-flex flex-wrap gap-3">
                    {order.status !== 2 && (
                      <button
                        className="btn btn-success"
                        onClick={() => approveOrder(order.id)}
                        title="Apstiprināt pasūtījumu"
                        style={{ fontSize: "1.1rem", padding: "0.5rem 1.2rem" }}
                      >
                        Apstiprināt
                      </button>
                    )}
                    <Link
                      to={`/review/${order.offer.id}`}
                      className="btn btn-primary"
                      title="Atsauksmes par produktu"
                      style={{ fontSize: "1.1rem", padding: "0.5rem 1.2rem" }}
                    >
                      Atsauksmes
                    </Link>
                  </div>
                </div>

                {expandedOrderId === order.id && order.offer && (
                  <div className="card-footer bg-white border-top rounded-bottom mt-3">
                    <h6 className="mb-3">{order.offer.name}</h6>
                    <div className="row">
                      <div className="col-md-6 mb-2 mb-md-0">
                        <p className="mb-1">
                          <strong>Kategorija:</strong> {OFFER_TYPES[order.offer.type]}
                        </p>
                        <p className="mb-1">
                          <strong>Cena par produktu:</strong> {order.offer.price} €
                        </p>
                        <p className="mb-1">
                          <strong>Daudzums:</strong> {order.quantity}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Cena kopā:</strong>{" "}
                          {(Number(order.offer.price) * Number(order.quantity)).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted fs-5 mt-5">Vēl nav pasūtījumu</p>
        )}
      </div>
    </div>


  );
};

export default Orders;