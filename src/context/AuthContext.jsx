import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import jwtDecode from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// EL authContext nos sirve para que un componente funcione en TODAS LAS PAGINAS, puede ser credenciales, o sea los datos de los usuarios para que puedan editar, crear, eliminar algo ps
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // con esto vamos a guardar los datos del usuario que se logea en localstorage
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  // const navigate = useNavigate()

  // aca vamos a poner una funcion para loguear al usuario
  const login = async (datosForm) => {
    const res = await axios.post(
      "http://localhost:8801/api/auth/login",
      datosForm
    );
    setCurrentUser(res.data);
    // console.log(res.data.usuario.nombre);
    console.log(res.data.usuario);
    Swal.fire({
      icon: "success",
      title: `Hola ${res.data.usuario.nombre}!`,
      text: "Bienvenido a tu perfil",
    });
  };

  console.log(currentUser?.token);

  // const tokenExpires = () => {
  //     // const user = JSON.parse(localStorage.getItem('user'))
  //     const token = currentUser?.token

  //     if (!token) {
  //         navigate('/login')
  //     } else {
  //         // si hay token, obtiene la fecha de expiracion del mismo
  //         const expires = jwtDecode(token).exp

  //         if (currentUser && expires < Date.now() / 1000) {
  //             Swal.fire({
  //                 icon: 'alert',
  //                 title: 'Oops...',
  //                 text: 'Tu sesión ha expirado, vuelve a iniciar sesión',
  //             })
  //             navigate('/login')
  //         }
  //     }
  // }

  // // useEffect(() => {
  // //     tokenExpires()
  // // }, [])

  const logout = async () => {
    await axios.post("http://localhost:8801/api/auth/logout");
    setCurrentUser(null);
    // borrar el localstorage
    // localStorage.removeItem('user')
    Swal.fire({
      icon: "success",
      title: `Hasta pronto, ${currentUser.usuario.nombre}`,
      text: "Esperamos verte pronto",
    });
  };

  // con esto cada vez que un usuario nuevo se logue, cambia para que salga solo sus datos, ṕara eso le pasamos el currentUser porque es el quien tiene la ultima copia
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    // para que esto funcione, debemos envolver todo el app con el AuthContext.Provider
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
