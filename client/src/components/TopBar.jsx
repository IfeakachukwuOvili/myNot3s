import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMoon, IoSunny } from 'react-icons/io5';
import Modal from './Modal';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import { useDropdown } from '../hooks/useDropdown';

export default function TopBar() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isDropdownOpen, setIsDropdownOpen, dropdownRef } = useDropdown();
  const { user, statusMessage, messageType, handleSignOut, handleDeleteAccount, updateProfile} = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };
  const handleProfileUpdate = async () => {
    const success = await updateProfile(newName, currentPassword, newPassword);
    if (success) {
      setTimeout(() => {
        setIsEditingProfile(false);
        setNewPassword('');
        setCurrentPassword('');
      }, 2000);
    }
  };
   const handleDeleteConfirm = async () => {
    const success = await handleDeleteAccount();
    if (!success) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 border-b border-gray-200">
        <div className="mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo / App Name */}
          <h1
            onClick={() => navigate('/notebooks')}
            className="text-xl font-bold cursor-pointer text-gray-900 dark:text-white"
          >
            myNot3s
          </h1>

          {/* Right side: profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <IoSunny className="text-xl text-yellow-500" />
              ) : (
                <IoMoon className="text-xl text-gray-600" />
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {user ? user.name : 'Loading...'}
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border rounded shadow-lg min-w-[240px] z-50">
                  {isEditingProfile ? (
                    <div className="p-4">
                      <input
                        type="text"
                        placeholder="New Name"
                        defaultValue={user?.name}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />
                      
                      {/* Status Message */}
                      {statusMessage && (
                        <div className={`mb-4 px-3 py-2 rounded text-sm ${
                          messageType === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {statusMessage}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleProfileUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setNewPassword('');
                            setCurrentPassword('');
                            setStatusMessage('');
                          }}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
    </>
  );
}
