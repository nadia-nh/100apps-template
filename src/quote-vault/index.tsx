import { useState } from "react";
import { Link } from "react-router-dom";

interface Quote {
	id: string;
	text: string;
	author: string;
	source?: string;
	tags: string[];
}

const defaultQuotes: Quote[] = [
	{
		id: "1",
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
		tags: ["motivation"],
	},
	{
		id: "2",
		text: "Innovation distinguishes between a leader and a follower.",
		author: "Steve Jobs",
		tags: ["innovation"],
	},
	{
		id: "3",
		text: "Stay hungry, stay foolish.",
		author: "Steve Jobs",
		tags: ["motivation"],
	},
];

export default function QuoteVault() {
	const [quotes, setQuotes] = useState<Quote[]>(() => {
		const saved = localStorage.getItem("quote-vault");
		return saved ? JSON.parse(saved) : defaultQuotes;
	});
	const [showAdd, setShowAdd] = useState(false);
	const [filter, setFilter] = useState("all");
	const [newQuote, setNewQuote] = useState({
		text: "",
		author: "",
		source: "",
		tags: "",
	});

	const save = (data: Quote[]) => {
		setQuotes(data);
		localStorage.setItem("quote-vault", JSON.stringify(data));
	};

	const addQuote = () => {
		if (!newQuote.text || !newQuote.author) return;
		const quote: Quote = {
			id: `q-${Date.now()}`,
			text: newQuote.text,
			author: newQuote.author,
			source: newQuote.source || undefined,
			tags: newQuote.tags ? newQuote.tags.split(",").map((t) => t.trim()) : [],
		};
		save([...quotes, quote]);
		setNewQuote({ text: "", author: "", source: "", tags: "" });
		setShowAdd(false);
	};

	const deleteQuote = (id: string) => save(quotes.filter((q) => q.id !== id));

	const allTags = Array.from(new Set(quotes.flatMap((q) => q.tags)));
	const filtered =
		filter === "all" ? quotes : quotes.filter((q) => q.tags.includes(filter));
	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

	const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Quote Vault</h1>
				<p>Save your favorite quotes</p>
			</div>
			<button className="add-btn" onClick={() => setShowAdd(true)}>
				+ Add Quote
			</button>
			{randomQuote && (
				<div
					className="featured-quote"
					onClick={() =>
						copyToClipboard(`"${randomQuote.text}" - ${randomQuote.author}`)
					}
				>
					<span className="quote-icon">❝</span>
					<p className="quote-text">{randomQuote.text}</p>
					<span className="quote-author">— {randomQuote.author}</span>
				</div>
			)}
			<div className="filter-row">
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					<option value="all">All Tags</option>
					{allTags.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</div>
			<div className="quotes-list">
				{filtered.map((quote) => (
					<div key={quote.id} className="quote-card">
						<p className="quote-text">{quote.text}</p>
						<span className="quote-author">— {quote.author}</span>
						{quote.tags.length > 0 && (
							<div className="quote-tags">
								{quote.tags.map((t) => (
									<span key={t} className="tag">
										{t}
									</span>
								))}
							</div>
						)}
						<div className="quote-actions">
							<button
								onClick={() =>
									copyToClipboard(`"${quote.text}" - ${quote.author}`)
								}
							>
								Copy
							</button>
							<button className="delete" onClick={() => deleteQuote(quote.id)}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
			{showAdd && (
				<div className="modal-overlay" onClick={() => setShowAdd(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Add Quote</h3>
						<textarea
							placeholder="Quote text"
							value={newQuote.text}
							onChange={(e) =>
								setNewQuote({ ...newQuote, text: e.target.value })
							}
						/>
						<input
							type="text"
							placeholder="Author"
							value={newQuote.author}
							onChange={(e) =>
								setNewQuote({ ...newQuote, author: e.target.value })
							}
						/>
						<input
							type="text"
							placeholder="Source (optional)"
							value={newQuote.source}
							onChange={(e) =>
								setNewQuote({ ...newQuote, source: e.target.value })
							}
						/>
						<input
							type="text"
							placeholder="Tags (comma separated)"
							value={newQuote.tags}
							onChange={(e) =>
								setNewQuote({ ...newQuote, tags: e.target.value })
							}
						/>
						<div className="modal-actions">
							<button onClick={() => setShowAdd(false)}>Cancel</button>
							<button className="save" onClick={addQuote}>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Crimson Pro', Georgia, serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #ffeaa7, #fdcb6e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .add-btn { width: 100%; padding: 0.85rem; background: linear-gradient(135deg, #ffeaa7, #fdcb6e); border: none; border-radius: 0.75rem; color: #1a1a2e; font-weight: 600; cursor: pointer; margin-bottom: 1rem; font-family: system-ui; }
        .featured-quote { background: rgba(255,255,255,0.04); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid rgba(255,234,167,0.2); cursor: pointer; transition: all 0.2s; }
        .featured-quote:hover { background: rgba(255,234,167,0.08); }
        .quote-icon { font-size: 2rem; color: #ffeaa7; display: block; margin-bottom: 0.5rem; }
        .featured-quote .quote-text { font-size: 1.2rem; font-style: italic; margin: 0 0 0.5rem; line-height: 1.5; }
        .quote-author { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
        .filter-row { margin-bottom: 1rem; }
        .filter-row select { width: 100%; padding: 0.6rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; font-family: system-ui; }
        .quotes-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .quote-card { background: rgba(255,255,255,0.03); border-radius: 0.75rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
        .quote-card .quote-text { margin: 0 0 0.5rem; font-size: 1rem; line-height: 1.5; }
        .quote-card .quote-author { display: block; margin-bottom: 0.5rem; }
        .quote-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .tag { padding: 0.2rem 0.5rem; background: rgba(255,234,167,0.15); border-radius: 0.5rem; font-size: 0.7rem; color: #ffeaa7; font-family: system-ui; }
        .quote-actions { display: flex; gap: 0.5rem; }
        .quote-actions button { padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.08); border: none; border-radius: 0.4rem; color: white; cursor: pointer; font-size: 0.8rem; font-family: system-ui; }
        .quote-actions button.delete { color: #ff6b6b; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #1a1a2e; border-radius: 1rem; padding: 1.5rem; width: 100%; max-width: 400px; }
        .modal h3 { margin: 0 0 1rem; color: #ffeaa7; }
        .modal input, .modal textarea { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.75rem; box-sizing: border-box; font-family: inherit; }
        .modal textarea { min-height: 80px; }
        .modal-actions { display: flex; gap: 0.5rem; }
        .modal-actions button { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; cursor: pointer; font-family: system-ui; }
        .modal-actions button:first-child { background: rgba(255,255,255,0.1); color: white; }
        .modal-actions button.save { background: #ffeaa7; color: #1a1a2e; font-weight: 600; }
      `}</style>
		</div>
	);
}
