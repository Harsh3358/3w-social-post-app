import { useState, useRef, useEffect } from "react";
import "./profileMenu.css";

function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="profile-menu-wrapper" ref={menuRef}>
      {/* Trigger */}
      <div className="profile-trigger" onClick={() => setOpen(!open)}>
        <img src={user.avatar} alt={user.name} />
        <span>{user.name}</span>
        <span className="caret">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="profile-menu">
          <div className="menu-header">
            <span className="signed-in">Signed in as</span>
            <strong>@{user.username}</strong>
          </div>

          <div className="menu-item">My Profile</div>
          <div className="menu-item">Settings</div>
          <div className="menu-item">Privacy & Security</div>
          <div className="menu-item">Saved Posts</div>

          <div className="divider" />

          <div className="menu-item">Notifications</div>
          <div className="menu-item">Help & Feedback</div>

          <div className="divider" />

          <div className="menu-item logout">Log out</div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
