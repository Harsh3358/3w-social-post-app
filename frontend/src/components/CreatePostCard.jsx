import { useState, useRef } from "react";
import "../styles/createPostCard.css";

function CreatePostCard({
  userName,
  userAvatar,
  onPost,
  onAddPoll,
  onPromote,
}) {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);


  // Open file picker
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  };

  // Handle post submit
  const handlePost = () => {
    if (!content.trim() && !selectedFile) return;

    onPost({
      text: content.trim(),
      imageFile: selectedFile,
    });

    // Reset state
    setContent("");
    setSelectedFile(null);
    fileInputRef.current.value = "";
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

      {/* TEXT INPUT */}
      <textarea
        className="post-input"
        placeholder="Share an update, promote a task, or ask the community..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* IMAGE PREVIEW (basic) */}
      {selectedFile && (
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#374151" }}>
          Selected image: {selectedFile.name}
        </p>
      )}

      {/* FOOTER */}
      <div className="create-post-footer">
        <div className="actions">
          {/* IMAGE */}
          <div className="icon-wrapper" onClick={handleImageClick}>
            🖼
            <span className="tooltip">Add Image</span>
          </div>

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />

          {/* EMOJI (later) */}
          <div
            className="icon-wrapper"
            onClick={() => alert("Emoji coming soon")}
          >
            😊
            <span className="tooltip">Emoji</span>
          </div>

          {/* POLL */}
          <div className="icon-wrapper" onClick={onAddPoll}>
            📊
            <span className="tooltip">Poll</span>
          </div>

          {/* PROMOTE */}
          <div className="icon-wrapper" onClick={onPromote}>
            📣
            <span className="tooltip">Promote</span>
          </div>
        </div>

        <button
          className="post-btn"
          disabled={!content.trim() && !selectedFile}
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CreatePostCard;
