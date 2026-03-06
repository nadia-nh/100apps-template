import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

// Create deterministic but seemingly random vibrant gradients based on an index
const getRandomGradient = (index: number) => {
	const hues = [
		[348, 83, 58], // Red/Pink
		[267, 73, 60], // Purple
		[200, 90, 50], // Blue
		[160, 65, 50], // Teal
		[35, 90, 55], // Orange
		[320, 80, 55], // Magenta
		[230, 80, 65], // Indigo
	];

	const baseHue = hues[index % hues.length];

	// slightly randomize the hue for uniqueness, using primes to scatter
	const h1 = (baseHue[0] + ((index * 17) % 30)) % 360;
	const h2 = (h1 + 45 + ((index * 11) % 40)) % 360;

	return {
		"--gradient-start": `hsl(${h1}, ${baseHue[1]}%, ${baseHue[2]}%)`,
		"--gradient-end": `hsl(${h2}, ${baseHue[1]}%, ${baseHue[2] - 15}%)`,
	} as React.CSSProperties;
};

function Gallery() {
	const apps = Array.from({ length: 100 }, (_, i) => ({
		id: i + 1,
		name: `App ${i + 1}`,
	}));

	return (
		<div className="gallery-container">
			<h1 className="gallery-header">[AUTHOR]'s entries - 100-App Challenge</h1>
			<div className="gallery-grid">
				{apps.map((app, i) => (
					<Link
						to={`/app-${app.id}`}
						key={app.id}
						className="app-card"
						style={getRandomGradient(i)}
					>
						<span className="app-number">{app.id}</span>
						<span className="app-title">{app.name}</span>
					</Link>
				))}
			</div>
		</div>
	);
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Gallery />} />
			<Route
				path="/:appId"
				element={
					<div style={{ color: "white", padding: "2rem" }}>App Placeholder</div>
				}
			/>
		</Routes>
	);
}

export default App;
