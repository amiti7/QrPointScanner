import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, QrCode, Phone, Award, User, LogOut } from 'lucide-react';
import { setUser, logout } from '../store/authSlice.js';
import { formatMobile } from '../lib/utils.js';

// StatusBar Component
function StatusBar({ bgColor = "bg-primary" }) {
  return (
    <div className={`${bgColor} h-6 w-full flex items-center justify-center`}>
      <div className="flex items-center space-x-1">
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Query user data
  const { data: userData, refetch } = useQuery({
    queryKey: ['/api/user', user?.id],
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    // Update user data if fetched
    if (userData?.user) {
      dispatch(setUser(userData.user));
    }
  }, [isAuthenticated, userData, dispatch, setLocation]);

  const handleLogout = () => {
    dispatch(logout());
    setLocation('/login');
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "919876543210"; // Replace with actual company number
    const message = "Hello! I need help with the ConstructScan app.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ConstructScan</h1>
              <p className="text-sm opacity-90">Welcome back!</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white hover:bg-opacity-20">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-primary">Menu</h2>
                </div>
                
                <div className="flex-1 p-6 space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleWhatsAppContact}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{formatMobile(user.mobile)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Points:</span>
                <Badge variant="secondary" className="bg-primary text-white">
                  <Award className="w-3 h-3 mr-1" />
                  {user.totalPoints || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Scan QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Scan QR codes from construction product bags to earn points.
            </p>
            <Button 
              onClick={() => setLocation('/qr-scanner')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          </CardContent>
        </Card>

        {/* Quick Demo */}
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-medium text-gray-700">Quick Demo</h3>
              <p className="text-sm text-gray-500">
                Test the app functionality with demo data
              </p>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/qr-scanner')}
                className="w-full"
              >
                Demo QR Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;