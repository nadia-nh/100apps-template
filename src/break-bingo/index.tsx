import { useState } from "react";
import { Link } from "react-router-dom";

const activities = [
	"Neck stretch",
	"Shoulder roll",
	"Deep breath",
	"Stand up",
	"Walk around",
	"Eye rest (20s)",
	"Hand stretch",
	"Squat",
	"Wall push-up",
	"Drink water",
	"Look out window",
	"Mini meditation",
];

export default function BreakBingo() {
	const [grid, setGrid] = useState<string[]>(() => {
		const shuffled = [...activities].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 9);
	});
	const [marked, setMarked] = useState<number[]>([]);

	const toggle = (i: number) =>
		setMarked(
			marked.includes(i) ? marked.filter((x) => x !== i) : [...marked, i],
		);
	const bingo = [0, 1, 2, 3, 4, 5, 6, 7, 8].some((pattern) => {
		const wins = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		return wins.some((w) => w.every((x) => marked.includes(x)));
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
				color: "white",
				padding: "2rem",
				fontFamily: "system-ui",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.7)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>
			<div
				style={{
					maxWidth: 400,
					margin: "0 auto",
					paddingTop: "2rem",
					textAlign: "center",
				}}
			>
				<h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
					Break Bingo
				</h1>
				<p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
					Micro-break activities
				</p>

				{bingo && (
					<div
						style={{
							background: "#fff",
							color: "#ec4899",
							padding: "1rem",
							borderRadius: 12,
							marginBottom: "1rem",
							fontWeight: "bold",
						}}
					>
						🎉 BINGO! 🎉
					</div>
				)}

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "0.5rem",
						marginBottom: "1.5rem",
					}}
				>
					{grid.map((activity, i) => (
						<div
							key={i}
							onClick={() => toggle(i)}
							style={{
								background: marked.includes(i)
									? "#fff"
									: "rgba(255,255,255,0.15)",
								borderRadius: 12,
								padding: "0.75rem",
								cursor: "pointer",
								minHeight: 80,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
								fontSize: "0.8rem",
								color: marked.includes(i) ? "#ec4899" : "white",
								transition: "all 0.2s",
								transform: marked.includes(i) ? "scale(0.95)" : "none",
							}}
						>
							{activity}
						</div>
					))}
				</div>

				<button
					onClick={() => {
						setGrid(
							[...activities].sort(() => Math.random() - 0.5).slice(0, 9),
						);
						setMarked([]);
					}}
					style={{
						padding: "0.75rem 1.5rem",
						borderRadius: 8,
						border: "none",
						background: "#fff",
						color: "#ec4899",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					New Board
				</button>
			</div>
		</div>
	);
}
