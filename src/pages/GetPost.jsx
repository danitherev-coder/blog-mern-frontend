import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import axios from "axios";
import Menu from "../components/Menu";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import DisqusComments from "../components/DisqusComments";
// import "quill/dist/quill.snow.css";
import "highlight.js/styles/base16/solarized-light.css";
import "./GetPost.css";
const GetPost = () => {
  const [post, setPost] = useState({});
  const postID = useParams().id;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8801/api/posts/${postID}`
        );
        setPost(data);
        // setImgAnterior(data.img);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [postID]);

  const handleDelete = async () => {
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
            `http://localhost:8801/api/posts/eliminar-post/${postID}`,
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
          navigate("/");
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
  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!post._id) {
    setTimeout(() => {
      navigate("/");
    }, 5000);
    return <>ESTE POST NO ESTA DISPONIBLE</>;
  }

  const authorID = JSON.parse(localStorage.getItem("user"));
  const idAutor = authorID?.usuario?._id;
  console.log(post.desc.includes("<pre>"), "tiene o no");
  return (
    <div className="single">
      <div className="content">
        <img
          loading="lazy"
          src={`https://res.cloudinary.com/dpvk1flpp/image/upload/v1672501225/${post?.img}`}
        />
        <div className="user">
          {
            <img
              loading="lazy"
              src={
                post.autor?.img
                  ? `https://res.cloudinary.com/dpvk1flpp/image/upload/v1672501225/${post.autor?.img}`
                  : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
            />
          }
          <div className="info">
            {post.autor ? (
              <span>{post.autor.nombre}</span>
            ) : (
              <span>Unknown</span>
            )}
            {/* // si no edite el post, que se muestre la fecha de creacion, sino que aparezca el mensaje de actualizo el:  */}
            {post.updatedAt !== post.createdAt ? (
              <p>Actualizado {moment(post.updatedAt).fromNow()}</p>
            ) : (
              <p>Publicado {moment(post.createdAt).fromNow()}</p>
            )}
          </div>
          {idAutor === post?.autor?._id && currentUser && (
            <div className="edit">
              {/* <Link to={`/write?edit=2`} state={post}> */}
              <Link to={`/write?edit=${post._id}`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.titulo}</h1>

        {/* <div style={{ overflow: "hidden;" }}>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.desc),
            }}
            // className="hljs"
          ></p>
        </div> */}
        <div style={{ overflow: "hidden" }}>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.desc),
            }}
            // className={post.desc.includes("<pre>") ? "code-highlight" : ""}
            // className="hljs"
          ></p>
        </div>
        <hr />
        <div id="disqus_thread"></div>
        <DisqusComments />
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default GetPost;
