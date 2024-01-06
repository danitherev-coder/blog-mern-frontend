import React, { startTransition, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./MyPosts.scss";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import moment from "moment";
import "moment/locale/es";

const MyPosts = () => {
  moment.updateLocale("es", {
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [tokenChecked, setTokenChecked] = useState(false);
  const navigate = useNavigate();

  const tokenExpires = () => {
    const token = currentUser?.token;
    if (!token) {
      navigate("/login");
    } else {
      const expires = jwtDecode(token).exp;
      if (currentUser && expires < Date.now() / 1000) {
        startTransition(() => {
          Swal.fire({
            icon: "alert",
            title: "Oops...",
            text: "Tu sesión ha expirado, vuelve a iniciar sesión",
            html: `<a href="/login">Iniciar sesión</a>`,
          });
          // navigate("/login");
          localStorage.removeItem("user");
        });
      }
    }
  };
  useEffect(() => {
    if (!tokenChecked) {
      tokenExpires();
      setTokenChecked(true);
    }
  }, [tokenChecked, tokenExpires, navigate]);

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
    }
  }, [currentUser]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerPost = async () => {
      const res = await axios.get(
        "http://localhost:8801/api/posts/obtenerPostxCreador",
        {
          headers: {
            "x-token": currentUser.token,
          },
        }
      );
      setData(res.data);
    };
    obtenerPost();
  }, []);

  console.log(data, "que data hay");

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás recuperar este elemento una vez eliminado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      }).then(async (result) => {
        if (result.value) {
          await axios.delete(
            `http://localhost:8801/api/posts/eliminar-post/${id}`,
            {
              headers: {
                "x-token": currentUser.token,
              },
            }
          );
          Swal.fire({
            icon: "success",
            title: "Post eliminado",
            text: "Se ha eliminado el post con éxito",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      });
    } catch (error) {
      // console.log(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal",
      });
    }
  };

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Blogs</h1>
          <Link to="/write">
            <button>Add new Post</button>
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Titulo</th>
              <th>Fecha de creacion</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data?.map((post) => (
                <tr key={post?._id}>
                  <td>
                    <img
                      className="image"
                      src={`https://res.cloudinary.com/dpvk1flpp/image/upload/v1687656841/${post?.img}`}
                      alt="upload"
                      loading="lazy"
                    />
                  </td>
                  <td>{post?.titulo}</td>
                  {/* <td>{post?.createdAt}</td> */}
                  <td>
                    {moment(post?.createdAt).format("DD [de] MMMM [del] YYYY")}
                  </td>
                  <td>
                    <img
                      className="delete"
                      src="/img/delete.webp"
                      alt="boton de eliminar"
                      title="Eliminar Gig"
                      loading="lazy"
                      onClick={() => handleDelete(post?._id)}
                      style={{ marginLeft: "10px", width: "20px" }}
                    />
                    <Link
                      to={`/post/${post?._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/img/ojo.webp"
                        alt="boton de ver"
                        loading="lazy"
                        title="Ver Gig"
                        className="delete"
                        style={{ marginLeft: "10px" }}
                      />
                    </Link>
                    <Link to={`/write?edit=${post?._id}`} state={post}>
                      <img
                        src="/img/edit.png"
                        alt="boton de editar"
                        title="Editar Gig"
                        loading="lazy"
                        style={{ marginLeft: "10px", width: "20px" }}
                      />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPosts;
