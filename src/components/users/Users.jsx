import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Users = () => {
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
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState("");


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const formData = new FormData();

    formData.append("username", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("passwordConfirm", passwordConfirmation);
    formData.append("role", role);
    formData.append("phone", phone);
    formData.append("profileImg", image);

    try {
      const response = await fetch(`${route}/users`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
         
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
    fetch(`${route}/users`, {
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
        <div className="add">
          <h1>Add User</h1>
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
              Phone
              <input onChange={(e) => setPhone(e.target.value)} type="text" />
            </label>
            <label htmlFor="">
              Password
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              confirm Password
              <input
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Role
              <select name="" id="" onChange={(e) => setRole(e.target.value)}>
                <option value="">select role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="instructor">instructor</option>
              </select>
            </label>
            <label htmlFor="">
              profile image
              <input
                 onChange={handleImageChange}
                type="file"
              />
            </label>

            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>Users</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">user name : {user.username}</div>
                  {user.profileImg ?<img src={user.profileImg} /> :null}
                  <div className="name">{user.email}</div>
                  <div className="name">role :{user.role}</div>
                
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

export default Users;
