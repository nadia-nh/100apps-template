import { useState } from "react";
import { Link } from "react-router-dom";

export default function CoinFlip() {
	const [flipping, setFlipping] = useState(false);
	const [result, setResult] = useState<"heads" | "tails" | null>(null);
	const [count, setCount] = useState({ heads: 0, tails: 0 });

	const flip = () => {
		setFlipping(true);
		setTimeout(() => {
			const r = Math.random() > 0.5 ? "heads" : "tails";
			setResult(r);
			setCount((c) => ({ ...c, [r]: c[r] + 1 }));
			setFlipping(false);
		}, 600);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f0f0f",
				color: "white",
				padding: "1.5rem",
				fontFamily: "system-ui",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
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
			<div
				onClick={flip}
				style={{
					width: 200,
					height: 200,
					borderRadius: "50%",
					background: flipping
						? "linear-gradient(135deg, #ffd700, #ffaa00)"
						: result === "heads"
							? "linear-gradient(135deg, #ffd700, #ffaa00)"
							: "linear-gradient(135deg, #c0c0c0, #808080)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "3rem",
					fontWeight: 700,
					cursor: "pointer",
					boxShadow: flipping
						? "0 0 60px rgba(255,215,0,0.6)"
						: "0 10px 40px rgba(0,0,0,0.5)",
					transform: flipping ? "rotateY(720deg)" : "none",
					transition: "all 0.6s ease",
				}}
			>
				{flipping
					? "?"
					: result === "heads"
						? "H"
						: result === "tails"
							? "T"
							: "?"}
			</div>
			<p style={{ marginTop: "2rem", fontSize: "1.2rem" }}>
				{result ? (result === "heads" ? "Heads" : "Tails") : "Tap to flip"}
			</p>
			<div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
				<div style={{ textAlign: "center" }}>
					<span style={{ fontSize: "2rem", fontWeight: 700 }}>
						{count.heads}
					</span>
					<br />
					<span style={{ color: "rgba(255,255,255,0.5)" }}>Heads</span>
				</div>
				<div style={{ textAlign: "center" }}>
					<span style={{ fontSize: "2rem", fontWeight: 700 }}>
						{count.tails}
					</span>
					<br />
					<span style={{ color: "rgba(255,255,255,0.5)" }}>Tails</span>
				</div>
			</div>
		</div>
	);
}
