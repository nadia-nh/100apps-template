import { useState } from "react";
import { Link } from "react-router-dom";

const compliments = {
	friendly: [
		"You're genuinely wonderful.",
		"Your energy is contagious.",
		"You make the world brighter.",
	],
	professional: [
		"Your work ethic is inspiring.",
		"You're incredibly talented.",
		"You handle challenges gracefully.",
	],
	playful: [
		"You're fun personified!",
		"You have the best laugh.",
		"Your creativity is unmatched.",
	],
	heartfelt: [
		"You matter so much.",
		"Your kindness changes lives.",
		"You are enough.",
	],
};

export default function ComplimentBot() {
	const [category, setCategory] =
		useState<keyof typeof compliments>("friendly");
	const [history, setHistory] = useState<string[]>([]);

	const generate = () => {
		const list = compliments[category];
		const text = list[Math.floor(Math.random() * list.length)];
		setHistory([text, ...history.slice(0, 9)]);
		return text;
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
				color: "#2d3748",
				padding: "1.5rem",
				fontFamily: "system-ui,sans-serif",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(45,55,72,0.5)",
					textDecoration: "none",
					fontSize: "0.85rem",
				}}
			>
				← Back
			</Link>
			<div
				style={{
					textAlign: "center",
					maxWidth: 400,
					margin: "0 auto",
					paddingTop: "2rem",
				}}
			>
				<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✨</div>
				<h1
					style={{ fontSize: "1.8rem", margin: "0 0 0.5rem", fontWeight: 700 }}
				>
					Compliment Bot
				</h1>
				<p style={{ color: "rgba(45,55,72,0.6)", marginBottom: "2rem" }}>
					Spread some positivity
				</p>
				<div
					style={{
						display: "flex",
						gap: "0.5rem",
						marginBottom: "1.5rem",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{(Object.keys(compliments) as Array<keyof typeof compliments>).map(
						(cat) => (
							<button
								key={cat}
								onClick={() => setCategory(cat)}
								style={{
									padding: "0.5rem 1rem",
									background: category === cat ? "#4a5568" : "white",
									color: category === cat ? "white" : "#4a5568",
									border: "none",
									borderRadius: "1.5rem",
									cursor: "pointer",
									fontSize: "0.85rem",
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
								}}
							>
								{cat.charAt(0).toUpperCase() + cat.slice(1)}
							</button>
						),
					)}
				</div>
				<button
					onClick={() => generate()}
					style={{
						width: "100%",
						padding: "1.5rem",
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						color: "white",
						border: "none",
						borderRadius: "1rem",
						fontSize: "1.2rem",
						fontWeight: 600,
						cursor: "pointer",
						boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
						marginBottom: "1.5rem",
					}}
				>
					Generate Compliment
				</button>
				{history.length > 0 && (
					<div
						style={{
							background: "white",
							borderRadius: "1rem",
							padding: "1rem",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<p style={{ fontSize: "1.1rem", fontStyle: "italic", margin: 0 }}>
							"{history[0]}"
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
