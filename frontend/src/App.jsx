import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import "./styles/main.css";
import Navbar from "./components/Navbar";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/home" element={<Home />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
			</Routes>
		</Router>
	);
}

export default App;
