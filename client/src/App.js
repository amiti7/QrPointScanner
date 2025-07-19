import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Home from './pages/home.js';
import Login from './pages/login.js';
import OTPVerification from './pages/otp-verification.js';
import QRScanner from './pages/qr-scanner.js';
import QRValidation from './pages/qr-validation.js';
import Success from './pages/success.js';
import NotFound from './pages/not-found.js';
import ErrorPage from './pages/error.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Home} />
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