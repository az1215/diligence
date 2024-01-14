import { FC } from "react";
import Main from "./componenets/Main";
import SignIn from "./componenets/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} Component={SignIn} />
        <Route path={`/main`} Component={Main} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
