import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
const Home = () => {
  // aga guardaremos el array de los posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(""); // nuevo
  const [page, setPage] = useState(1); // nuevo
  const [pageSize, setPageSize] = useState(5); // nuevo

  // modo oscuro

  // esta parte es para las categorias, usando el location
  const cat = useLocation().search;

  // con esto lo llamaremos cada vez que se renderice el componente HOME
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get('http://localhost:8801/api/posts')
        // const res = await axios.get(`http://localhost:8801/api/posts${cat}`)
        let res;
        if (cat) {
          res = await axios.get(
            `http://localhost:8801/api/posts${cat}&page=${page}&?pageSize=${pageSize}`
          );
        } else {
          res = await axios.get(
            `http://localhost:8801/api/posts?page=${page}&?pageSize=${pageSize}`
          );
        }
        setPosts(res.data);
        // console.log(res.data)
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [cat, page, pageSize]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  const filteredPosts = posts.filter((post) => {
    return post.titulo.toLowerCase().includes(query.toLowerCase());
  });

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  const loadMore = async () => {
    try {
      setPage(page + 1);
      let res;
      if (cat) {
        res = await axios.get(
          `http://localhost:8801/api/posts${cat}&page=${page}&pageSize=${pageSize}`
        );
      } else {
        res = await axios.get(
          `http://localhost:8801/api/posts?page=${page}&pageSize=${pageSize}`
        );
      }

      setPosts([...posts, ...res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      <div className="posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div className="post" key={post._id}>
              <div className="img">
                <img
                  loading="lazy"
                  src={`https://res.cloudinary.com/dpvk1flpp/image/upload/v1672501225/${post?.img}`}
                  alt=""
                />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post._id}`}>
                  <h1>{post.titulo}</h1>
                </Link>
                <p>{getText(post.desc)}</p>
                <Link className="link" to={`/post/${post._id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No results</p>
        )}
        {filteredPosts.length === pageSize && (
          <button onClick={loadMore}>Mostrar más</button>
        )}
      </div>
    </div>
  );
};

export default Home;
