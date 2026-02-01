import api from "../api/axios";
import { useEffect } from "react";

function Feed() {
  useEffect(() => {
    api.get("/health")
      .then((res) => console.log("Backend OK:", res.data))
      .catch((err) => console.error("Backend error:", err));
  }, []);

  return <h2>Feed Page</h2>;
}

export default Feed;
