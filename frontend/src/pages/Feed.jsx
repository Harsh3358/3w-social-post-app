import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const user = getUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error(err);
        logout();
        navigate("/login");
      });
  }, []);

  return (
    <div>
      <h2>Social Feed</h2>

      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{post.username}</strong>

          {post.text && <p>{post.text}</p>}

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              style={{ width: "100%", maxWidth: "300px" }}
            />
          )}

          <p>
            👍 {post.likes.length} · 💬 {post.comments.length}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Feed;
