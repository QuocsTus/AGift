import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LegacyBirthdayPage } from "./components/LegacyBirthdayPage";
import { FiveSectionPage } from "./components/FiveSectionPage";
import { FallingPetals } from "./components/FallingPetals";
import { November20LegacyPage } from "./components/November20LegacyPage";

function BirthdayPage() {
  return <LegacyBirthdayPage />;
}

function HomeRoute() {
  return <BirthdayPage />;
}

function November20Route() {
  return <November20LegacyPage />;
}

function RouteTransition() {
  const location = useLocation();

  return (
    <div className="route-transition" key={location.pathname}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/20-11" element={<November20Route />} />
        <Route element={<Layout />}>
          <Route path="/20-10" element={<FiveSectionPage kind="october20" />} />
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
