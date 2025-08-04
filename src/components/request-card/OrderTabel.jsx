import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../App";

const OrderTabel = () => {
  const [orders, setOrders] = useState([]);
  const { setLoader, route } = useContext(AppContext);
  const params = useParams();
  useEffect(() => {
    setLoader(true);
    fetch(`${route}/order/${params.id}/${params.type}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.requestOrders);
      })
      .catch((err) =>  (err))
      .finally(() => setLoader(false));
  }, []);
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Paid</th>
            <th>total price</th>
            <th>request type </th>
            <th>order type </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.isPaid ? "yes" : "no"}</td>
              <td>{order.totalOrderPrice}</td>
              <td>{order.requestType}</td>
              <td>{order.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTabel;
