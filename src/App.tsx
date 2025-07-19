import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import OTPVerification from './pages/otp-verification';
import QRScanner from './pages/qr-scanner';
import QRValidation from './pages/qr-validation';
import Success from './pages/success';
import NotFound from './pages/not-found';
import ErrorPage from './pages/error';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/otp-verification" component={OTPVerification} />
          <Route path="/qr-scanner" component={QRScanner} />
          <Route path="/qr-validation" component={QRValidation} />
          <Route path="/success" component={Success} />
          <Route path="/error" component={ErrorPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;