import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Sidebar from "./layout/Sidebar/Sidebar";
import { createContext, useEffect, useState } from "react";
import Login from "./components/login/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Users from "./components/users/Users";
import Categories from "./components/categories/Categories";
import Courses from "./components/Courses/Courses";
import Products from "./components/products/Products";
import EditProducts from "./components/products/EditPro";
import EditSub from "./components/Courses/EditSub";
import Special from "./components/categories/Special";
import Orders from "./components/categories/Orders";
import EditCat from "./components/categories/EditCat";

export const AppContext = createContext();

function App() {
  const [headTitle, setHeadTitle] = useState("تسجيل الدخول");
  const [login, setLogin] = useState(false);

  const [route, setRoute] = useState("https://store.softwave-dev.com/api/v1");
  const [employee, setEmployee] = useState(false);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLogin(sessionStorage.getItem("login"));
    if (sessionStorage.getItem("role") === "employee") {
      setEmployee(true);
    } else {
      setEmployee(false);
    }
  }, [login]);
  return (
    <AppContext.Provider
      value={{
        headTitle,
        setHeadTitle,
        route,
        login,
        setLogin,
        setLoader,
        employee,
        setEmployee,
      }}
    >
      <>
        <div className="app">
          <ToastContainer />
          {loader ? (
            <div className="loader-cont">
              <div className="banter-loader">
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
              </div>
            </div>
          ) : null}
          <Sidebar />
          <div className="the-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/users" element={<Users />} />
              <Route path="/categories" element={<Categories/>} />
              <Route path="/SubCategories" element={<Courses/>} />
              <Route path="/Products" element={<Products/>} />
              <Route path="/product/:id" element={<EditProducts/>} />
              <Route path="/sub/:id" element={<EditSub/>} />
              <Route path="/Special Orders" element={<Special/>} />
              <Route path="/Orders" element={<Orders/>} />
              <Route path="/cat/:id" element={<EditCat/>} />
            </Routes>
          </div>
        </div>
      </>
    </AppContext.Provider>
  );
}

export default App;
