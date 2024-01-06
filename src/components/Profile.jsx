import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {

    const { currentUser, logout } = useContext(AuthContext)


    return (
        <>
            {currentUser ? (
                <div className="containerProfile">
                    <div className="half">
                        <label htmlFor="profile2" className="profile-dropdown" >
                            <input type="checkbox" id="profile2" />
                            <img src={currentUser.usuario.img ? `https://res.cloudinary.com/dpvk1flpp/image/upload/v1672501225/${currentUser.usuario.img}` : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} />


                            <span>{currentUser?.usuario?.nombre}</span>
                            {/* <label htmlFor="profile2"><i className="mdi mdi-menu"></i></label> */}
                            <ul>
                                <li><Link to={`/edit/${currentUser.usuario._id}`}><i className="mdi mdi-account"></i>Cuenta</Link></li>
                                <li><a onClick={logout}><i className="mdi mdi-logout"></i>Cerrar sesión</a></li>
                            </ul>
                        </label>
                    </div>
                </div>
            ) : null}

            <div className="background"></div>
        </>
    )
}

export default Profile


// si el que ha iniciado sesion no tiene el mismo ID del useParams, entonces redirigir al HTMLModElement.