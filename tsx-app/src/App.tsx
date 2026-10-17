import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LegacyBirthdayPage } from "./components/LegacyBirthdayPage";
import { FiveSectionPage } from "./components/FiveSectionPage";
import { FallingPetals } from "./components/FallingPetals";

function BirthdayPage() {
  return <LegacyBirthdayPage />;
}

function RouteTransition() {
  const location = useLocation();

  return (
    <div className="route-transition" key={location.pathname}>
      <Routes>
        <Route path="/" element={<BirthdayPage />} />
        <Route element={<Layout />}>
          <Route path="/20-10" element={<FiveSectionPage kind="october20" />} />
          <Route path="/20-11" element={<FiveSectionPage kind="november20" />} />
        </Route>
      </Routes>
    </div>
  );
}

function GlobalEffects() {
  const location = useLocation();

  return location.pathname === "/20-10" ? <FallingPetals /> : null;
}

export default function App() {
  return (
    <div className="app-shell">
      <GlobalEffects />
      <RouteTransition />
    </div>
  );
}
