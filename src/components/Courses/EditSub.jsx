import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import "./article.css";

const EditSub = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { route, setLoader } = useContext(AppContext);
  
  // Form states
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



 

  // Fetch category and subcategory data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        
        // Fetch categories
        const categoriesRes = await fetch(`${route}/categories`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        
        // Fetch subcategory details
        const subCategoryRes = await fetch(`${route}/subCategories/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        
        if (!subCategoryRes.ok) throw new Error('Failed to fetch subcategory');
        const subCategoryData = await subCategoryRes.json();

        if (categoriesData.data) {
          setCategories(categoriesData.data);
        }

        if (subCategoryData.data) {
          const subCat = subCategoryData.data;
          setNameAr(subCat.name_ar || '');
          setNameEn(subCat.name_en || '');
          setDescAr(subCat.description_ar || '');
          setDescEn(subCat.description_en || '');
          setCategoryId(subCat.category?._id || '');
          setPreviewImage(subCat.imageCover || '');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoader(false);
        setIsLoading(false);
      }
    };

    fetchData();
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
    
    if (!nameAr.trim() || !nameEn.trim() || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name_ar", nameAr.trim());
    formData.append("name_en", nameEn.trim());
    formData.append("category", categoryId);
    
    if (descAr) formData.append("description_ar", descAr.trim());
    if (descEn) formData.append("description_en", descEn.trim());
    if (image) formData.append("imageCover", image);

    try {
      setLoader(true);
      const response = await fetch(`${route}/subCategories/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.data) {
        toast.success("تم تحديث القسم الفرعي بنجاح");
        navigate("/SubCategories"); // Update with your actual route
      } else {
        const errorMessage = result.errors?.[0]?.msg || "Failed to update subcategory";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث القسم الفرعي");
    } finally {
      setLoader(false);
    }
  };
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="articles">
      <ContentTop headTitle="تعديل القسم الفرعي" />
      <ToastContainer position="top-center" autoClose={3000} rtl={true} />
      
      <div className="container">
        <div className="add">
          <h1>تعديل القسم الفرعي</h1>
          <form onSubmit={handleSubmit}>
            <label>
              الاسم بالعربية *
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
                placeholder="أدخل الاسم بالعربية"
              />
            </label>
            
            <label>
              الاسم بالإنجليزية *
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                placeholder="Enter name in English"
              />
            </label>
            
            <label>
              الصورة
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
            
            <label>
              القسم الرئيسي *
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">اختر القسم الرئيسي</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name_ar} - {category.name_en}
                  </option>
                ))}
              </select>
            </label>
            
            <label>
              الوصف بالعربية
              <textarea
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="أدخل الوصف بالعربية"
                rows="3"
              />
            </label>
            
            <label>
              Description in English
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Enter description in English"
                rows="3"
              />
            </label>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                حفظ التغييرات
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSub;
