import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Resource {
	id: number;
	title: string;
	url: string;
	tags: string;
	status: "towatch" | "inprogress" | "completed";
	notes: string;
}

export default function LearnLink() {
	const [resources, setResources] = useState<Resource[]>(() => {
		const saved = localStorage.getItem("learn-links");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("learn-links", JSON.stringify(resources));
	}, [resources]);

	const addResource = (title: string, url: string, tags: string) => {
		setResources([
			{ id: Date.now(), title, url, tags, status: "towatch", notes: "" },
			...resources,
		]);
	};

	const updateStatus = (id: number, status: Resource["status"]) =>
		setResources(resources.map((r) => (r.id === id ? { ...r, status } : r)));
	const deleteResource = (id: number) =>
		setResources(resources.filter((r) => r.id !== id));

	const statusColors = {
		towatch: "#f59e0b",
		inprogress: "#3b82f6",
		completed: "#22c55e",
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0f172a",
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
					Learn Link
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Learning resource manager
				</p>

				<AddResourceForm onAdd={addResource} />

				{["towatch", "inprogress", "completed"].map((status) => {
					const filtered = resources.filter((r) => r.status === status);
					if (filtered.length === 0) return null;
					return (
						<div key={status}>
							<h3
								style={{
									textTransform: "capitalize",
									opacity: 0.7,
									marginTop: "1.5rem",
									marginBottom: "0.5rem",
								}}
							>
								{status === "towatch"
									? "To Watch"
									: status === "inprogress"
										? "In Progress"
										: "Completed"}
							</h3>
							{filtered.map((r) => (
								<div
									key={r.id}
									style={{
										background: "#1e293b",
										borderRadius: 12,
										padding: "1rem",
										marginBottom: "0.75rem",
										borderLeft: `4px solid ${statusColors[r.status]}`,
									}}
								>
									<div
										style={{ display: "flex", justifyContent: "space-between" }}
									>
										<a
											href={r.url}
											target="_blank"
											rel="noopener noreferrer"
											style={{
												color: "#60a5fa",
												textDecoration: "none",
												fontWeight: "bold",
											}}
										>
											{r.title}
										</a>
										<button
											onClick={() => deleteResource(r.id)}
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
									{r.tags && (
										<p
											style={{
												margin: "0.25rem 0 0",
												fontSize: "0.8rem",
												opacity: 0.6,
											}}
										>
											{r.tags}
										</p>
									)}
									<div
										style={{
											display: "flex",
											gap: "0.25rem",
											marginTop: "0.5rem",
										}}
									>
										{(["towatch", "inprogress", "completed"] as const).map(
											(s) => (
												<button
													key={s}
													onClick={() => updateStatus(r.id, s)}
													style={{
														padding: "0.25rem 0.5rem",
														borderRadius: 4,
														border: "none",
														background:
															r.status === s ? statusColors[s] : "#334155",
														color: "white",
														cursor: "pointer",
														fontSize: "0.7rem",
														textTransform: "capitalize",
													}}
												>
													{s === "towatch" ? "Watch" : s}
												</button>
											),
										)}
									</div>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AddResourceForm({
	onAdd,
}: {
	onAdd: (title: string, url: string, tags: string) => void;
}) {
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [tags, setTags] = useState("");
	return (
		<div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem" }}>
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#0f172a",
					color: "white",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="url"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				placeholder="URL"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#0f172a",
					color: "white",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="text"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				placeholder="Tags (comma separated)"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "none",
					background: "#0f172a",
					color: "white",
					marginBottom: "0.75rem",
				}}
			/>
			<button
				onClick={() => {
					if (title && url) {
						onAdd(title, url, tags);
						setTitle("");
						setUrl("");
						setTags("");
					}
				}}
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
				Add Resource
			</button>
		</div>
	);
}
