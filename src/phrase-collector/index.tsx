import { useState } from "react";
import { Link } from "react-router-dom";

interface Phrase {
	id: string;
	phrase: string;
	lang: string;
	translation: string;
	pronunciation: string;
}

export default function PhraseCollector() {
	const [phrases, setPhrases] = useState<Phrase[]>(() => {
		const s = localStorage.getItem("phrases");
		return s ? JSON.parse(s) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [newP, setNewP] = useState({
		phrase: "",
		lang: "Spanish",
		translation: "",
		pronunciation: "",
	});

	const save = () => {
		if (newP.phrase) {
			setPhrases([...phrases, { ...newP, id: Date.now().toString() }]);
			localStorage.setItem(
				"phrases",
				JSON.stringify([...phrases, { ...newP, id: Date.now().toString() }]),
			);
			setNewP({
				phrase: "",
				lang: "Spanish",
				translation: "",
				pronunciation: "",
			});
			setShowAdd(false);
		}
	};
	const speak = (text: string) => {
		const u = new SpeechSynthesisUtterance(text);
		u.lang = "es-ES";
		speechSynthesis.speak(u);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)",
				color: "white",
				padding: "1.5rem",
				fontFamily: " system-ui",
			}}
		>
			<Link
				to="/"
				style={{
					position: "fixed",
					top: "1rem",
					left: "1rem",
					color: "rgba(255,255,255,0.6)",
					textDecoration: "none",
				}}
			>
				← Back
			</Link>
			<h1
				style={{
					textAlign: "center",
					fontSize: "1.8rem",
					margin: "0 0 0.5rem",
				}}
			>
				Phrase Collector
			</h1>
			<p
				style={{
					textAlign: "center",
					color: "rgba(255,255,255,0.6)",
					marginBottom: "1.5rem",
				}}
			>
				Useful phrases in different languages
			</p>
			{phrases.map((p) => (
				<div
					key={p.id}
					style={{
						background: "rgba(255,255,255,0.1)",
						borderRadius: "0.75rem",
						padding: "1rem",
						marginBottom: "0.75rem",
						backdropFilter: "blur(10px)",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
							{p.phrase}
						</span>
						<button
							onClick={() => speak(p.phrase)}
							style={{
								background: "none",
								border: "none",
								fontSize: "1.2rem",
								cursor: "pointer",
							}}
						>
							🔊
						</button>
					</div>
					<p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.7)" }}>
						{p.translation}
					</p>
					<p
						style={{
							margin: "0.25rem 0 0",
							fontSize: "0.8rem",
							color: "rgba(255,255,255,0.5)",
							fontStyle: "italic",
						}}
					>
						{p.pronunciation}
					</p>
					<span
						style={{
							fontSize: "0.7rem",
							background: "rgba(255,255,255,0.2)",
							padding: "0.2rem 0.5rem",
							borderRadius: "1rem",
						}}
					>
						{p.lang}
					</span>
				</div>
			))}
			{showAdd && (
				<div
					style={{
						background: "rgba(255,255,255,0.1)",
						borderRadius: "0.75rem",
						padding: "1rem",
						marginBottom: "1rem",
					}}
				>
					<input
						placeholder="Phrase"
						value={newP.phrase}
						onChange={(e) => setNewP({ ...newP, phrase: e.target.value })}
						style={{
							width: "100%",
							padding: "0.6rem",
							background: "rgba(255,255,255,0.15)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							marginBottom: "0.5rem",
						}}
					/>
					<input
						placeholder="Translation"
						value={newP.translation}
						onChange={(e) => setNewP({ ...newP, translation: e.target.value })}
						style={{
							width: "100%",
							padding: "0.6rem",
							background: "rgba(255,255,255,0.15)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							marginBottom: "0.5rem",
						}}
					/>
					<input
						placeholder="Pronunciation"
						value={newP.pronunciation}
						onChange={(e) =>
							setNewP({ ...newP, pronunciation: e.target.value })
						}
						style={{
							width: "100%",
							padding: "0.6rem",
							background: "rgba(255,255,255,0.15)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							marginBottom: "0.5rem",
						}}
					/>
					<select
						value={newP.lang}
						onChange={(e) => setNewP({ ...newP, lang: e.target.value })}
						style={{
							width: "100%",
							padding: "0.6rem",
							background: "rgba(255,255,255,0.15)",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							marginBottom: "0.5rem",
						}}
					>
						<option>Spanish</option>
						<option>French</option>
						<option>German</option>
						<option>Japanese</option>
						<option>Mandarin</option>
					</select>
					<button
						onClick={save}
						style={{
							width: "100%",
							padding: "0.75rem",
							background: "#22c55e",
							border: "none",
							borderRadius: "0.5rem",
							color: "white",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Save
					</button>
				</div>
			)}
			<button
				onClick={() => setShowAdd(!showAdd)}
				style={{
					width: "100%",
					padding: "1rem",
					background: "rgba(255,255,255,0.1)",
					border: "2px dashed rgba(255,255,255,0.3)",
					borderRadius: "0.75rem",
					color: "white",
					cursor: "pointer",
				}}
			>
				+ Add Phrase
			</button>
		</div>
	);
}
