import React, { useState } from 'react';
import "../CSS/UploadImage.css"
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [imageUpload, SetImageUpload] = useState(null);
    const [caption, setCaption] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        SetImageUpload(file);
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            toast.error("File size exceeds 10MB limit")
            return;
        }
        console.log(file)
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const submitImage = async (e) => {
        e.preventDefault();
        const URL = `${import.meta.env.VITE_API_POSTS}/save/social-media/sujalshrestha519@gmail.com`
        try {
            const formData = new FormData();
            
            const postData = {
                date: new Date().toISOString().split('T')[0],
                caption: caption,
                likeCount: 1,
            };
            formData.append("postData", new Blob([JSON.stringify(postData)], { type: "application/json" }));
            formData.append("media", imageUpload);
    
            const response = await axios.post(URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(response.data);
            navigate("/profile");
            setImage(null);
            setCaption("");
    
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(error.response.data);
        }
    }

    return (
        <div>
            <form onSubmit={submitImage}>
                <h1 style={{ textAlign: "center", margin: 0 }}>Upload Your Image</h1>
                <div className="profile-container" style={{ width: "auto", marginTop: "10px" }}>
                    <div className='cover-photos'>

                        <label htmlFor="uploadImage" className='custom-file-upload'>
                            <input type="file" id="uploadImage" onChange={handleImageChange} />
                            {image ? (
                                <img src={image} alt="Preview" className="preview-image" />
                            ) : (
                                <div className="plus-button">+</div>
                            )}
                        </label>
                    </div>



                    <div className="post-box">
                        <input type="text" value={caption} placeholder="Say something..." className="input-box" onChange={(e)=>{setCaption(e.target.value)}} />
                    </div>

                    <div className="button-group">

                        <button type='submit' className="upload-pic-btn">Upload Pic</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UploadImage
