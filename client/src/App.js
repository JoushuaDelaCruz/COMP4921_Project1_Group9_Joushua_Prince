import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<div> hi! </div>}></Route>
        <Route path="/home" exact element={<div> Hello world! </div>} />
        <Route path="/login" exact element={<Login />}></Route>
        <Route path="/signup" exact element={<Signup />}></Route>
        <Route path="*" element={<div> 404 </div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
