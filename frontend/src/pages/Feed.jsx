import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";


function Feed() {
  const navigate = useNavigate();
  const user = getUser();

  // All hooks and state
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!text && !imageUrl) {
      alert("Post must contain text or image");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/posts", { text, imageUrl });

      // IMPORTANT: prepend new post to feed (Always recent post on top)
      setPosts((prev) => [res.data, ...prev]);

      // reset form
      setText("");
      setImageUrl("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div>
      <h2>Social Feed</h2>

      <form onSubmit={handleCreatePost} style={{ marginBottom: "20px" }}>
        <h3>Create Post</h3>

        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>


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
