import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from 'react-redux';
import { store } from './store';
import Login from "@/pages/login";
import OTPVerification from "@/pages/otp-verification";
import Home from "@/pages/home";
import QRScanner from "@/pages/qr-scanner";
import QRValidation from "@/pages/qr-validation";
import Success from "@/pages/success";
import ErrorPage from "@/pages/error";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/otp" component={OTPVerification} />
      <Route path="/home" component={Home} />
      <Route path="/scan" component={QRScanner} />
      <Route path="/validate" component={QRValidation} />
      <Route path="/success" component={Success} />
      <Route path="/error" component={ErrorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden mobile-container">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
