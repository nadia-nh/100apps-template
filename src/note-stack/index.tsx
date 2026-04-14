import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Note {
	id: number;
	text: string;
	timestamp: string;
	archived: boolean;
}

export default function NoteStack() {
	const [notes, setNotes] = useState<Note[]>(() => {
		const saved = localStorage.getItem("note-stack");
		return saved ? JSON.parse(saved) : [];
	});
	const [newNote, setNewNote] = useState("");
	const [showArchived, setShowArchived] = useState(false);

	useEffect(() => {
		localStorage.setItem("note-stack", JSON.stringify(notes));
	}, [notes]);

	const addNote = () => {
		if (!newNote.trim()) return;
		setNotes([
			{
				id: Date.now(),
				text: newNote,
				timestamp: new Date().toISOString(),
				archived: false,
			},
			...notes,
		]);
		setNewNote("");
	};

	const archiveNote = (id: number) => {
		setNotes(
			notes.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)),
		);
	};

	const deleteNote = (id: number) => {
		setNotes(notes.filter((n) => n.id !== id));
	};

	const activeNotes = notes.filter((n) => !n.archived);
	const archivedNotes = notes.filter((n) => n.archived);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#1c1917",
				color: "white",
				padding: "2rem",
				fontFamily: "'Georgia', serif",
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

			<div style={{ maxWidth: 500, margin: "0 auto", paddingTop: "2rem" }}>
				<h1
					style={{
						fontSize: "1.8rem",
						textAlign: "center",
						marginBottom: "0.5rem",
						fontWeight: "normal",
					}}
				>
					Note Stack
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Quick capture for fleeting thoughts
				</p>

				<div
					style={{
						background: "#292524",
						borderRadius: 16,
						padding: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<textarea
						placeholder="What's on your mind?"
						value={newNote}
						onChange={(e) => setNewNote(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && addNote()}
						style={{
							width: "100%",
							padding: "0.75rem",
							borderRadius: 8,
							border: "none",
							background: "#1c1917",
							color: "white",
							fontSize: "1rem",
							resize: "none",
							height: 80,
							fontFamily: "inherit",
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "0.75rem",
						}}
					>
						<span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
							Ctrl+Enter to save
						</span>
						<button
							onClick={addNote}
							style={{
								padding: "0.5rem 1rem",
								borderRadius: 6,
								border: "none",
								background: "#fafaf9",
								color: "#1c1917",
								cursor: "pointer",
								fontWeight: "bold",
							}}
						>
							Stack It
						</button>
					</div>
				</div>

				{activeNotes.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, fontStyle: "italic" }}>
						Stack is empty
					</p>
				)}

				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
				>
					{activeNotes.map((note) => (
						<div
							key={note.id}
							style={{
								background: "#292524",
								borderRadius: 12,
								padding: "1rem",
								position: "relative",
								animation: "slideIn 0.2s ease",
							}}
						>
							<p style={{ margin: 0, lineHeight: 1.5 }}>{note.text}</p>
							<p
								style={{
									margin: "0.5rem 0 0",
									fontSize: "0.75rem",
									opacity: 0.4,
								}}
							>
								{new Date(note.timestamp).toLocaleString()}
							</p>
							<div
								style={{
									position: "absolute",
									top: "0.5rem",
									right: "0.5rem",
									display: "flex",
									gap: "0.25rem",
								}}
							>
								<button
									onClick={() => archiveNote(note.id)}
									style={{
										padding: "0.25rem 0.5rem",
										borderRadius: 4,
										border: "none",
										background: "rgba(255,255,255,0.1)",
										color: "rgba(255,255,255,0.5)",
										cursor: "pointer",
										fontSize: "0.7rem",
									}}
								>
									Archive
								</button>
								<button
									onClick={() => deleteNote(note.id)}
									style={{
										padding: "0.25rem 0.5rem",
										borderRadius: 4,
										border: "none",
										background: "rgba(239,68,68,0.2)",
										color: "#ef4444",
										cursor: "pointer",
										fontSize: "0.7rem",
									}}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>

				{archivedNotes.length > 0 && (
					<button
						onClick={() => setShowArchived(!showArchived)}
						style={{
							marginTop: "2rem",
							background: "transparent",
							border: "1px solid rgba(255,255,255,0.2)",
							color: "rgba(255,255,255,0.5)",
							padding: "0.75rem",
							borderRadius: 8,
							cursor: "pointer",
							width: "100%",
						}}
					>
						{showArchived ? "Hide" : "Show"} Archived ({archivedNotes.length})
					</button>
				)}

				{showArchived &&
					archivedNotes.map((note) => (
						<div
							key={note.id}
							style={{
								background: "rgba(255,255,255,0.02)",
								borderRadius: 12,
								padding: "1rem",
								marginTop: "0.75rem",
								opacity: 0.5,
							}}
						>
							<p style={{ margin: 0 }}>{note.text}</p>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginTop: "0.5rem",
								}}
							>
								<button
									onClick={() => archiveNote(note.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "#22c55e",
										cursor: "pointer",
										fontSize: "0.8rem",
									}}
								>
									Restore
								</button>
								<button
									onClick={() => deleteNote(note.id)}
									style={{
										background: "transparent",
										border: "none",
										color: "#ef4444",
										cursor: "pointer",
										fontSize: "0.8rem",
									}}
								>
									Delete
								</button>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
