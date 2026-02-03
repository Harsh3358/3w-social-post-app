import "../styles/navbar.css";

function Navbar({ user, pageTitle }) {
  const points = user?.points ?? 0;
  const balance = user?.walletBalance ?? 0;
  const userName = user?.name ?? "Guest";

  return (
    <header className="navbar">
      {/* Left: Logo + Page Title */}
      <div className="nav-left">
        <span className="logo">TaskPlanet</span>
      </div>

      {/* Center: Search */}
      <div className="nav-center">
        <span className="page-title">{pageTitle}</span>
        <input
          type="text"
          placeholder="Search now"
          className="search-input"
        />
      </div>

      {/* Right: Actions */}
      <div className="nav-right">
        {/* <div className="badge tooltip-wrapper">
          {points} ⭐
          <span className="tooltip">Reward Points</span>
        </div>

        <div className="wallet tooltip-wrapper">
          ${balance.toFixed(2)} ▾
          <span className="tooltip">Wallet</span>
        </div> */}

        <div className="icon tooltip-wrapper">
          🔔
          <span className="notification-dot"></span>
        </div>

        <div className="profile tooltip-wrapper">
          <img src="https://i.pravatar.cc/40" alt="profile" />
          <span className="caret">{userName} ▾</span>
          <span className="tooltip">Account</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
