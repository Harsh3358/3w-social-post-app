import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/feed.css";
import AuthModal from "../components/AuthModal";
import PostCard from "../components/PostCard";


function Feed() {
  const user = getUser();

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;
  const [authModal, setAuthModal] = useState(null); 
  // "login" | "register" | null



  useEffect(() => {
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
      setAuthModal("login");    }
  };

  const requireAuth = () => {
    if (!user) {
      setAuthModal("login");
      return false;
    }
    return true;
  };



  return (
    <>
      <div className="feed-container">
        <h2>Social Feed</h2>

        {/* Create Post */}
        {user ? (
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
        ) : (
          <div className="post">
            <p>Login to create a post</p>
            <button onClick={() => setAuthModal("login")}>
              Login / Register
            </button>
          </div>
        )}

        {posts.length === 0 && <p>No posts yet.</p>}

        {/* Feed */}
        {posts.map((post) => {
          const hasLiked =
            user && post.likes.some((like) => like.userId === user._id);

          return (
            <PostCard
              key={post._id}
              username={post.username}
              time={new Date(post.createdAt).toLocaleString()}
              content={post.text}
              image={post.imageUrl}
              likesCount={post.likes.length}
              commentsCount={post.comments.length}
              hasLiked={hasLiked}
              onLike={() => {
                if (!requireAuth()) return;
                handleLike(post._id);
              }}
              onComment={() => {
                if (!requireAuth()) return;
                // later: focus comment input
              }}
            />
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

      {/* AUTH MODAL (GLOBAL OVERLAY) */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}            onSuccess={() => setAuthModal(null)}
        />
      )}
    </>
  );
}

export default Feed;
