import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";

const OfferLetterStep = ({ setRefresh }) => {
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const { route, setLoader } = useContext(AppContext);
  const params = useParams();
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("offerLetter", offerLetterFile);
    setLoader(true);
    fetch(`${route}/progress/uploadOfferLetter/${params.id}/${params.type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoader(false));
  };

  const onNextStep = (e) => {
    e.preventDefault();
    setLoader(true);
    fetch(`${route}/progress/nextStep/${params.id}/${params.type}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   totalOrderPrice: +totalOrderPrice,
      // }),
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
      <h2>Send Offer letter step</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="offerLetterFile" style={{ paddingRight: "20px" }}>
          Offer Letter (pdf) :
        </label>
        <input
          type="file"
          id="offerLetterFile"
          accept="application/pdf"
          required
          onChange={(e) => setOfferLetterFile(e.target.files[0])}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button style={{ margin: "10px" }}>Upload</button>
        </div>
      </form>
      <form onSubmit={onNextStep}>
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

export default OfferLetterStep;
