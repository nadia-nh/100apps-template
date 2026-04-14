import { useState } from "react";
import { Link } from "react-router-dom";

const questions: Record<string, string[]> = {
	getToKnow: [
		"What's a skill you'd love to learn?",
		"What's the best advice you've ever received?",
		"What's a movie that changed your perspective?",
		"If you could travel anywhere, where would you go?",
		"What's something on your bucket list?",
		"What's your favorite way to spend a weekend?",
		"What's a book that had a big impact on you?",
		"What's something you're passionate about?",
	],
	fun: [
		"What's the most embarrassing thing that's ever happened to you?",
		"If you could have any superpower, what would it be?",
		"What's the weirdest food you've ever eaten?",
		"If animals could talk, which would be the rudest?",
		"What's your guilty pleasure TV show?",
		"If you were a vegetable, which would you be?",
	],
	deep: [
		"What does success mean to you?",
		"What's something you've struggled with?",
		"What's a belief you used to hold that changed?",
		"What would you do if you knew you couldn't fail?",
		"What's something you want to be remembered for?",
		"What makes you feel most alive?",
	],
	teamBuilding: [
		"What's one thing you're really good at?",
		"What's a weakness you're working on?",
		"What's your ideal work environment?",
		"How do you recharge after a busy day?",
		"What's your communication style?",
		"What's something you admire about someone here?",
	],
};

export default function Icebreaker() {
	const [category, setCategory] = useState("getToKnow");
	const [current, setCurrent] = useState(questions.getToKnow[0]);
	const [favorites, setFavorites] = useState<string[]>([]);

	const next = () => {
		const list = questions[category];
		const idx = list.indexOf(current);
		setCurrent(list[(idx + 1) % list.length]);
	};

	const random = () => {
		const list = questions[category];
		setCurrent(list[Math.floor(Math.random() * list.length)]);
	};

	const toggleFav = () => {
		if (favorites.includes(current))
			setFavorites(favorites.filter((f) => f !== current));
		else setFavorites([...favorites, current]);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Icebreaker</h1>
				<p>Conversation starters</p>
			</div>
			<div className="category-tabs">
				{Object.keys(questions).map((cat) => (
					<button
						key={cat}
						className={category === cat ? "active" : ""}
						onClick={() => setCategory(cat)}
					>
						{cat.replace(/([A-Z])/g, " $1").trim()}
					</button>
				))}
			</div>
			<div className="question-card">
				<p>{current}</p>
			</div>
			<div className="controls">
				<button onClick={next}>Next →</button>
				<button onClick={random}>Random</button>
				<button
					onClick={toggleFav}
					className={favorites.includes(current) ? "fav" : ""}
				>
					★
				</button>
			</div>
			{favorites.length > 0 && (
				<div className="favorites">
					<h3>Favorites</h3>
					{favorites.map((f, i) => (
						<button key={i} onClick={() => setCurrent(f)}>
							{f}
						</button>
					))}
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Poppins', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; color: white; }
        .header p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .category-tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-bottom: 1.5rem; }
        .category-tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.15); border: none; border-radius: 1.5rem; color: white; cursor: pointer; font-size: 0.8rem; }
        .category-tabs button.active { background: white; color: #667eea; font-weight: 600; }
        .question-card { background: white; border-radius: 1.5rem; padding: 2rem; margin-bottom: 1.5rem; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .question-card p { margin: 0; font-size: 1.3rem; color: #333; line-height: 1.5; }
        .controls { display: flex; gap: 0.75rem; justify-content: center; }
        .controls button { padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); border: none; border-radius: 2rem; color: white; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
        .controls button:hover { background: rgba(255,255,255,0.3); }
        .controls button.fav { background: #f1c40f; color: #333; }
        .favorites { margin-top: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; padding: 1rem; }
        .favorites h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.7); text-transform: uppercase; }
        .favorites button { display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.4rem; background: rgba(255,255,255,0.1); border: none; border-radius: 0.5rem; color: white; cursor: pointer; text-align: left; font-size: 0.85rem; }
      `}</style>
		</div>
	);
}
