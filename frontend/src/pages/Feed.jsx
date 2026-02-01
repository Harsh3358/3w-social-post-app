import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api.get("/user/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        logout();
        navigate("/login");
      });
  }, []);

  return (
    <div>
      <h2>Welcome {user?.name}</h2>
      <button onClick={() => { logout(); navigate("/login"); }}>
        Logout
      </button>
    </div>
  );
}

export default Feed;
