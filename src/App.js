import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./Home";
import User1 from "./pages/User1";
import User2 from "./pages/User2";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user1" element={<User1/>} />
                <Route path="/user2" element={<User2 />} />X

            </Routes>
        </Router>
    )
}

export default App;