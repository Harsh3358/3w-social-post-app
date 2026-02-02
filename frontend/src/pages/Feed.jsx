import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/feed.css";

function Feed() {
  const navigate = useNavigate();
  const user = getUser();

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;


  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchPosts(1);
  }, []);


  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageUrl.trim()) {
      alert("Post must contain text or image");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/posts", {
        text: text.trim(),
        imageUrl: imageUrl.trim(),
      });

      setPosts((prev) => [res.data, ...prev]);
      setText("");
      setImageUrl("");
    } catch {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch {
      alert("Failed to like post");
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const res = await api.post(`/posts/${postId}/comment`, {
        text: commentText,
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      alert("Failed to add comment");
    }
  };

  const fetchPosts = async (pageNumber) => {
    try {
      const res = await api.get(
        `/posts?page=${pageNumber}&limit=${LIMIT}`
      );

      if (res.data.length < LIMIT) {
        setHasMore(false);
      }

      if (pageNumber === 1) {
        setPosts(res.data);
      } else {
        setPosts((prev) => [...prev, ...res.data]);
      }
    } catch {
      logout();
      navigate("/login");
    }
  };


  return (
    <div className="feed-container">
      <h2>Social Feed</h2>

      {/* Create Post */}
      <form className="post" onSubmit={handleCreatePost}>
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

      {/* Feed */}
      {posts.map((post) => {
        const hasLiked = post.likes.some(
          (like) => like.userId === user._id
        );

        return (
          <div key={post._id} className="post">
            <strong>{post.username}</strong>

            {post.text && <p>{post.text}</p>}

            {post.imageUrl && (
              <img src={post.imageUrl} alt="post" />
            )}

            {/* Actions */}
            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                {hasLiked ? "💙" : "🤍"} {post.likes.length}
              </button>
              <span>💬 {post.comments.length}</span>
            </div>

            {/* Comments */}
            <div>
              {post.comments.map((c, index) => (
                <div key={index} className="comment">
                  <b>{c.username}:</b> {c.text}
                </div>
              ))}

              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  disabled={!commentInputs[post._id]?.trim()}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* load more posts*/}
      {hasMore && (
        <button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
          }}
        >
          Load more
        </button>
      )}

    </div>
  );
}

export default Feed;
