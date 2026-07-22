import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import EngineerPage from "./pages/EngineerPage";
import BusinessPage from "./pages/BusinessPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/engineer" element={<EngineerPage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
