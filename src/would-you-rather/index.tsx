import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Category = "all" | "fun" | "deep" | "silly" | "serious";

interface Question {
	id: string;
	optionA: string;
	optionB: string;
	category: Category;
}

const questions: Question[] = [
	{
		id: "1",
		optionA: "Be able to fly",
		optionB: "Be invisible",
		category: "fun",
	},
	{
		id: "2",
		optionA: "Live without music",
		optionB: "Live without movies",
		category: "fun",
	},
	{
		id: "3",
		optionA: "Have unlimited money",
		optionB: "Have unlimited time",
		category: "deep",
	},
	{
		id: "4",
		optionA: "Know how you die",
		optionB: "Know when you die",
		category: "deep",
	},
	{
		id: "5",
		optionA: "Always say what's on your mind",
		optionB: "Never speak again",
		category: "silly",
	},
	{
		id: "6",
		optionA: "Be the funniest person",
		optionB: "Be the smartest person",
		category: "fun",
	},
	{
		id: "7",
		optionA: "Give up showering forever",
		optionB: "Give up brushing teeth forever",
		category: "silly",
	},
	{
		id: "8",
		optionA: "Live in the past",
		optionB: "Live in the future",
		category: "deep",
	},
	{
		id: "9",
		optionA: "Have a rewind button in life",
		optionB: "Have a pause button in life",
		category: "fun",
	},
	{
		id: "10",
		optionA: "Be famous for something terrible",
		optionB: "Be unknown but do great things",
		category: "deep",
	},
	{
		id: "11",
		optionA: "Eat only甜食 for a year",
		optionB: "Eat only savory for a year",
		category: "silly",
	},
	{
		id: "12",
		optionA: "Have no internet",
		optionB: "Have no car",
		category: "fun",
	},
	{
		id: "13",
		optionA: "Be able to read minds",
		optionB: "Be able to see 1 minute into the future",
		category: "deep",
	},
	{
		id: "14",
		optionA: "Always be slightly too hot",
		optionB: "Always be slightly too cold",
		category: "silly",
	},
	{
		id: "15",
		optionA: "Have a pause button for your life",
		optionB: "Have a restart button for your life",
		category: "fun",
	},
	{
		id: "16",
		optionA: "Lose all your memories",
		optionB: "Never make new memories",
		category: "deep",
	},
	{
		id: "17",
		optionA: "Be a famous actor",
		optionB: "Be a famous musician",
		category: "fun",
	},
	{
		id: "18",
		optionA: "Only eat pizza",
		optionB: "Only eat burgers",
		category: "silly",
	},
	{
		id: "19",
		optionA: "Live alone on an island",
		optionB: "Live in a crowded city",
		category: "deep",
	},
	{
		id: "20",
		optionA: "Have legs of a gazelle",
		optionB: "Have arms of an octopus",
		category: "fun",
	},
	{
		id: "21",
		optionA: "Be able to talk to animals",
		optionB: "Speak all human languages",
		category: "silly",
	},
	{
		id: "22",
		optionA: "Have no phone",
		optionB: "Have no computer",
		category: "fun",
	},
	{
		id: "23",
		optionA: "Relive the same day forever",
		optionB: "Live 1000 years",
		category: "deep",
	},
	{
		id: "24",
		optionA: "Always win arguments",
		optionB: "Always be right",
		category: "silly",
	},
	{
		id: "25",
		optionA: "Be a superhero",
		optionB: "Be a wizard",
		category: "fun",
	},
	{
		id: "26",
		optionA: "Have no taste",
		optionB: "Have no smell",
		category: "silly",
	},
	{
		id: "27",
		optionA: "Be the youngest child",
		optionB: "Be the oldest child",
		category: "deep",
	},
	{
		id: "28",
		optionA: "Have unlimited free flights",
		optionB: "Have unlimited free food",
		category: "fun",
	},
	{ id: "29", optionA: "Never sleep", optionB: "Never eat", category: "silly" },
	{
		id: "30",
		optionA: "Know the answer to everything",
		optionB: "Have the ability to learn anything instantly",
		category: "deep",
	},
	{
		id: "31",
		optionA: "Be able to teleport",
		optionB: "Be able to time travel",
		category: "fun",
	},
	{
		id: "32",
		optionA: "Live in space",
		optionB: "Live underwater",
		category: "deep",
	},
	{
		id: "33",
		optionA: "Only wear one color",
		optionB: "Only wear one style",
		category: "silly",
	},
	{
		id: "34",
		optionA: "Have a personal chef",
		optionB: "Have a personal driver",
		category: "fun",
	},
	{
		id: "35",
		optionA: "Be able to control weather",
		optionB: "Be able to control elements",
		category: "deep",
	},
	{
		id: "36",
		optionA: "Never use social media again",
		optionB: "Never watch TV again",
		category: "silly",
	},
	{
		id: "37",
		optionA: "Have a photographic memory",
		optionB: "Have an elastic memory",
		category: "fun",
	},
	{
		id: "38",
		optionA: "Be famous for something good",
		optionB: "Be infamous for something small",
		category: "deep",
	},
	{
		id: "39",
		optionA: "Always be 10 minutes early",
		optionB: "Always be 10 minutes late",
		category: "silly",
	},
	{
		id: "40",
		optionA: "Have no fears",
		optionB: "Have no limits",
		category: "deep",
	},
];

const categoryColors: Record<Category, string> = {
	all: "#9b59b6",
	fun: "#3498db",
	deep: "#e74c3c",
	silly: "#f39c12",
	serious: "#1abc9c",
};

export default function WouldYouRather() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
	const [category, setCategory] = useState<Category>("all");
	const [favorites, setFavorites] = useState<Question[]>([]);
	const [showFavorites, setShowFavorites] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const filteredQuestions =
		category === "all"
			? questions
			: questions.filter((q) => q.category === category);

	const getRandomQuestion = () => {
		if (filteredQuestions.length <= 1) return;
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * filteredQuestions.length);
		} while (newIndex === currentIndex);
		setCurrentIndex(newIndex);
		setSelectedOption(null);
	};

	const nextQuestion = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setSelectedOption(null);
		setTimeout(() => {
			if (currentIndex >= filteredQuestions.length - 1) {
				setCurrentIndex(0);
			} else {
				setCurrentIndex(currentIndex + 1);
			}
			setIsAnimating(false);
		}, 200);
	};

	const prevQuestion = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setSelectedOption(null);
		setTimeout(() => {
			if (currentIndex <= 0) {
				setCurrentIndex(filteredQuestions.length - 1);
			} else {
				setCurrentIndex(currentIndex - 1);
			}
			setIsAnimating(false);
		}, 200);
	};

	const toggleFavorite = () => {
		const current = filteredQuestions[currentIndex];
		const isFavorite = favorites.some((f) => f.id === current.id);
		if (isFavorite) {
			setFavorites(favorites.filter((f) => f.id !== current.id));
		} else {
			setFavorites([...favorites, current]);
		}
	};

	const isFavorite = favorites.some(
		(f) => f.id === filteredQuestions[currentIndex]?.id,
	);

	useEffect(() => {
		localStorage.setItem("wyr-favorites", JSON.stringify(favorites));
	}, [favorites]);

	useEffect(() => {
		setCurrentIndex(0);
	}, [category]);

	const currentQuestion = filteredQuestions[currentIndex];

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Would You Rather</h1>
				<p>Spark conversations</p>
			</div>

			<div className="category-tabs">
				{(["all", "fun", "deep", "silly", "serious"] as Category[]).map(
					(cat) => (
						<button
							key={cat}
							className={`cat-tab ${category === cat ? "active" : ""}`}
							style={
								{
									"--cat-color": categoryColors[cat],
								} as React.CSSProperties
							}
							onClick={() => setCategory(cat)}
						>
							{cat.charAt(0).toUpperCase() + cat.slice(1)}
						</button>
					),
				)}
			</div>

			{currentQuestion && (
				<div className={`card-container ${isAnimating ? "animating" : ""}`}>
					<div className="question-card">
						<span
							className="category-badge"
							style={{ background: categoryColors[currentQuestion.category] }}
						>
							{currentQuestion.category}
						</span>

						<div
							className={`option-card option-a ${selectedOption === "A" ? "selected" : ""}`}
							onClick={() => setSelectedOption("A")}
						>
							<span className="option-label">A</span>
							<span className="option-text">{currentQuestion.optionA}</span>
						</div>

						<div className="divider">
							<span>OR</span>
						</div>

						<div
							className={`option-card option-b ${selectedOption === "B" ? "selected" : ""}`}
							onClick={() => setSelectedOption("B")}
						>
							<span className="option-label">B</span>
							<span className="option-text">{currentQuestion.optionB}</span>
						</div>
					</div>
				</div>
			)}

			<div className="controls">
				<button className="nav-btn" onClick={prevQuestion}>
					← Prev
				</button>
				<button className="random-btn" onClick={getRandomQuestion}>
					Random
				</button>
				<button className="nav-btn" onClick={nextQuestion}>
					Next →
				</button>
			</div>

			<div className="action-buttons">
				<button
					className={`fav-btn ${isFavorite ? "active" : ""}`}
					onClick={toggleFavorite}
				>
					{isFavorite ? "★ Saved" : "☆ Save"}
				</button>
				<button
					className="view-fav-btn"
					onClick={() => setShowFavorites(!showFavorites)}
				>
					{showFavorites ? "Show All" : `View Saved (${favorites.length})`}
				</button>
			</div>

			{showFavorites && (
				<div className="favorites-section">
					<h3>Saved Questions</h3>
					{favorites.length === 0 ? (
						<p className="empty-state">No saved questions yet</p>
					) : (
						<div className="favorites-list">
							{favorites.map((q) => (
								<div
									key={q.id}
									className="favorite-item"
									onClick={() => {
										const idx = filteredQuestions.findIndex(
											(f) => f.id === q.id,
										);
										if (idx >= 0) {
											setCurrentIndex(idx);
										} else {
											questions.forEach((ques, i) => {
												if (ques.id === q.id) setCurrentIndex(i);
											});
										}
										setShowFavorites(false);
									}}
								>
									<span
										className="fav-category"
										style={{ background: categoryColors[q.category] }}
									>
										{q.category}
									</span>
									<span className="fav-text">
										{q.optionA} or {q.optionB}
									</span>
									<button
										className="remove-fav"
										onClick={(e) => {
											e.stopPropagation();
											setFavorites(favorites.filter((f) => f.id !== q.id));
										}}
									>
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
          color: #e8e8e8;
          padding: 1.5rem;
          font-family: 'Sora', system-ui, sans-serif;
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
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          background: linear-gradient(90deg, #f39c12, #e74c3c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        .category-tabs {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .cat-tab {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2rem;
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-tab.active {
          background: var(--cat-color);
          border-color: var(--cat-color);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .card-container {
          perspective: 1000px;
          margin-bottom: 1.5rem;
        }

        .card-container.animating .question-card {
          opacity: 0;
          transform: translateX(50px);
        }

        .question-card {
          background: linear-gradient(145deg, #1e1e32, #16162a);
          border-radius: 1.5rem;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }

        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .option-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.08);
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .option-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
        }

        .option-card.selected {
          border-color: #f39c12;
          background: rgba(243, 156, 18, 0.1);
        }

        .option-label {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .option-a .option-label {
          background: linear-gradient(135deg, #3498db, #2980b9);
        }

        .option-b .option-label {
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
        }

        .option-text {
          font-size: 1rem;
          line-height: 1.4;
          font-weight: 500;
        }

        .divider {
          text-align: center;
          padding: 0.75rem 0;
          color: rgba(255,255,255,0.3);
          font-size: 0.75rem;
          letter-spacing: 3px;
          font-weight: 600;
        }

        .controls {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .nav-btn {
          padding: 0.75rem 1.25rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        .random-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #f39c12, #e74c3c);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        }

        .random-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .fav-btn, .view-fav-btn {
          padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.5rem;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .fav-btn.active {
          color: #f39c12;
          border-color: rgba(243, 156, 18, 0.3);
        }

        .view-fav-btn:hover, .fav-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .favorites-section {
          background: rgba(255,255,255,0.02);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .favorites-section h3 {
          margin: 0 0 0.75rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .empty-state {
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
          text-align: center;
          padding: 1rem;
        }

        .favorites-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 250px;
          overflow-y: auto;
        }

        .favorite-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .favorite-item:hover {
          background: rgba(255,255,255,0.08);
        }

        .fav-category {
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.6rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .fav-text {
          flex: 1;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remove-fav {
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
      `}</style>
		</div>
	);
}
