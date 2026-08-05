import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TokenGatePage from './pages/TokenGatePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import PublicPortfolioPage from './pages/PublicPortfolioPage.jsx';
import OwnerPage from './pages/OwnerPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TokenGatePage />} />
        <Route path="/edit/:slug" element={<EditorPage />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/:slug" element={<PublicPortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}
