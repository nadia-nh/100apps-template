import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface VocabWord {
	id: number;
	word: string;
	definition: string;
	example: string;
}

export default function VocabGrow() {
	const [words, setWords] = useState<VocabWord[]>(() => {
		const saved = localStorage.getItem("vocab-words");
		return saved ? JSON.parse(saved) : [];
	});
	const [showAdd, setShowAdd] = useState(false);
	const [newWord, setNewWord] = useState({
		word: "",
		definition: "",
		example: "",
	});

	useEffect(() => {
		localStorage.setItem("vocab-words", JSON.stringify(words));
	}, [words]);

	const addWord = () => {
		if (!newWord.word.trim()) return;
		setWords([...words, { id: Date.now(), ...newWord }]);
		setNewWord({ word: "", definition: "", example: "" });
		setShowAdd(false);
	};
	const deleteWord = (id: number) => setWords(words.filter((w) => w.id !== id));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#f0fdf4",
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
					Vocab Grow
				</h1>
				<p style={{ textAlign: "center", opacity: 0.5, marginBottom: "2rem" }}>
					Build your vocabulary
				</p>

				<button
					onClick={() => setShowAdd(!showAdd)}
					style={{
						width: "100%",
						padding: "1rem",
						borderRadius: 12,
						border: "none",
						background: "#22c55e",
						color: "white",
						fontWeight: "bold",
						cursor: "pointer",
						marginBottom: "1rem",
					}}
				>
					+ Add Word
				</button>

				{showAdd && (
					<div
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "1rem",
							boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
						}}
					>
						<input
							type="text"
							value={newWord.word}
							onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
							placeholder="Word"
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #bbf7d0",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="text"
							value={newWord.definition}
							onChange={(e) =>
								setNewWord({ ...newWord, definition: e.target.value })
							}
							placeholder="Definition"
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #bbf7d0",
								marginBottom: "0.5rem",
							}}
						/>
						<input
							type="text"
							value={newWord.example}
							onChange={(e) =>
								setNewWord({ ...newWord, example: e.target.value })
							}
							placeholder="Example sentence"
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "1px solid #bbf7d0",
								marginBottom: "0.75rem",
							}}
						/>
						<button
							onClick={addWord}
							style={{
								width: "100%",
								padding: "0.75rem",
								borderRadius: 8,
								border: "none",
								background: "#22c55e",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Save Word
						</button>
					</div>
				)}

				{words.length === 0 && (
					<p style={{ textAlign: "center", opacity: 0.3, marginTop: "1.5rem" }}>
						No words yet
					</p>
				)}
				{words.map((word) => (
					<div
						key={word.id}
						style={{
							background: "white",
							borderRadius: 12,
							padding: "1rem",
							marginBottom: "0.75rem",
							boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<h3 style={{ margin: 0, color: "#166534" }}>{word.word}</h3>
							<button
								onClick={() => deleteWord(word.id)}
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
						<p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
							{word.definition}
						</p>
						{word.example && (
							<p
								style={{
									margin: "0.25rem 0 0",
									fontSize: "0.85rem",
									opacity: 0.6,
									fontStyle: "italic",
								}}
							>
								"{word.example}"
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
