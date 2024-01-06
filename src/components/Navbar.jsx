// import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import Logo from "../img/dani1.png";
// import Profile from "./Profile";

// const Navbar = () => {

//   const { currentUser, logout } = useContext(AuthContext);
//   return (
//     <div className="navbar">
//       <div className="container">
//         <div className="logo">
//           <Link to="/">
//             <img src={Logo} alt="" />
//           </Link>
//         </div>
//         <div className="links">
//           <Link className="link" to="/?cat=art">
//             <h6>ART</h6>
//           </Link>
//           <Link className="link" to="/?cat=science">
//             <h6>SCIENCE</h6>
//           </Link>
//           <Link className="link" to="/?cat=technology">
//             <h6>TECHNOLOGY</h6>
//           </Link>
//           <Link className="link" to="/?cat=cinema">
//             <h6>CINEMA</h6>
//           </Link>
//           <Link className="link" to="/?cat=design">
//             <h6>DESIGN</h6>
//           </Link>
//           <Link className="link" to="/?cat=food">
//             <h6>FOOD</h6>
//           </Link>
//           {/* <span>{currentUser?.usuario.nombre}</span> */}
//           <Profile />
//           {currentUser ? null : <Link className="link" to={'/login'}>Login</Link>}
//           {currentUser ? (
//             <span className="write">
//               <Link className="link" to="/write">
//                 Write
//               </Link>
//             </span>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
// import { useJwt } from "react-jwt";

const Navbar = () => {
  // ==============================================
  /// Scroll hacia Abajo, cambia de color el navbar
  // ==============================================
  const [active, setActive] = useState(false);

  const isActive = () => {
    window.scrollY >= 0 ? setActive(true) : setActive(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };
  });
  // ==================================
  //           FIN DEL NAVBAR
  // ==================================

  //================================================
  //           Vista cuando inicio sesion
  //================================================
  const currentUsers = JSON.parse(localStorage.getItem("user"));

  const [currentUser, setCurrentUser] = useState(null);

  const token = currentUsers?.token;
  const userId = currentUsers?.user?._id; // Obtener el ID del usuario

  // const { isExpired } = useJwt(token);
  // useEffect(() => {
  //   if (isExpired) {
  //     localStorage.removeItem("currentUser");
  //     setCurrentUser(null);
  //   } else {
  //     const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
  //     setCurrentUser(storedCurrentUser);
  //   }
  // }, [isExpired]);

  //================================================
  //         TERMINA LA VISTA DE INICIAR SESION
  //================================================

  // ==============================================
  //          ABRIR Y CERRAR MODAL DE PERFIL
  // ==============================================
  const [open, setOpen] = useState(false);
  // ==============================================
  //         FIN  ABRIR Y CERRAR MODAL DE PERFIL
  // ==============================================

  // ================================================
  //          VER LA LOCATION ACTUAL, para categorias
  // ================================================
  // esto servira para que el navbar no se active si esta fuera de la ruta principa('/')
  const { pathname } = useLocation();

  // ================================================
  //        CERRAR SESION
  // ================================================
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // await newRequest.post("/api/auth/logout");
      // await newRequest.post("auth/logout");
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("user", null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // ================================================
  //         CERRAR SESION
  // ================================================

  // cuando en el currentUser google es tru, entonces mostrare su img, pero si google es false mostrare la img de cloudinary, pero si no hay ninguna imagen, mostrare noavatar

  // Obtener los datos del usuario
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await newRequest.get(`/api/user/${userId}`);
        setCurrentUser((prevUser) => {
          return { ...prevUser, user: res.data };
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getUser();
    }
  }, [userId]);

  // esto sirve para cuando ingrese una palabra se envie a mis busquedas para obtener el resultado
  const [input, setInput] = useState("");

  return (
    // <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
    <div className="navbar active">
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span className="text">fiverr</span>{" "}
            <span style={{ fontWeight: "200" }}>blog</span>
          </Link>
          <span className="dot">.</span>
          <div className="search">
            <div className="searchInput">
              <img
                src="/img/search.webp"
                alt="lupa"
                style={{ width: "20px" }}
              />
              <input
                type="text"
                placeholder="Try building mobil app"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <a
              href={`/?search=${input}`} // Actualiza el href del enlace de búsqueda
              className="search-link"
              onClick={(e) => {
                e.preventDefault(); // Evita el comportamiento predeterminado del enlace
                navigate(`/?search=${input}`); // Redirige utilizando la función navigate
                setInput(""); // Limpia el input
              }}
            >
              <button>Search</button>
            </a>
          </div>
        </div>
        <div className="links">
          <a className="link" href="/?cat=art">
            <span>Arte</span>
          </a>
          <a className="link" href="/?cat=science">
            <span>Ciencia</span>
          </a>
          <a className="link" href="/?cat=cinema">
            <span>Cinema</span>
          </a>
          <a className="link" href="/?cat=design">
            <span>Diseño</span>
          </a>
          <a className="link" href="/?cat=technology">
            <span>Tecnologia</span>
          </a>

          {currentUsers ? (
            <>
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  // src={currentUser?.user?.img || "/img/noavatar.webp"}
                  src={
                    `https://res.cloudinary.com/dpvk1flpp/image/upload/v1687656841/${currentUsers?.usuario?.img}` ||
                    "/img/noavatar.webp"
                  }
                  // src={img}
                  alt="imagen user"
                  loading="lazy"
                />
                <span>{currentUsers?.usuario?.nombre}</span>
                {open && (
                  <div className="options">
                    <Link className="link" to="/write">
                      Escribir Blog
                    </Link>
                    <Link className="link" to="/mis-blogs">
                      Mis Blogs
                    </Link>
                    <Link
                      className="link"
                      to={`/editar-perfil/${currentUsers.usuario._id}`}
                    >
                      Configurar Cuenta
                    </Link>
                    <Link className="link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
