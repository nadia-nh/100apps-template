import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Idea {
	id: number;
	text: string;
	category: string;
	date: string;
}

export default function SomedayMaybe() {
	const [ideas, setIdeas] = useState<Idea[]>(() => {
		const saved = localStorage.getItem("someday");
		return saved ? JSON.parse(saved) : [];
	});
	const [newIdea, setNewIdea] = useState("");
	const [category, setCategory] = useState("Fun");

	const categories = ["Fun", "Learning", "Travel", "Creative", "Other"];

	useEffect(() => {
		localStorage.setItem("someday", JSON.stringify(ideas));
	}, [ideas]);

	const add = () => {
		if (!newIdea.trim()) return;
		setIdeas([
			...ideas,
			{
				id: Date.now(),
				text: newIdea,
				category,
				date: new Date().toISOString().split("T")[0],
			},
		]);
		setNewIdea("");
	};
	const deleteIdea = (id: number) => setIdeas(ideas.filter((i) => i.id !== id));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f3e8ff",
				color: "#1f2937",
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
					color: "rgba(31,41,55,0.5)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>
			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Someday Maybe
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Ideas to do someday
				</p>

				<div
					style={{
						background: "white",
						borderRadius: 12,
						padding: "1rem",
						marginBottom: "1.5rem",
						boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
					}}
				>
					<input
						type="text"
						value={newIdea}
						onChange={(e) => setNewIdea(e.target.value)}
						placeholder="Someday idea..."
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "1px solid #e9d5ff",
							marginBottom: "0.5rem",
						}}
					/>
					<div
						style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
					>
						{categories.map((c) => (
							<button
								key={c}
								onClick={() => setCategory(c)}
								style={{
									flex: 1,
									padding: "0.5rem",
									borderRadius: 6,
									border: "none",
									background: category === c ? "#a855f7" : "#f3e8ff",
									color: category === c ? "white" : "#7c3aed",
									cursor: "pointer",
									fontSize: "0.85rem",
								}}
							>
								{c}
							</button>
						))}
					</div>
					<button
						onClick={add}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#a855f7",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Add Idea
					</button>
				</div>

				{categories.map((cat) => {
					const catIdeas = ideas.filter((i) => i.category === cat);
					if (catIdeas.length === 0) return null;
					return (
						<div key={cat} style={{ marginBottom: "1rem" }}>
							<h3 style={{ opacity: 0.7, marginBottom: "0.5rem" }}>
								{cat} ({catIdeas.length})
							</h3>
							{catIdeas.map((i) => (
								<div
									key={i.id}
									style={{
										background: "white",
										borderRadius: 12,
										padding: "1rem",
										marginBottom: "0.5rem",
										boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<span>{i.text}</span>
									<button
										onClick={() => deleteIdea(i.id)}
										style={{
											background: "none",
											border: "none",
											color: "#ef4444",
											cursor: "pointer",
										}}
									>
										×
									</button>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
