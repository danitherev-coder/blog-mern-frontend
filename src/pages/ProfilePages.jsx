// import axios from 'axios'
// import React, { useContext, useEffect } from 'react'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'

// const ProfilePages = () => {
//   const { currentUser } = useContext(AuthContext)
//   const user = JSON.parse(localStorage.getItem('user'))
//   const id = user?.usuario?._id
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (!currentUser || (currentUser.usuario && currentUser?.usuario?._id !== id)) {
//       navigate('/')
//     }
//   }, [currentUser, id, navigate])

//   return (
//     <>
//       <div>ProfilePages</div>
//       <form>
//         <div>
//           <label htmlFor="name">Name</label>
//           <input type="text" name="name" id="name" defaultValue={currentUser?.usuario?.nombre} />
//           <label htmlFor="name">Email</label>
//           <input type="text" name="email" id="email" defaultValue={currentUser?.usuario?.email} />
//         </div>
//         <div className="buttons">
//           <button>Save as a draft</button>
//           <button onClick={handleClick}>Publish</button>
//         </div>
//       </form>
//     </>

//   )
// }

// export default ProfilePages

import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const ProfilePages = () => {
  const { currentUser } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.usuario?._id;
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (
      !currentUser ||
      (currentUser.usuario && currentUser?.usuario?._id !== id)
    ) {
      navigate("/");
    }
  }, [currentUser, id, navigate]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const res = await axios.post(
        "http://localhost:8801/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-token": token,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.response.data.msg,
      });
    }
  };

  const [perfil, setPerfil] = useState({
    nombre: currentUser?.usuario?.nombre || "",
    email: currentUser?.usuario?.email || "",
  });

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // Send the image file to the server
      const imgUrl = await upload();
      // console.log(imgUrl)
      // Update the user's profile information
      const res = await axios.put(
        `http://localhost:8801/api/users/actualizar-user/${id}`,
        {
          ...perfil,
          img: file ? imgUrl?.url : currentUser?.usuario?.img || "",
        }
      );
      // Update the currentUser state and the localStorage item with the latest user information
      // setCurrentUser(res.data)
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data,
          token: user.token,
        })
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Profile updated!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.response.data.msg,
      });
    }
  };

  return (
    <>
      <div>ProfilePages</div>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="nombre"
            id="name"
            value={perfil.nombre}
            onChange={handleChange}
          />
          <label htmlFor="name">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={perfil.email}
            onChange={handleChange}
          />
          <label htmlFor="file">Subir IMG</label>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="buttons">
          <button onClick={handleClick}>Publish</button>
        </div>
      </form>
    </>
  );
};

export default ProfilePages;
