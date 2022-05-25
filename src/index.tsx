import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClientProvider} from "react-query";

import "./index.css";
import "./others/contexts/i18n";
import reportWebVitals from "./reportWebVitals";

import {AuthWrapper} from "./others/components/AuthWrapper";
import {queryClient} from "./others/contexts/api";
import {AuthProvider} from "./others/contexts/auth";
import {FormContextProvider} from "./others/contexts/form";
import {Contact} from "./pages/contact";
import {Home} from "./pages/home";
import {Locator} from "./pages/locator";
import {Login} from "./pages/login";
import {Orders} from "./pages/orders";
import {NotFound} from "./pages/notFound";
import {Review} from "./pages/review";
import {Success} from "./pages/success";
import {Supplies} from "./pages/supplies";
import {Supplies2} from "./pages/supplies2";
import {Logout} from "./pages/logout";
import {ResetPassword} from "./pages/resetPassword";

const Providers: React.FunctionComponent = ({children}) => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <FormContextProvider>{children}</FormContextProvider>
    </QueryClientProvider>
  </AuthProvider>
);

const AppWithRouter: React.FunctionComponent = () => {
  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_ID as string);
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locator" element={<Locator />} />
          <Route path="/review" element={<Review />} />
          <Route path="/success" element={<Success />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/supplies2" element={<Supplies2 />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<AuthWrapper />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
};

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <AppWithRouter />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
