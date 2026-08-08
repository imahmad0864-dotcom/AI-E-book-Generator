import { Routes, Route } from "react-router-dom";


import Login from "./pages/login";
import Index from "./pages/index";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import CreateNew from "./pages/createNew";
import SiderBar from "./components/sidebar";
import ProtectedRoute from "./components/PortectedRoute";

function App() {
  return (
    <>
    <Routes>
        <Route index element={<Index/>}/>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>}/>

        <Route element={<ProtectedRoute><SiderBar/></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/new" element={<CreateNew/>} />
        </Route>
    </Routes>
    </>
  )
}

export default App
