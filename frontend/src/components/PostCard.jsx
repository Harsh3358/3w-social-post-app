import { useState } from "react";
import "../styles/postCard.css";

function PostCard({ post, currentUser, onLike, onAddComment }) {
  // Defensive defaults
  const username = post?.username || "Unknown";
  const avatarLetter = (username && username.charAt(0).toUpperCase()) || "?";
  const time = post?.createdAt ? new Date(post.createdAt).toLocaleString() : "";
  const content = post?.text || "";
  const image = post?.imageUrl || "";
  const likesCount = Array.isArray(post?.likes) ? post.likes.length : 0;
  const commentsCount = Array.isArray(post?.comments) ? post.comments.length : 0;

  // Determine if current user has liked (safe string comparison)
  const hasLiked =
    currentUser &&
    Array.isArray(post?.likes) &&
    post.likes.some((l) => String(l.userId) === String(currentUser._id));

  // Local comment input inside card
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLikeClick = () => {
    if (typeof onLike === "function") onLike(post._id);
  };

  const handleCommentSubmit = async () => {
    const text = (commentText || "").trim();
    if (!text) return;
    if (typeof onAddComment !== "function") return;

    try {
      setSubmitting(true);
      await onAddComment(post._id, text);
      setCommentText("");
      setShowCommentInput(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <div className="avatar">{avatarLetter}</div>
          <div>
            <div className="username">{username}</div>
            <div className="time">{time}</div>
          </div>
        </div>
        <div className="menu">⋯</div>
      </div>

      {/* TEXT */}
      {content && (
        <div className="post-content">
          <p>{content}</p>
        </div>
      )}

      {/* IMAGE */}
      {image && (
        <div className="post-image">
          <img src={image} alt={`Post by ${username}`} loading="lazy" />
        </div>
      )}

      {/* STATS */}
      <div className="post-stats">
        <span>{likesCount} likes</span>
        <span>{commentsCount} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <button onClick={handleLikeClick} aria-pressed={hasLiked}>
          {hasLiked ? "💙 Liked" : "♡ Like"}
        </button>

        <button
          onClick={() => setShowCommentInput((s) => !s)}
          aria-expanded={showCommentInput}
        >
          💬 Comment
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.href}#post-${post._id}`);
            alert("Post link copied!");
          }}
        >
          🔗 Share
        </button>
      </div>

      {/* COMMENT INPUT (toggle) */}
      {showCommentInput && (
        <div className="comment-box">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            disabled={submitting}
          />
          <button onClick={handleCommentSubmit} disabled={submitting || !commentText.trim()}>
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;