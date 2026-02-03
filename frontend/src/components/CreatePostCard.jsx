import { useState } from "react";
import "../styles/createPostCard.css";

function CreatePostCard({
  userName,
  userAvatar,
  onPost,
  onAddImage,
  onAddEmoji,
  onAddPoll,
  onPromote,
}) {
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!content.trim()) return;
    onPost(content);
    setContent("");
  };

  return (
    <div className="create-post-card">
      {/* HEADER */}
      <div className="create-post-header">
        <img src={userAvatar} alt={userName} className="avatar" />
        <span className="prompt">
          What’s on your mind, <strong>{userName}</strong>?
        </span>
      </div>

      {/* INPUT */}
      <textarea
        className="post-input"
        placeholder="Share an update, promote a task, or ask the community..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* FOOTER */}
      <div className="create-post-footer">
        <div className="actions">
          <div className="icon-wrapper" onClick={onAddImage}>
            🖼
            <span className="tooltip">Add Image</span>
          </div>

          <div className="icon-wrapper" onClick={onAddEmoji}>
            😊
            <span className="tooltip">Emoji</span>
          </div>

          <div className="icon-wrapper" onClick={onAddPoll}>
            📊
            <span className="tooltip">Poll</span>
          </div>

          <div className="icon-wrapper" onClick={onPromote}>
            📣
            <span className="tooltip">Promote</span>
          </div>
        </div>

        <button
          className="post-btn"
          disabled={!content.trim()}
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePostCard;
