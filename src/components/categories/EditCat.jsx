import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import "./article.css";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { route, setLoader } = useContext(AppContext);
  
  // Form states
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoader(true);
        const response = await fetch(`${route}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        
        const { data } = await response.json();
        
        if (data) {
          setNameAr(data.name_ar || "");
          setNameEn(data.name_en || "");
          setPreviewImage(data.imageCover || "");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category data");
      } finally {
        setLoader(false);
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, route, setLoader]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setImage(null);
      setPreviewImage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!nameAr.trim() || !nameEn.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name_ar", nameAr.trim());
    formData.append("name_en", nameEn.trim());
    
    // Only append image if a new one is selected
    if (image) {
      formData.append("imageCover", image);
    }

    try {
      setLoader(true);
      const response = await fetch(`${route}/categories/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        toast.success("تم تحديث القسم بنجاح");
        navigate("/categories");
      } else {
        const errorMessage = result.errors?.[0]?.msg || "Failed to update category";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث القسم");
    } finally {
      setLoader(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="articles">
      <ContentTop headTitle="تعديل القسم" />
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="container">
        <div className="add">
          <h1>تعديل القسم</h1>
          <form onSubmit={handleSubmit}>
            <label>
              الاسم بالعربية
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
                placeholder="أدخل الاسم بالعربية"
              />
            </label>
            
            <label>
              الاسم بالإنجليزية
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                placeholder="Enter name in English"
              />
            </label>
            
            <label>
              صورة القسم
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px',
                      marginTop: '10px',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
              )}
            </label>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                حفظ التغييرات
              </button>
              {/* <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate("/categories")}
              >
                إلغاء
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCat;
  
