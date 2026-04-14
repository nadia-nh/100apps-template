import { useState } from "react";
import { Link } from "react-router-dom";

export default function DiceRoll() {
	const [dice, setDice] = useState<number[]>([6]);
	const [count, setCount] = useState(1);
	const [sides, setSides] = useState(6);
	const [rolling, setRolling] = useState(false);

	const roll = () => {
		setRolling(true);
		setTimeout(() => {
			setDice(
				Array.from(
					{ length: count },
					() => Math.floor(Math.random() * sides) + 1,
				),
			);
			setRolling(false);
		}, 400);
	};

	const total = dice.reduce((a, b) => a + b, 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e1e24",
				color: "white",
				padding: "1.5rem",
				fontFamily: "system-ui",
				textAlign: "center",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.5)",
					textDecoration: "none",
				}}
			>
				← Back
			</Link>
			<h1 style={{ fontSize: "1.8rem", margin: "0 0 1rem" }}>Dice Roll</h1>
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					justifyContent: "center",
					marginBottom: "1.5rem",
				}}
			>
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						onClick={() => setCount(n)}
						style={{
							padding: "0.5rem 1rem",
							background: count === n ? "#f5576c" : "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							cursor: "pointer",
						}}
					>
						{n}
					</button>
				))}
			</div>
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					justifyContent: "center",
					marginBottom: "1.5rem",
				}}
			>
				{[4, 6, 8, 10, 12, 20].map((s) => (
					<button
						key={s}
						onClick={() => setSides(s)}
						style={{
							padding: "0.4rem 0.75rem",
							background: sides === s ? "#a855f7" : "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							fontSize: "0.85rem",
							cursor: "pointer",
						}}
					>
						d{s}
					</button>
				))}
			</div>
			<div
				onClick={roll}
				style={{
					display: "flex",
					gap: "1rem",
					justifyContent: "center",
					flexWrap: "wrap",
					marginBottom: "1.5rem",
					cursor: "pointer",
				}}
			>
				{dice.map((d, i) => (
					<div
						key={i}
						style={{
							width: 70,
							height: 70,
							background: rolling ? "rgba(255,255,255,0.2)" : "white",
							color: "#1e1e24",
							borderRadius: "0.75rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "2rem",
							fontWeight: 700,
							transform: rolling ? `rotate(${Math.random() * 360}deg)` : none,
							transition: "transform 0.4s",
						}}
					>
						{d}
					</div>
				))}
			</div>
			<div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#f5576c" }}>
				Total: {total}
			</div>
			<button
				onClick={roll}
				style={{
					marginTop: "1.5rem",
					padding: "1rem 3rem",
					background: "linear-gradient(135deg, #f5576c, #f093fb)",
					border: "none",
					borderRadius: "2rem",
					color: "white",
					fontSize: "1.1rem",
					fontWeight: 600,
					cursor: "pointer",
				}}
			>
				Roll
			</button>
		</div>
	);
}
