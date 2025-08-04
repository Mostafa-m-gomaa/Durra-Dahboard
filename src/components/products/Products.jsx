import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../Courses/article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import { Link } from "react-router-dom";

const Products = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const {route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [categories,setCategories] = useState([]);
  const [userName, setUsername] = useState("");
  const [catId, setCatId] = useState("");
 
  const [image, setImage] = useState(null);

  const [price, setPrice] = useState("");
  const [priceAfterDiscount, setPriceAfterDiscount] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [highlightsAr, setHighlightsAr] = useState("");
    const [highlightsEn, setHighlightsEn] = useState("");

  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

 

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
    const highArArr = highlightsAr.split(",");
    const highEnArr = highlightsEn.split(",");
   
    const formData = new FormData();

    formData.append("title_ar", nameAr);
    formData.append("title_en", nameEn);
    formData.append("subCategory", catId);
    formData.append("description_ar", descAr);
    formData.append("description_en", descEn);
    formData.append("imageCover", image);
    formData.append("active", true);
    formData.append("price", price);
    formData.append("priceAfterDiscount", priceAfterDiscount);
    // formData.append("highlights_en", highEnArr);
    // formData.append("highlights_ar", highArArr);
    images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    highArArr.forEach((image, index) => {
        formData.append(`highlights_ar`, image);
      });
    highEnArr.forEach((image, index) => {
        formData.append(`highlights_en`, image);
      });
 
  
    setLoader(true);
    try {
      const response = await fetch(`${route}/products`, {
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
      const response = await fetch(`${route}/products/${artId}`, {
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
    fetch(`${route}/subCategories`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCategories(data.data);
        }
      });
  }, [refresh]);
  useEffect(() => {
    fetch(`${route}/products`, {
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
          <h1>Add Product</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Name Ar
              <input
                onChange={(e) => setNameAr(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Name En
              <input
                onChange={(e) => setNameEn(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Image
              <input
                 onChange={handleImageChange}
                type="file"
              />
            </label>
            <label htmlFor="">
              Sub Category
              <select name="" id="" onChange={(e)=>setCatId(e.target.value)}>
                <option value="">select Sub Category</option>
                {categories.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.name_en}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              description Ar
              <input
                onChange={(e) => setDescAr(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              description En
              <input
                onChange={(e) => setDescEn(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Highlights En
              <input
                onChange={(e) => setHighlightsEn(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
            Highlights Ar
              <input
                onChange={(e) => setHighlightsAr(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
          price
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
            price after discount
              <input
                onChange={(e) => setPriceAfterDiscount(e.target.value)}
                type="text"
              />
            </label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
         
  
         
            
           
       

            <button type="submit">add</button>
          </form>
          <div>
        <h3>Selected Images:</h3>
        <ul>
          {images.map((image, index) => (
            <li key={index}>{image.name}</li>
          ))}
        </ul>
      </div>
        </div>
        <div className="all-art">
          <h1>ٍProducts</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">title: {user.title_ar} - {user.title_en}</div>
                  <div className="name">price after disc :  {user.priceAfterDiscount} $ </div>
                  <div className="name">price :  {user.price} $</div>
                  {/* <div className="name">Sub Categ:  {user.subCategory.name_en || "f"}</div> */}
                  <img src={user.imageCover} alt="" />
                  <button onClick={() => deleteButton(user._id)}>Delete</button>
                  <Link onClick={()=>localStorage.setItem("product",JSON.stringify(user))} to={`/product/${user.id}`}>Edit</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
