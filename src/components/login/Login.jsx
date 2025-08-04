import React, { useContext, useState } from "react";
import "./login.css";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Login = () => {
  const { route, setLogin, setLoader } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const history = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoader(true);

    try {
      const response = await fetch(`${route}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
       (response);
      setLoader(false);
      if (response.token) {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("name", response.data.username);
        sessionStorage.setItem("id", response.data.id);
        sessionStorage.setItem("role", response.data.role);

        setLogin(true);
        history("/categories");
      } else {
        toast.error("هناك خطأ بكلمة السر أو الأيميل حاول مرة أخري");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login">
      <ContentTop headTitle="Login" />

      <div className="container">
        <form className="form" onSubmit={handleLogin}>
          Login{" "}
          <input
            value={email}
            onChange={handleEmail}
            type="email"
            className="input"
            placeholder="Email"
          />
          <input
            value={pass}
            onChange={handlePass}
            type="password"
            className="input"
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
