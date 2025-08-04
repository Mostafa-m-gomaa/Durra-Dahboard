import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";

const EMGSApproval = ({ setRefresh }) => {
  const [totalOrderPrice, setTotalOrderPrice] = useState("");

  const { route, setLoader } = useContext(AppContext);
  const params = useParams();

  const onNextStep = (e) => {
    e.preventDefault();
    setLoader(true);
    fetch(`${route}/progress/nextStep/${params.id}/${params.type}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalOrderPrice: +totalOrderPrice,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success(res.msg);
        setRefresh((prev) => prev + 1);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoader(false));
  };
  return (
    <div className="details">
      <h2>EMGS Approval</h2>
      <form onSubmit={onNextStep}>
        <label htmlFor="totalOrderPrice" style={{ paddingRight: "20px" }}>
          Total Order Price :
        </label>
        <input
          type="number"
          id="totalOrderPrice"
          required
          onChange={(e) => setTotalOrderPrice(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button type="submit" style={{ margin: "10px" }}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EMGSApproval;
