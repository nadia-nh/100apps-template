import { useState } from "react";
import { Link } from "react-router-dom";

interface Word {
	id: string;
	word: string;
	definition: string;
	example: string;
	language: string;
}

export default function WordCollector() {
	const [words, setWords] = useState<Word[]>([]);
	const [newWord, setNewWord] = useState({
		word: "",
		definition: "",
		example: "",
		language: "English",
	});
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");

	const add = () => {
		if (!newWord.word) return;
		setWords([...words, { id: `w-${Date.now()}`, ...newWord }]);
		setNewWord({ word: "", definition: "", example: "", language: "English" });
	};
	const remove = (id: string) => setWords(words.filter((w) => w.id !== id));

	const languages = ["all", ...new Set(words.map((w) => w.language))];
	const filtered = words.filter(
		(w) =>
			(filter === "all" || w.language === filter) &&
			(search === "" ||
				w.word.toLowerCase().includes(search.toLowerCase()) ||
				w.definition.toLowerCase().includes(search.toLowerCase())),
	);
	const randomWord = filtered[Math.floor(Math.random() * filtered.length)];

	const exportList = () => {
		const text = words.map((w) => `${w.word}: ${w.definition}`).join("\n");
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Word Collector</h1>
				<p>Save interesting words</p>
			</div>
			{randomWord && (
				<div
					className="featured"
					onClick={() => navigator.clipboard.writeText(randomWord.word)}
				>
					<span className="featured-word">{randomWord.word}</span>
					<span className="featured-def">{randomWord.definition}</span>
				</div>
			)}
			<div className="filters">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..."
				/>
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					{languages.map((l) => (
						<option key={l} value={l}>
							{l}
						</option>
					))}
				</select>
			</div>
			<div className="add-form">
				<input
					value={newWord.word}
					onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
					placeholder="Word"
				/>
				<input
					value={newWord.definition}
					onChange={(e) =>
						setNewWord({ ...newWord, definition: e.target.value })
					}
					placeholder="Definition"
				/>
				<input
					value={newWord.example}
					onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
					placeholder="Example sentence"
				/>
				<select
					value={newWord.language}
					onChange={(e) => setNewWord({ ...newWord, language: e.target.value })}
				>
					<option>English</option>
					<option>Spanish</option>
					<option>French</option>
					<option>German</option>
					<option>Other</option>
				</select>
				<button onClick={add}>Add Word</button>
			</div>
			<div className="words-list">
				{filtered.map((word) => (
					<div key={word.id} className="word-card">
						<div className="word-header">
							<span className="word">{word.word}</span>
							<span className="lang">{word.language}</span>
							<button onClick={() => remove(word.id)}>×</button>
						</div>
						<p className="definition">{word.definition}</p>
						{word.example && <p className="example">"{word.example}"</p>}
					</div>
				))}
			</div>
			{words.length > 0 && (
				<button className="export-btn" onClick={exportList}>
					Export List
				</button>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #232526 0%, #414345 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Crimson Pro', Georgia, serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #ffd700, #ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .featured { background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1)); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; text-align: center; cursor: pointer; border: 1px solid rgba(255,215,0,0.2); }
        .featured-word { display: block; font-size: 1.8rem; font-weight: 700; color: #ffd700; }
        .featured-def { display: block; font-size: 1rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem; font-family: system-ui; }
        .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .filters input { flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.08); border: none; border-radius: 0.4rem; color: white; }
        .filters select { padding: 0.6rem; background: rgba(255,255,255,0.08); border: none; border-radius: 0.4rem; color: white; }
        .add-form { background: rgba(255,255,255,0.05); border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .add-form input, .add-form select { padding: 0.6rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.4rem; color: white; }
        .add-form button { padding: 0.75rem; background: linear-gradient(135deg, #ffd700, #ff8c00); border: none; border-radius: 0.5rem; color: #232526; font-weight: 600; cursor: pointer; }
        .words-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .word-card { background: rgba(255,255,255,0.05); border-radius: 0.75rem; padding: 1rem; }
        .word-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .word { font-size: 1.2rem; font-weight: 700; }
        .lang { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .word-header button { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; }
        .definition { margin: 0 0 0.5rem; font-size: 0.95rem; }
        .example { margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.6); font-style: italic; }
        .export-btn { width: 100%; margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.5rem; color: white; cursor: pointer; }
      `}</style>
		</div>
	);
}
