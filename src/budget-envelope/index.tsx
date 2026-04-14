import { useState } from "react";
import { Link } from "react-router-dom";

interface Envelope {
	id: string;
	name: string;
	budget: number;
	spent: number;
}

export default function BudgetEnvelope() {
	const [envelopes, setEnvelopes] = useState<Envelope[]>(() => {
		const s = localStorage.getItem("budget-envelopes");
		return s ? JSON.parse(s) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [newEnv, setNewEnv] = useState({ name: "", budget: 0 });

	useState(() => {
		localStorage.setItem("budget-envelopes", JSON.stringify(envelopes));
	});

	const add = () => {
		if (newEnv.name) {
			setEnvelopes([
				...envelopes,
				{ ...newEnv, id: Date.now().toString(), spent: 0 },
			]);
			setNewEnv({ name: "", budget: 0 });
			setShowAdd(false);
		}
	};
	const spend = (id: string, amount: number) =>
		setEnvelopes(
			envelopes.map((e) =>
				e.id === id ? { ...e, spent: e.spent + amount } : e,
			),
		);
	const totalBudget = envelopes.reduce((s, e) => s + e.budget, 0);
	const totalSpent = envelopes.reduce((s, e) => s + e.spent, 0);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1a1a2e",
				color: "#e0e0e0",
				padding: "1.5rem",
				fontFamily: "system-ui",
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
			<div style={{ textAlign: "center", marginBottom: "2rem" }}>
				<h1 style={{ fontSize: "1.8rem", margin: 0 }}>Budget Envelopes</h1>
				<p style={{ color: "rgba(255,255,255,0.5)" }}>
					${totalSpent} / ${totalBudget}
				</p>
			</div>
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
				{envelopes.map((e) => {
					const pct = (e.spent / e.budget) * 100;
					return (
						<div
							key={e.id}
							style={{
								flex: 1,
								background: "rgba(255,255,255,0.05)",
								borderRadius: "0.75rem",
								padding: "1rem",
								position: "relative",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									height: `${Math.min(pct, 100)}%`,
									background: pct > 100 ? "#ef4444" : "#22c55e",
									opacity: 0.3,
									transition: "height 0.3s",
								}}
							/>
							<div style={{ position: "relative" }}>
								<h3 style={{ margin: 0, fontSize: "0.9rem" }}>{e.name}</h3>
								<p
									style={{
										margin: "0.25rem 0",
										fontSize: "1.2rem",
										fontWeight: 700,
									}}
								>
									${e.spent}
								</p>
								<p
									style={{
										margin: 0,
										fontSize: "0.75rem",
										color: "rgba(255,255,255,0.4)",
									}}
								>
									of ${e.budget}
								</p>
							</div>
							<button
								onClick={() => spend(e.id, 10)}
								style={{
									marginTop: "0.5rem",
									padding: "0.25rem 0.5rem",
									background: "rgba(255,255,255,0.1)",
									border: "none",
									borderRadius: "0.25rem",
									color: "white",
									fontSize: "0.75rem",
									cursor: "pointer",
								}}
							>
								+ $10
							</button>
						</div>
					);
				})}
			</div>
			{showAdd && (
				<div
					style={{
						background: "rgba(255,255,255,0.05)",
						borderRadius: "0.75rem",
						padding: "1rem",
						marginBottom: "1rem",
					}}
				>
					<input
						placeholder="Name"
						value={newEnv.name}
						onChange={(e) => setNewEnv({ ...newEnv, name: e.target.value })}
						style={{
							width: "calc(50% - 0.5rem)",
							padding: "0.5rem",
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							marginRight: "1rem",
						}}
					/>
					<input
						type="number"
						placeholder="Budget"
						value={newEnv.budget || ""}
						onChange={(e) =>
							setNewEnv({ ...newEnv, budget: parseInt(e.target.value) || 0 })
						}
						style={{
							width: "calc(50% - 0.5rem)",
							padding: "0.5rem",
							background: "rgba(255,255,255,0.1)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
						}}
					/>
					<button
						onClick={add}
						style={{
							width: "100%",
							marginTop: "0.75rem",
							padding: "0.75rem",
							background: "#22c55e",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Add Envelope
					</button>
				</div>
			)}
			<button
				onClick={() => setShowAdd(!showAdd)}
				style={{
					width: "100%",
					padding: "1rem",
					background: "rgba(255,255,255,0.05)",
					border: "2px dashed rgba(255,255,255,0.2)",
					borderRadius: "0.75rem",
					color: "rgba(255,255,255,0.5)",
					cursor: "pointer",
				}}
			>
				+ Add Envelope
			</button>
		</div>
	);
}
