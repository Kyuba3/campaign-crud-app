import React from "react";
import { CampaignList } from "./pages/CampaignList";
import { CampaignForm } from "./pages/CampaignForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AppInitializer } from "./context/AppInitializer";

const App = () => {
  return (
      <AppInitializer>
        <Router>
          <Routes>
            <Route path="/" element={<CampaignList />} />
            <Route path="/new" element={<CampaignForm />} />
            <Route path="/edit/:id" element={<CampaignForm />} />
          </Routes>
        </Router>
      </AppInitializer>
      
  );
};

export default App;
