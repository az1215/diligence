import { FC } from "react";
import Main from "./componenets/Main";
import SignIn from "./componenets/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Info from "./componenets/Info";
import Diligence from "./componenets/Diligence";
import PatternRegist from "./componenets/PatternRegist";
import { lazy } from "react";

// const Diligence = lazy(() => import("./componenets/Diligence"));
// const PatternRegist = lazy(() => import("./componenets/PatternRegist"));

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/login`} Component={SignIn} />
        <Route path={`/`} Component={Main}>
          <Route index Component={Info} />
          <Route path="/diligence" Component={Diligence} />
          <Route path="/patternRegist" Component={PatternRegist} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
