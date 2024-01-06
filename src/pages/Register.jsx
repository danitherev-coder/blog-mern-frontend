import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  // para obtener los datos del formulario y enviarlos al backend
  const [inputs, setInputs] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  // para mostrar los errores del backend
  const [error, setErr] = useState(null); // esto ira al catch del handleSubmit

  // una vez se haya registrado el usuario, se redirecciona a la pagina de login
  const navigate = useNavigate();

  // esto es para ver los cambios del formulario en tiempo real
  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  // esto es para enviar los datos del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8801/api/users/crear-user`,
        inputs
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario creado con existo, ahora puede iniciar sesion",
        showConfirmButton: true,
        timer: 5000,
      });
      navigate("/login");
    } catch (error) {
      // console.log(error)
      setErr(error.response.data);
      let errores = error.response.data.message.map((err) => err.msg);
      Swal.fire({
        position: "center",
        icon: "error",
        html:
          '<ul style="list-style: none;font-size:15px"><li>' +
          errores.join("</li><li>") +
          "</li></ul>",
        showConfirmButton: true,
        timer: 5000,
      });
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form>
        <input
          type="text"
          required
          placeholder="nombre"
          name="nombre"
          onChange={handleChange}
        />
        <input
          required
          type="text"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Register</button>
        {/* si hay errores, mostrar, sino, dejarlo vacio */}
        {error && <p style={{ fontSize: "20px" }}>{error.msg}</p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
