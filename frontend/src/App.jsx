import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Feed from './pages/Feed';
import Schedule from './pages/Schedule';
import Events from './pages/Events';
import Notes from './pages/Notes';
import Marketplace from './pages/Marketplace';
import LostFound from './pages/LostFound';

import ComponentsPage from './pages/ComponentsShowcase';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="feed" element={<Feed />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="events" element={<Events />} />
          <Route path="notes" element={<Notes />} />
          <Route path="market" element={<Marketplace />} />
          <Route path="lost-found" element={<LostFound />} />
          <Route path="test" element={<ComponentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
