import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Skill {
	id: number;
	name: string;
	status: "learning" | "practicing" | "mastered";
	hours: number;
}

export default function SkillTree() {
	const [skills, setSkills] = useState<Skill[]>(() => {
		const saved = localStorage.getItem("skill-tree");
		return saved ? JSON.parse(saved) : [];
	});
	const [newSkill, setNewSkill] = useState("");
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		localStorage.setItem("skill-tree", JSON.stringify(skills));
	}, [skills]);

	const addSkill = () => {
		if (!newSkill.trim()) return;
		setSkills([
			...skills,
			{ id: Date.now(), name: newSkill, status: "learning", hours: 0 },
		]);
		setNewSkill("");
		setShowAdd(false);
	};

	const updateStatus = (id: number, status: Skill["status"]) => {
		setSkills(skills.map((s) => (s.id === id ? { ...s, status } : s)));
	};

	const addHour = (id: number) => {
		setSkills(
			skills.map((s) => (s.id === id ? { ...s, hours: s.hours + 1 } : s)),
		);
	};

	const deleteSkill = (id: number) => {
		setSkills(skills.filter((s) => s.id !== id));
	};

	const getStatusColor = (status: string) => {
		if (status === "mastered") return "#22c55e";
		if (status === "practicing") return "#3b82f6";
		return "#f59e0b";
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f0f23",
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
					color: "rgba(255,255,255,0.5)",
					textDecoration: "none",
				}}
			>
				← Gallery
			</Link>

			<div style={{ maxWidth: 600, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
					}}
				>
					Skill Tree
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track your skill development
				</p>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "1rem",
						marginBottom: "2rem",
					}}
				>
					<button
						onClick={() => setShowAdd(!showAdd)}
						style={{
							padding: "0.75rem 1.5rem",
							borderRadius: 8,
							border: "none",
							background: "#6366f1",
							color: "white",
							cursor: "pointer",
							fontWeight: "bold",
						}}
					>
						+ Add Skill
					</button>
				</div>

				{showAdd && (
					<div
						style={{
							background: "rgba(255,255,255,0.05)",
							padding: "1rem",
							borderRadius: 12,
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							placeholder="Skill name"
							value={newSkill}
							onChange={(e) => setNewSkill(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addSkill()}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid rgba(255,255,255,0.2)",
								background: "rgba(0,0,0,0.3)",
								color: "white",
								marginBottom: "0.75rem",
							}}
						/>
						<button
							onClick={addSkill}
							style={{
								padding: "0.5rem 1rem",
								borderRadius: 6,
								border: "none",
								background: "#22c55e",
								color: "white",
								cursor: "pointer",
							}}
						>
							Add
						</button>
					</div>
				)}

				{skills.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.4 }}>
						No skills yet. Add your first skill!
					</p>
				)}

				{skills.map((skill) => (
					<div
						key={skill.id}
						style={{
							background: "rgba(255,255,255,0.03)",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							borderLeft: `4px solid ${getStatusColor(skill.status)}`,
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>
								<h3 style={{ margin: 0, fontSize: "1.1rem" }}>{skill.name}</h3>
								<p
									style={{
										margin: "0.25rem 0 0",
										opacity: 0.5,
										fontSize: "0.85rem",
									}}
								>
									{skill.hours} hours
								</p>
							</div>
							<div style={{ display: "flex", gap: "0.5rem" }}>
								<button
									onClick={() => addHour(skill.id)}
									style={{
										padding: "0.4rem 0.75rem",
										borderRadius: 6,
										border: "none",
										background: "rgba(255,255,255,0.1)",
										color: "white",
										cursor: "pointer",
									}}
								>
									+1h
								</button>
								<button
									onClick={() => deleteSkill(skill.id)}
									style={{
										padding: "0.4rem 0.75rem",
										borderRadius: 6,
										border: "none",
										background: "rgba(239,68,68,0.2)",
										color: "#ef4444",
										cursor: "pointer",
									}}
								>
									×
								</button>
							</div>
						</div>
						<div
							style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
						>
							{(["learning", "practicing", "mastered"] as const).map(
								(status) => (
									<button
										key={status}
										onClick={() => updateStatus(skill.id, status)}
										style={{
											flex: 1,
											padding: "0.4rem",
											borderRadius: 6,
											border: "none",
											background:
												skill.status === status
													? getStatusColor(status)
													: "rgba(255,255,255,0.1)",
											color:
												skill.status === status
													? "white"
													: "rgba(255,255,255,0.5)",
											cursor: "pointer",
											fontSize: "0.75rem",
											textTransform: "capitalize",
										}}
									>
										{status}
									</button>
								),
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
