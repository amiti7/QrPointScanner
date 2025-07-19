import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Home, MessageCircle, LogOut, HardHat, X } from 'lucide-react';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setLocation('/login');
    onClose();
  };

  const handleContactUs = () => {
    const message = encodeURIComponent("Hello! I need help with Nirman Bandhu App.");
    const whatsappURL = `https://wa.me/+918960981283?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HardHat className="w-6 h-6 mr-3" />
              <h2 className="text-lg font-bold">ConstructScan</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-orange-200 text-sm">{user?.mobile}</p>
        </div>
        
        {/* Navigation */}
        <nav className="py-4">
          <button 
            onClick={() => handleNavigation('/home')}
            className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 border-l-4 border-primary"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </button>
          <button 
            onClick={handleContactUs}
            className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Contact Us
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
