import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";

const ReciveOfferLetterStep = ({ requestDetails, setRefresh }) => {
  const { route, setLoader } = useContext(AppContext);
  const { signedOfferLetter } = requestDetails;
  const params = useParams();

  const downloadFile = () => {
    window.open(signedOfferLetter, "_blank");
  };
   (requestDetails);
  const onNextStep = (e) => {
    e.preventDefault();
    setLoader(true);
    fetch(`${route}/progress/nextStep/${params.id}/${params.type}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
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
      <h2>Receive Offer letter step</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          disabled={signedOfferLetter == null}
          onClick={downloadFile}
          type="button"
          style={{ margin: "10px" }}
        >
          Download uploaded file
        </button>
      </div>
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

export default ReciveOfferLetterStep;
