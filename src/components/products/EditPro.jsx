import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../Courses/article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProducts = () => {
    const history =useNavigate()
    const param=useParams().id
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

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const highArArr = highlightsAr.split(",");
    const highEnArr = highlightsEn.split(",");
   
    const formData = new FormData();
if(nameAr){
formData.append("title_ar", nameAr); } 
if(nameEn){
formData.append("title_en", nameEn); }
if(catId){
formData.append("subCategory", catId); }
if(descAr){
formData.append("description_ar", descAr); }
if(descEn){
formData.append("description_en", descEn); }
if(image){
formData.append("imageCover", image); }
if(price){
formData.append("price", price); }
if(priceAfterDiscount){
formData.append("priceAfterDiscount", priceAfterDiscount); }

   if(images.length>0){

       images.forEach((image, index) => {
           formData.append(`images`, image);
         });
   } 

   if(highlightsAr.length> 0 ){
       highArArr.forEach((image, index) => {
           formData.append(`highlights_ar`, image);
         });
    }
    if(highlightsEn.length> 0 ){
         highEnArr.forEach((image, index) => {

                formData.append(`highlights_en`, image);
                });     
    }


  
    setLoader(true);
    try {
      const response = await fetch(`${route}/products/${param}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          
        },
      }).then((res) => res.json());
      setLoader(false);
    
      if (response.data) {
        toast.success("Edited Successfully");
        setRefresh(!refresh);
      } else if (response.errors) {
        toast.error(response.errors[0].msg);
      } else {
        toast.error("هناك خطأ");
      }
    } catch (error) {}
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

  useEffect(()=>{
    const product=JSON.parse(localStorage.getItem("product"))
     
    if(product){
      setNameAr(product.title_ar)
      setNameEn(product.title_en)
      setCatId(product.subCategory._id)
      setDescAr(product.description_ar)
      setDescEn(product.description_en)
      setHighlightsAr(Array.isArray(product.highlights_ar) ? product.highlights_ar.join(",") : product.highlights_ar || "")
      setHighlightsEn(Array.isArray(product.highlights_en) ? product.highlights_en.join(",") : product.highlights_en || "")
      setPrice(product.price)
      setPriceAfterDiscount(product.priceAfterDiscount)
      setRefresh(!refresh)
    }
  },[])


  return (
    <div className="articles">
      <ContentTop headTitle="Users" />


      <div className="container">
        <div className="add">
          <h1>Edit Product</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Name Ar
              <input
                onChange={(e) => setNameAr(e.target.value)}
                type="text"
                value={nameAr}
              />
            </label>
            <label htmlFor="">
              Name En
              <input
                onChange={(e) => setNameEn(e.target.value)}
                type="text"
                value={nameEn}
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
              <select name="" id="" onChange={(e)=>setCatId(e.target.value)} value={catId}>
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
                value={descAr}
              />
            </label>
            <label htmlFor="">
              description En
              <input
                onChange={(e) => setDescEn(e.target.value)}
                type="text"
                value={descEn}
              />
            </label>
            <label htmlFor="">
              Highlights En
              <input
                onChange={(e) => setHighlightsEn(e.target.value)}
                type="text"
                value={highlightsEn}
              />
            </label>
            <label htmlFor="">
            Highlights Ar
              <input
                onChange={(e) => setHighlightsAr(e.target.value)}
                type="text"
                value={highlightsAr}
              />
            </label>
            <label htmlFor="">
          price
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="text"
                value={price}
              />
            </label>
            <label htmlFor="">
            price after discount
              <input
                onChange={(e) => setPriceAfterDiscount(e.target.value)}
                type="text"
                value={priceAfterDiscount}
              />
            </label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
         
  
         
            
           
       

            <button type="submit">Edit</button>
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
  
      </div>
    </div>
  );
};

export default EditProducts;
