import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/feed.css";
import AuthModal from "../components/AuthModal";
import PostCard from "../components/PostCard";
import CreatePostCard from "../components/CreatePostCard";



function Feed() {
  const user = getUser();

  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;
  const [authModal, setAuthModal] = useState(null); 
  // "login" | "register" | null



  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleCreatePost = async (content) => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/posts", {
        text: content.trim(),
        imageUrl: "",
      });

      setPosts((prev) => [res.data, ...prev]);
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

  const handleAddComment = async (postId, commentText) => {
    const text = (commentText || "").trim();
    if (!text) return;

    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? { ...post, comments: res.data } : post))
      );
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
        {/* <h2>Social Feed</h2> */}

        {/* Create Post */}
        {user ? (
          <CreatePostCard
            userName={user.name || user.username}
            userAvatar={`https://ui-avatars.com/api/?name=${user.name || user.username}`}
            onPost={handleCreatePost}
            onAddImage={() => {}}
            onAddEmoji={() => {}}
            onAddPoll={() => {}}
            onPromote={() => {}}
          />
        ) : (
          <div className="post">
            <p>Login to create a post</p>
            <button onClick={() => setAuthModal("login")}>
              Login / Register
            </button>
          </div>
        )}

        {/* Post Card */}
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={user}
            onLike={() => {
              if (!requireAuth()) return;
              handleLike(post._id);
            }}
            onAddComment={(postId, text) => {
              if (!requireAuth()) return;
              handleAddComment(postId, text);
            }}
          />
        ))}



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
