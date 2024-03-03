import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, useColorMode } from '../context/ColorModeContext'; // Import the ColorModeContext and useColorMode hook

const Lobby: React.FC = () => {
  const { isDarkMode, toggleColorMode } = useColorMode(); // Access isDarkMode and toggleColorMode from the context
    const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const room = e.currentTarget.invite_link.value;
    navigate(`/video-chat/${room}`);
  };

  return (
    <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
      <main className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-custom-dark text-custom-light' : 'bg-custom-light-tree text-custom-dark'}`}>
        <div className={` md:w-1/2 w-full m-2 p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-custom-dark-fog' : 'bg-custom-light'}`}>
          <div className="mb-4  text-center">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-custom-light' : 'text-custom-dark'}`}>👋 Create OR Join a Room</h2>
          </div>

          <form id="join-form" onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                name="invite_link"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${isDarkMode ? 'bg-custom-darkest-tree text-custom-light' : 'bg-custom-light text-custom-dark'}`}
                placeholder="Enter room code"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className={`px-6 py-3 text-white rounded-md focus:outline-none ${isDarkMode ? 'bg-custom-purple hover:bg-custom-pink focus:bg-custom-pink' : 'bg-custom-purple hover:bg-custom-sky focus:bg-custom-sky'}`}
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Toggle button for switching between dark and light modes */}
      <div className="fixed bottom-4 right-4">
        <button onClick={toggleColorMode} className="px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </ColorModeContext.Provider>
  );
};

export default Lobby;
