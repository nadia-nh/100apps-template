import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Milestone {
	id: number;
	text: string;
	date?: string;
	completed: boolean;
}

interface Project {
	id: number;
	name: string;
	targetDate?: string;
	milestones: Milestone[];
}

export default function ProjectOutline() {
	const [projects, setProjects] = useState<Project[]>(() => {
		const saved = localStorage.getItem("projects");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [newProject, setNewProject] = useState("");

	useEffect(() => {
		localStorage.setItem("projects", JSON.stringify(projects));
	}, [projects]);

	const addProject = () => {
		if (!newProject.trim()) return;
		setProjects([
			...projects,
			{ id: Date.now(), name: newProject, milestones: [] },
		]);
		setNewProject("");
		setShowAdd(false);
	};
	const addMilestone = (projectId: number, text: string) =>
		setProjects(
			projects.map((p) =>
				p.id === projectId
					? {
							...p,
							milestones: [
								...p.milestones,
								{ id: Date.now(), text, completed: false },
							],
						}
					: p,
			),
		);
	const toggleMilestone = (projectId: number, milestoneId: number) =>
		setProjects(
			projects.map((p) =>
				p.id === projectId
					? {
							...p,
							milestones: p.milestones.map((m) =>
								m.id === milestoneId ? { ...m, completed: !m.completed } : m,
							),
						}
					: p,
			),
		);
	const deleteProject = (id: number) =>
		setProjects(projects.filter((p) => p.id !== id));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1e293b",
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
					Project Outline
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Lightweight project planner
				</p>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "2px dashed rgba(255,255,255,0.2)",
						background: "transparent",
						color: "white",
						cursor: "pointer",
						marginBottom: "1.5rem",
					}}
				>
					+ New Project
				</button>

				{showAdd && (
					<div
						style={{
							background: "#334155",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1.5rem",
						}}
					>
						<input
							type="text"
							value={newProject}
							onChange={(e) => setNewProject(e.target.value)}
							placeholder="Project name"
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#1e293b",
								color: "white",
								marginBottom: "0.75rem",
							}}
						/>
						<button
							onClick={addProject}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#3b82f6",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Create
						</button>
					</div>
				)}

				{projects.map((project) => {
					const completed = project.milestones.filter(
						(m) => m.completed,
					).length;
					const progress = project.milestones.length
						? (completed / project.milestones.length) * 100
						: 0;
					return (
						<div
							key={project.id}
							style={{
								background: "#334155",
								borderRadius: 16,
								padding: "1.5rem",
								marginBottom: "1rem",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
								}}
							>
								<div>
									<h3 style={{ margin: 0, fontSize: "1.2rem" }}>
										{project.name}
									</h3>
									<p
										style={{
											margin: "0.25rem 0 0",
											fontSize: "0.85rem",
											opacity: 0.6,
										}}
									>
										{completed} / {project.milestones.length} milestones
									</p>
								</div>
								<button
									onClick={() => deleteProject(project.id)}
									style={{
										background: "none",
										border: "none",
										color: "rgba(255,255,255,0.3)",
										cursor: "pointer",
									}}
								>
									×
								</button>
							</div>
							<div
								style={{
									height: 6,
									background: "#1e293b",
									borderRadius: 3,
									marginTop: "1rem",
									overflow: "hidden",
								}}
							>
								<div
									style={{
										width: `${progress}%`,
										height: "100%",
										background: "#3b82f6",
										transition: "width 0.3s",
									}}
								/>
							</div>
							{project.milestones.map((m) => (
								<div
									key={m.id}
									onClick={() => toggleMilestone(project.id, m.id)}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
										padding: "0.5rem",
										marginTop: "0.5rem",
										background: m.completed
											? "rgba(59,130,246,0.2)"
											: "rgba(255,255,255,0.05)",
										borderRadius: 8,
										cursor: "pointer",
									}}
								>
									<span
										style={{
											width: 16,
											height: 16,
											borderRadius: "50%",
											border: `2px solid ${m.completed ? "#3b82f6" : "#64748b"}`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "0.7rem",
										}}
									>
										{m.completed && "✓"}
									</span>
									<span
										style={{
											textDecoration: m.completed ? "line-through" : "none",
											opacity: m.completed ? 0.5 : 1,
										}}
									>
										{m.text}
									</span>
								</div>
							))}
							<MilestoneInput
								onAdd={(text) => addMilestone(project.id, text)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function MilestoneInput({ onAdd }: { onAdd: (text: string) => void }) {
	const [text, setText] = useState("");
	return (
		<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Add milestone"
				onKeyDown={(e) => e.key === "Enter" && (onAdd(text), setText(""))}
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 6,
					border: "1px solid rgba(255,255,255,0.2)",
					background: "transparent",
					color: "white",
					fontSize: "0.9rem",
				}}
			/>
			<button
				onClick={() => {
					onAdd(text);
					setText("");
				}}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: 6,
					border: "none",
					background: "#3b82f6",
					color: "white",
					cursor: "pointer",
				}}
			>
				+
			</button>
		</div>
	);
}
