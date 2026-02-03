import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

const menuItems = [
  { label: "Home", icon: "🏠" },
  { label: "Tasks", icon: "📋" },
  { label: "Promote", icon: "📣" },
  { label: "Social", icon: "💬", route: "/", count: 14 },
  { label: "Leaderboard", icon: "🏆" },
  { label: "Rewards", icon: "🎁" },
  { label: "Referrals", icon: "👥" },
  { label: "Settings", icon: "⚙️" },
];

function Sidebar({ active }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const isActive = active === item.label;

        return (
          <div
            key={item.label}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            data-clickable={item.label === "Social" ? "true" : undefined}
            onClick={() => {
              if (item.route) navigate(item.route);
            }}
            style={{ cursor: item.label === "Social" ? "pointer" : "default" }}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.label}</span>

            {item.count && <span className="count">{item.count}</span>}
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;
