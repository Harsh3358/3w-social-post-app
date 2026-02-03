import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout as parent */}
        <Route path="/" element={<Layout />}>
          
          {/* Feed renders INSIDE Layout */}
          <Route index element={<Feed />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
