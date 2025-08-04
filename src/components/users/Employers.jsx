import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import ContentTop from "../ContentTop/ContentTop";

const Employers = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const response = await fetch(`${route}/users`, {
        method: "POST",
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
          passwordConfirm: passwordConfirmation,
          role: "employee",
        }),
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setLoader(false);
       (response);
      if (response.data) {
        toast.success("Added Successfully");
        setRefresh(!refresh);
      } else if (response.errors) {
        toast.error(response.errors[0].msg);
      } else {
         (response);
        toast.error("هناك خطأ");
      }
    } catch (error) {}
  };

  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/users/${artId}`, {
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
    fetch(`${route}/users/employees`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setUsers(data.data);
        }
      });
  }, [refresh]);
  return (
    <div className="articles">
      <ContentTop headTitle="Employers" />

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
        <div className="add">
          <h1>Add Employer</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Name
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Email
              <input onChange={(e) => setEmail(e.target.value)} type="text" />
            </label>
            <label htmlFor="">
              Password
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </label>
            <label htmlFor="">
              confirm Password
              <input
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                type="password"
              />
            </label>

            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>Employers</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">user name : {user.username}</div>
                  <div className="name">{user.email}</div>
                  <div className="name">role :{user.role}</div>
                  {user.role === "user" ? (
                    <div> request type : {user.type} </div>
                  ) : null}
                  <button onClick={() => deleteButton(user.id)}>Delete</button>
                  <Link
                    to={`/employer-requests/${user.id}}`}
                    style={{ backgroundColor: "green" }}
                  >
                    Details
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employers;
