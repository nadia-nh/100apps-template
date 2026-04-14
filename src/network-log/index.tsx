import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Contact {
	id: number;
	name: string;
	where: string;
	date: string;
	notes: string;
	interests: string;
}

export default function NetworkLog() {
	const [contacts, setContacts] = useState<Contact[]>(() => {
		const saved = localStorage.getItem("network-log");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("network-log", JSON.stringify(contacts));
	}, [contacts]);

	const addContact = (
		name: string,
		where: string,
		notes: string,
		interests: string,
	) => {
		setContacts([
			{
				id: Date.now(),
				name,
				where,
				date: new Date().toISOString().split("T")[0],
				notes,
				interests,
			},
			...contacts,
		]);
	};

	const addNote = (id: number, note: string) =>
		setContacts(
			contacts.map((c) =>
				c.id === id ? { ...c, notes: c.notes + "\n" + note } : c,
			),
		);

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f1f5f9",
				color: "#1e293b",
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
					color: "rgba(30,41,59,0.5)",
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
					Network Log
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Track people you meet
				</p>

				<AddContactForm onAdd={addContact} />

				{contacts.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No contacts yet
					</p>
				)}
				{contacts.map((contact) => (
					<div
						key={contact.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginTop: "1rem",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<p
									style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}
								>
									{contact.name}
								</p>
								<p
									style={{
										margin: "0.25rem 0",
										fontSize: "0.85rem",
										opacity: 0.6,
									}}
								>
									{contact.where} · {contact.date}
								</p>
							</div>
						</div>
						{contact.interests && (
							<p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
								💡 {contact.interests}
							</p>
						)}
						{contact.notes && (
							<p
								style={{
									margin: "0.5rem 0 0",
									fontSize: "0.85rem",
									opacity: 0.7,
									whiteSpace: "pre-wrap",
								}}
							>
								{contact.notes}
							</p>
						)}
						<AddNoteForm onAdd={(note) => addNote(contact.id, note)} />
					</div>
				))}
			</div>
		</div>
	);
}

function AddContactForm({
	onAdd,
}: {
	onAdd: (
		name: string,
		where: string,
		notes: string,
		interests: string,
	) => void;
}) {
	const [name, setName] = useState("");
	const [where, setWhere] = useState("");
	const [notes, setNotes] = useState("");
	const [interests, setInterests] = useState("");
	return (
		<div
			style={{
				background: "white",
				borderRadius: 12,
				padding: "1rem",
				boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
			}}
		>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e2e8f0",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="text"
				value={where}
				onChange={(e) => setWhere(e.target.value)}
				placeholder="Where did you meet?"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e2e8f0",
					marginBottom: "0.5rem",
				}}
			/>
			<input
				type="text"
				value={interests}
				onChange={(e) => setInterests(e.target.value)}
				placeholder="Their interests"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e2e8f0",
					marginBottom: "0.5rem",
				}}
			/>
			<textarea
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				placeholder="Notes"
				style={{
					width: "100%",
					padding: "0.75rem",
					borderRadius: 8,
					border: "1px solid #e2e8f0",
					marginBottom: "0.75rem",
					resize: "none",
					height: 60,
				}}
			/>
			<button
				onClick={() => {
					if (name && where) {
						onAdd(name, where, notes, interests);
						setName("");
						setWhere("");
						setNotes("");
						setInterests("");
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
				Add Contact
			</button>
		</div>
	);
}

function AddNoteForm({ onAdd }: { onAdd: (note: string) => void }) {
	const [note, setNote] = useState("");
	return (
		<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
			<input
				type="text"
				value={note}
				onChange={(e) => setNote(e.target.value)}
				placeholder="Add note..."
				style={{
					flex: 1,
					padding: "0.5rem",
					borderRadius: 6,
					border: "1px solid #e2e8f0",
					fontSize: "0.85rem",
				}}
			/>
			<button
				onClick={() => {
					onAdd(note);
					setNote("");
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
