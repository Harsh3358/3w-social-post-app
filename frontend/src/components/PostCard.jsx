import "./PostCard.css";

function PostCard({
  username,
  time,
  content,
  image,
  likesCount,
  commentsCount,
  hasLiked,
  onLike,
  onComment,
}) {
  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          {/* Avatar placeholder (UI unchanged visually) */}
          <div className="avatar">{username[0]}</div>
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
          <img src={image} alt="Post" />
        </div>
      )}

      {/* STATS */}
      <div className="post-stats">
        <span>{likesCount} likes</span>
        <span>{commentsCount} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <button onClick={onLike}>
            {hasLiked ? "💙" : "♡"} Like
        </button>

        <button onClick={onComment}>
            💬 Comment
        </button>

        <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Post link copied!");
        }}>
            🔗 Share
        </button>
        </div>
    </div>
  );
}

export default PostCard;
