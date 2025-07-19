import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { Menu, Phone, Star, QrCode, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBar from '@/components/status-bar';
import NavigationDrawer from '@/components/navigation-drawer';
import { RootState } from '../store';
import { getUserProfile } from '../store/authSlice';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }
    // Only fetch profile once when component mounts
    dispatch(getUserProfile(user.id));
  }, []);

  const handleScanQR = () => {
    setLocation('/qr-scanner');
  };

  if (!user) {
    return null;
  }

  // Mock recent activity data
  const recentScans = [
    { points: 10, timeAgo: '2 hours ago' },
    { points: 25, timeAgo: '1 day ago' },
  ];

  return (
    <>
      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      
      <div className="min-h-screen flex flex-col">
        <StatusBar />
        
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="text-white hover:text-gray-200 hover:bg-transparent p-0"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold">ConstructScan</h1>
          <div className="w-6"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-primary">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Welcome Back!</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <span className="text-gray-700">{user.mobile}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-primary mr-3" />
                <span className="text-gray-700">Total Points: </span>
                <span className="font-bold text-primary ml-1">{user.totalPoints}</span>
              </div>
            </div>
          </div>

          {/* QR Scanner Button */}
          <div className="text-center mb-8">
            <Button
              onClick={handleScanQR}
              className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition duration-200 flex items-center justify-center mx-auto"
            >
              <QrCode className="w-8 h-8 mr-4" />
              <div className="text-left">
                <div className="text-xl">Scan QR Code</div>
                <div className="text-sm opacity-90">Earn points instantly</div>
              </div>
            </Button>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">+{scan.points} Points</p>
                        <p className="text-sm text-gray-600">{scan.timeAgo}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent scans</p>
                  <p className="text-sm">Start scanning QR codes to earn points!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
