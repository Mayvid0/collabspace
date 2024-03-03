import React, { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ColorModeProvider } from './context/ColorModeContext';

const Lobby = lazy(() => import('./pages/lobby'));
const VideoChat = lazy(() => import('./pages/testvideoCall'));



const Loading = () => <div>Loading...</div>;

export const App: React.FC = () => {
  return (
    <ColorModeProvider> 
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/video-chat" element={<Lobby />} />
              <Route path="/video-chat/:room" element={<VideoChat />} />
          </Routes>
        </Suspense>
      </Router>
    </ColorModeProvider>
  );
};
