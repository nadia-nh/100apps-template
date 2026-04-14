import { useState } from "react";
import { Link } from "react-router-dom";

interface PromptElement {
	id: string;
	label: string;
	options: string[];
}

const promptElements: PromptElement[] = [
	{
		id: "character",
		label: "Character",
		options: [
			"A retired detective",
			"A time-traveling historian",
			"An underground chef",
			"A teenage inventor",
			"A ghost who doesn't know they're dead",
			"A disgraced noble",
			"A street performer with secret powers",
			"An AI that gained consciousness",
			"A lighthouse keeper with a mysterious past",
			"A collector of unusual things",
			"A courier who delivers more than packages",
			"A scientist on the verge of a breakthrough",
		],
	},
	{
		id: "setting",
		label: "Setting",
		options: [
			"A sinking city built on stilts",
			"An abandoned space station",
			"A village where dreams are currency",
			"A train that never stops",
			"A library that grows infinitely",
			"A carnival that appears once every decade",
			"A city where art comes to life",
			"A frozen wasteland with hidden warmth",
			"An underwater civilization",
			"A tower that touches the clouds",
			"A town stuck in perpetual twilight",
			"A marketplace in the clouds",
		],
	},
	{
		id: "conflict",
		label: "Conflict",
		options: [
			"Must solve a crime they didn't commit",
			"Must protect a secret that could change everything",
			"Must choose between two impossible futures",
			"Is being hunted by their own past",
			"Must save someone who doesn't want to be saved",
			"Discovers a conspiracy that goes back centuries",
			"Must outsmart a foe who knows all their moves",
			"Is losing their most precious memory",
			"Must unite warring factions",
			"Faces a decision that will affect millions",
			"Must break an ancient curse",
			"Is trapped in a game where losing means death",
		],
	},
	{
		id: "object",
		label: "Object",
		options: [
			"A key that opens any door",
			"A diary with blank pages that fill themselves",
			"A compass that points to the holder's deepest desire",
			"A music box that shows possible futures",
			"A photograph that moves",
			"A watch that can rewind 5 minutes",
			"A book that rewrites itself based on the reader",
			"A coin that grants one impossible wish",
			"A map that shows only what the holder fears",
			"A pocket watch with someone trapped inside",
			"A locket that contains a fragment of time",
			"A ring that echoes the wearer's emotions",
		],
	},
];

const genreThemes: Record<string, { colors: string[]; accent: string }> = {
	dark: {
		colors: ["#1a1a2e", "#16213e", "#0f3460"],
		accent: "#e94560",
	},
	warm: {
		colors: ["#2d2d44", "#3d3d5c", "#4d4d7a"],
		accent: "#f39c12",
	},
	ethereal: {
		colors: ["#1e1e30", "#2a2a4a", "#3a3a6a"],
		accent: "#9b59b6",
	},
	ocean: {
		colors: ["#0d2137", "#153a5c", "#1d4d80"],
		accent: "#00cec9",
	},
};

export default function StorySeed() {
	const [elements, setElements] = useState(
		promptElements.map((el) => ({
			...el,
			current: el.options[Math.floor(Math.random() * el.options.length)],
		})),
	);
	const [genre, setGenre] = useState<keyof typeof genreThemes>("dark");
	const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
	const [showSaved, setShowSaved] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const regenerateElement = (id: string) => {
		setIsAnimating(true);
		setTimeout(() => {
			setElements((prev) =>
				prev.map((el) =>
					el.id === id
						? {
								...el,
								current:
									el.options[Math.floor(Math.random() * el.options.length)],
							}
						: el,
				),
			);
			setIsAnimating(false);
		}, 150);
	};

	const regenerateAll = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setElements((prev) =>
				prev.map((el) => ({
					...el,
					current: el.options[Math.floor(Math.random() * el.options.length)],
				})),
			);
			setIsAnimating(false);
		}, 150);
	};

	const savePrompt = () => {
		const prompt = elements.map((el) => el.current).join(" | ");
		if (!savedPrompts.includes(prompt)) {
			const newSaved = [prompt, ...savedPrompts];
			setSavedPrompts(newSaved);
			localStorage.setItem("story-seeds", JSON.stringify(newSaved));
		}
	};

	const loadSaved = () => {
		const saved = localStorage.getItem("story-seeds");
		if (saved) {
			setSavedPrompts(JSON.parse(saved));
		}
	};

	const deletePrompt = (prompt: string) => {
		const newSaved = savedPrompts.filter((p) => p !== prompt);
		setSavedPrompts(newSaved);
		localStorage.setItem("story-seeds", JSON.stringify(newSaved));
	};

	const theme = genreThemes[genre];

	return (
		<div
			className="app-container"
			style={
				{
					"--theme-accent": theme.accent,
					background: `linear-gradient(180deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`,
				} as React.CSSProperties
			}
		>
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Story Seed</h1>
				<p>Spark your next tale</p>
			</div>

			<div className="genre-selector">
				<span className="genre-label">Genre:</span>
				{Object.keys(genreThemes).map((g) => (
					<button
						key={g}
						className={`genre-btn ${genre === g ? "active" : ""}`}
						onClick={() => setGenre(g as keyof typeof genreThemes)}
					>
						{g.charAt(0).toUpperCase() + g.slice(1)}
					</button>
				))}
			</div>

			<div className={`prompt-container ${isAnimating ? "animating" : ""}`}>
				{elements.map((element) => (
					<div key={element.id} className="prompt-element">
						<span className="element-label">{element.label}</span>
						<div className="element-content">
							<span className="element-text">{element.current}</span>
							<button
								className="regen-btn"
								onClick={() => regenerateElement(element.id)}
								title="Regenerate"
							>
								↻
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="action-row">
				<button className="regen-all-btn" onClick={regenerateAll}>
					Generate New Story
				</button>
				<button className="save-btn" onClick={savePrompt}>
					Save Prompt
				</button>
			</div>

			<div className="view-saved-row">
				<button
					className="view-saved-btn"
					onClick={() => {
						loadSaved();
						setShowSaved(!showSaved);
					}}
				>
					{showSaved ? "Hide Saved" : `View Saved (${savedPrompts.length})`}
				</button>
			</div>

			{showSaved && (
				<div className="saved-section">
					{savedPrompts.length === 0 ? (
						<p className="empty-state">No saved prompts yet</p>
					) : (
						<div className="saved-list">
							{savedPrompts.map((prompt, idx) => (
								<div key={idx} className="saved-item">
									<div className="saved-text">
										{prompt.split(" | ").map((part, i) => (
											<span key={i} className="saved-part">
												<strong>{promptElements[i].label}:</strong> {part}
												{i < 2 ? " → " : ""}
											</span>
										))}
									</div>
									<button
										className="delete-saved"
										onClick={() => deletePrompt(prompt)}
									>
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<div className="tip-card">
				<span className="tip-icon">💡</span>
				<span className="tip-text">
					Combine random elements or focus on one that inspires you
				</span>
			</div>

			<style>{`
        .app-container {
          min-height: 100vh;
          color: #e8e8e8;
          padding: 1.5rem;
          font-family: 'Crimson Pro', Georgia, serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
          z-index: 10;
          font-family: 'Outfit', system-ui, sans-serif;
        }
        .back-button:hover {
          color: white;
        }

        .header {
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .header h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          color: var(--theme-accent);
          letter-spacing: -0.5px;
        }

        .header p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.95rem;
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .genre-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .genre-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .genre-btn {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1.5rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .genre-btn.active {
          background: var(--theme-accent);
          border-color: var(--theme-accent);
          color: white;
        }

        .prompt-container {
          max-width: 500px;
          margin: 0 auto 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .prompt-container.animating {
          opacity: 0.5;
          transform: translateX(20px);
          transition: all 0.15s ease;
        }

        .prompt-element {
          background: rgba(255,255,255,0.04);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .element-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--theme-accent);
          margin-bottom: 0.5rem;
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .element-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .element-text {
          font-size: 1.15rem;
          line-height: 1.4;
          font-weight: 500;
        }

        .regen-btn {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 50%;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .regen-btn:hover {
          background: var(--theme-accent);
          color: white;
        }

        .action-row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .regen-all-btn {
          padding: 0.8rem 1.5rem;
          background: var(--theme-accent);
          border: none;
          border-radius: 2rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: 0.95rem;
        }

        .regen-all-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .save-btn {
          padding: 0.8rem 1.25rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 2rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: 0.95rem;
        }

        .save-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        .view-saved-row {
          text-align: center;
          margin-bottom: 1rem;
        }

        .view-saved-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 0.85rem;
          font-family: 'Outfit', system-ui, sans-serif;
        }

        .view-saved-btn:hover {
          color: white;
        }

        .saved-section {
          background: rgba(255,255,255,0.02);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
          max-height: 250px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }

        .empty-state {
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
          padding: 1rem;
        }

        .saved-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .saved-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
        }

        .saved-text {
          font-size: 0.85rem;
          line-height: 1.4;
          color: rgba(255,255,255,0.7);
        }

        .saved-part {
          display: block;
        }

        .saved-part strong {
          color: var(--theme-accent);
        }

        .delete-saved {
          width: 20px;
          height: 20px;
          padding: 0;
          background: rgba(255,107,107,0.2);
          border: none;
          border-radius: 0.25rem;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .tip-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.05);
          max-width: 500px;
          margin: 0 auto;
        }

        .tip-icon {
          font-size: 1.25rem;
        }

        .tip-text {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          font-family: 'Outfit', system-ui, sans-serif;
        }
      `}</style>
		</div>
	);
}
