import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Special = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
 
  const [image, setImage] = useState(null);




  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
  };


  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/recommends/${artId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
       (response);
      if (response.ok) {
        toast.success("Deleted Successfully");
        setRefresh(!refresh);
      } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Only try to parse JSON if the response has content
      const data = response.status !== 204 ? await response.json() : null;

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetch(`${route}/recommends`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
  
        if (data.data) {
          setUsers(data.data);
           (data.data);
        }
      });
  }, [refresh]);
  return (
    <div className="articles">
      <ContentTop headTitle="Users" />

      {showConfirm ? (
        <div className="confirm">
          <div>are yoy sure ?</div>
          <div className="btns">
            <button onClick={deleteArt} className="yes">
              Yes
            </button>
            <button onClick={() => setShowConfirm(false)} className="no">
              No
            </button>
          </div>
        </div>
      ) : null}
      <div className="container">
   
        <div className="all-art">
          <h1>Special Orders</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name"> user name : {user.uername}</div>
                  <div className="name"> phone : {user.phone}</div>
                  <div className="name"> address : {user.address}</div>
                  <div className="name"> whatsapp  :{user.whatsapp}</div>
                  <div className="name"> type : {user.type}</div>
                  <div className="name"> code : {user.productCode}</div>
                
                  <button onClick={() => deleteButton(user._id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Special;
