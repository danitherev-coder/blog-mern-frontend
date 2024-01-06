import hljs from "highlight.js";
// import "highlight.js/styles/base16/monokai.css";
import "highlight.js/styles/base16/classic-dark.css";
// import "highlight.js/styles/base16/solarized-light.css";
import React, { startTransition, useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ "code-block": true }, { blockquote: true }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "script",
  "direction",
  "size",
  "color",
  "background",
  "align",
  "link",
  "image",
  "video",
];

const CreatePost = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [publishing, setPublishing] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

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
          });
          navigate("/login");
          localStorage.removeItem("user");
        });
      }
    }
  };

  // esto me servira para que el tokenExpires solo se ejecute una vez cuando se renderize el componente, ya que esto hara que se verifique, si esta en true, ya no va a verificar y no saldra el mensaje siempre de verificar token

  useEffect(() => {
    if (!tokenChecked) {
      tokenExpires();
      setTokenChecked(true);
    }
  }, [tokenChecked, tokenExpires, navigate]);

  hljs.configure({
    languages: ["javascript", "ruby", "python", "rust"],
    highlightAll: true,
  });

  const state = useLocation().state; // ESTE STATE LO SACAMOS DEL GETPOST PARA EDITAR EL POST, si no tiene ningun dato, es porque estamos creando un post nuevo, si tiene datos, es porque estamos editando un post, por eso ponemos el || "" para que no de error al no tener datos
  const [value, setValue] = useState(state?.desc || "");
  const [titulo, setTitulo] = useState(state?.titulo || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  // const [loading, setLoading] = useState(true);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8801/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setPublishing(true); // Establece "publishing" en "true" antes de publicar el post
    const imgUrl = await upload();
    try {
      // como lo explique arriba, si el state tiene datos, es porque estamos editando un post, si no tiene datos, es porque estamos creando un post, por eso usamos este if
      if (state) {
        const res = await axios.put(
          `http://localhost:8801/api/posts/editar-post/${state._id}`,
          {
            titulo,
            desc: value,
            cat,
            img: file ? imgUrl.url : state.img,
          },
          {
            headers: {
              "x-token": currentUser.token,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Post actualizado",
          text: "Se ha actualizado el post con éxito",
        });

        navigate("/post/" + res.data._id);
      } else {
        const res = await axios.post(
          "http://localhost:8801/api/posts/crear-post",
          {
            titulo,
            desc: value,
            cat,
            img: file ? imgUrl.url : "",
          },
          {
            headers: {
              "x-token": currentUser.token,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Post creado",
          text: "Se ha creado el post con éxito",
        });

        navigate("/post/" + res.data._id);
      }
    } catch (err) {
      // Manejar errores aquí
      let errores = err.response.data.message.map((error) => error.msg);
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        // text: errores.join(', ')+'\n',
        // text: errores.join('<ul><li>'),
        html:
          '<ul style="list-style: none;font-size:15px"><li>' +
          errores.join("</li><li>") +
          "</li></ul>",
      });

      if (err.response.data.code === 500) {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "INTERNAL SERVER ERROR",
        });
      }
    } finally {
      setPublishing(false); // Establece "publishing" en "false" después de publicar el post
    }
  };
  // if (loading) {
  //   return <div className='spinner'></div>
  // }

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitulo(e.target.value)}
          value={titulo}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            theme="snow"
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1 style={{ marginTop: "-0px" }}>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button type="submit" disabled={publishing} onClick={handleClick}>
              {publishing ? "Loading..." : "Publish"}
            </button>
          </div>
        </div>
        <div className="item">
          <h1 style={{ marginTop: "-0px" }}>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
