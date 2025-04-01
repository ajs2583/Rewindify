// react app entry point
// filepath: c:\Users\Andrew\OneDrive\PersonalDev\Online Portfolio\Rewindify\frontend\src\index.js
import React from "react";
import ReactDOM from "react-dom/client"; // <-- correct import for React 18+
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
