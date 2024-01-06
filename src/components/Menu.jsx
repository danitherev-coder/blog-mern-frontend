import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8801/api/posts/?cat=${cat}`
        );
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.map((post) => (
        <div className="post" key={post._id}>
          <Link className="link" to={`/post/${post._id}`}>
            <img
              loading="lazy"
              src={`http://res.cloudinary.com/dpvk1flpp/image/upload/v1672158335/${post?.img}`}
              alt=""
            />
            <h2>{post.titulo}</h2>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
