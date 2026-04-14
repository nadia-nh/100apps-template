import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Card {
	id: string;
	front: string;
	back: string;
	nextReview: number;
	interval: number;
	ease: number;
}

interface Deck {
	id: string;
	name: string;
	cards: Card[];
}

const defaultDecks: Deck[] = [
	{
		id: "1",
		name: "Spanish Basics",
		cards: [
			{
				id: "1",
				front: "Hello",
				back: "Hola",
				nextReview: 0,
				interval: 1,
				ease: 2.5,
			},
			{
				id: "2",
				front: "Thank you",
				back: "Gracias",
				nextReview: 0,
				interval: 1,
				ease: 2.5,
			},
			{
				id: "3",
				front: "Goodbye",
				back: "Adiós",
				nextReview: 0,
				interval: 1,
				ease: 2.5,
			},
		],
	},
];

export default function FlashDeck() {
	const [decks, setDecks] = useState<Deck[]>(() => {
		const saved = localStorage.getItem("flash-decks");
		return saved ? JSON.parse(saved) : defaultDecks;
	});
	const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [studyMode, setStudyMode] = useState(false);
	const [newDeckName, setNewDeckName] = useState("");
	const [showAddDeck, setShowAddDeck] = useState(false);
	const [showAddCard, setShowAddCard] = useState(false);
	const [newCardFront, setNewCardFront] = useState("");
	const [newCardBack, setNewCardBack] = useState("");
	const [flipKey, setFlipKey] = useState(0);

	useEffect(() => {
		localStorage.setItem("flash-decks", JSON.stringify(decks));
	}, [decks]);

	const now = Date.now();

	const getDueCards = (deck: Deck) => {
		return deck.cards.filter((c) => c.nextReview <= now);
	};

	const getCardScore = (quality: number, card: Card) => {
		let newInterval: number;
		let newEase =
			card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
		if (newEase < 1.3) newEase = 1.3;

		if (quality < 3) {
			newInterval = 1;
		} else if (card.interval === 1) {
			newInterval = 6;
		} else {
			newInterval = Math.round(card.interval * newEase);
		}

		return {
			interval: newInterval,
			ease: newEase,
			nextReview: now + newInterval * 24 * 60 * 60 * 1000,
		};
	};

	const rateCard = (quality: number) => {
		if (!currentDeck) return;

		const card = currentDeck.cards[currentCardIndex];
		const { interval, ease, nextReview } = getCardScore(quality, card);

		const updatedCard = { ...card, interval, ease, nextReview };
		const updatedCards = [...currentDeck.cards];
		updatedCards[currentCardIndex] = updatedCard;

		const updatedDeck = { ...currentDeck, cards: updatedCards };
		setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
		setCurrentDeck(updatedDeck);

		const dueCards = getDueCards(updatedDeck);
		if (dueCards.length > 1) {
			setCurrentCardIndex(Math.floor(Math.random() * (dueCards.length - 1)));
		} else {
			setStudyMode(false);
		}
		setShowAnswer(false);
		setFlipKey((k) => k + 1);
	};

	const startStudy = (deck: Deck) => {
		const dueCards = getDueCards(deck);
		if (dueCards.length === 0) {
			alert("No cards due for review!");
			return;
		}
		setCurrentDeck(deck);
		setCurrentCardIndex(0);
		setShowAnswer(false);
		setStudyMode(true);
		setFlipKey((k) => k + 1);
	};

	const addDeck = () => {
		if (newDeckName.trim()) {
			const newDeck: Deck = {
				id: Date.now().toString(),
				name: newDeckName.trim(),
				cards: [],
			};
			setDecks([...decks, newDeck]);
			setNewDeckName("");
			setShowAddDeck(false);
		}
	};

	const addCard = () => {
		if (!currentDeck || !newCardFront.trim() || !newCardBack.trim()) return;

		const newCard: Card = {
			id: Date.now().toString(),
			front: newCardFront.trim(),
			back: newCardBack.trim(),
			nextReview: now,
			interval: 1,
			ease: 2.5,
		};

		const updatedDeck = {
			...currentDeck,
			cards: [...currentDeck.cards, newCard],
		};

		setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
		setCurrentDeck(updatedDeck);
		setNewCardFront("");
		setNewCardBack("");
		setShowAddCard(false);
	};

	const deleteDeck = (id: string) => {
		setDecks(decks.filter((d) => d.id !== id));
		if (currentDeck?.id === id) {
			setCurrentDeck(null);
			setStudyMode(false);
		}
	};

	if (studyMode && currentDeck) {
		const dueCards = getDueCards(currentDeck);
		const currentCard = dueCards[currentCardIndex] || dueCards[0];

		if (!currentCard) {
			return (
				<div className="app-container">
					<Link to="/" className="back-button">
						← Back
					</Link>
					<div className="study-complete">
						<h1>All Done!</h1>
						<p>No more cards to review</p>
						<button onClick={() => setStudyMode(false)}>Back to Deck</button>
					</div>
				</div>
			);
		}

		return (
			<div className="app-container">
				<Link
					to="/"
					className="back-button"
					onClick={() => setStudyMode(false)}
				>
					← Exit
				</Link>

				<div className="study-header">
					<span className="deck-name">{currentDeck.name}</span>
					<span className="cards-remaining">{dueCards.length} remaining</span>
				</div>

				<div className="flashcard-container" key={flipKey}>
					<div
						className={`flashcard ${showAnswer ? "flipped" : ""}`}
						onClick={() => setShowAnswer(!showAnswer)}
					>
						<div className="card-inner">
							<div className="card-front">
								<span className="card-label">Question</span>
								<p>{currentCard.front}</p>
							</div>
							<div className="card-back">
								<span className="card-label">Answer</span>
								<p>{currentCard.back}</p>
							</div>
						</div>
					</div>
				</div>

				{showAnswer && (
					<div className="rating-buttons">
						<button className="rate-btn again" onClick={() => rateCard(1)}>
							<span>Again</span>
							<small>&lt; 1 day</small>
						</button>
						<button className="rate-btn hard" onClick={() => rateCard(3)}>
							<span>Hard</span>
							<small>
								{Math.max(1, Math.round(currentCard.interval * 1.2))} days
							</small>
						</button>
						<button className="rate-btn good" onClick={() => rateCard(4)}>
							<span>Good</span>
							<small>{currentCard.interval} days</small>
						</button>
						<button className="rate-btn easy" onClick={() => rateCard(5)}>
							<span>Easy</span>
							<small>
								{Math.round(currentCard.interval * currentCard.ease)} days
							</small>
						</button>
					</div>
				)}

				{!showAnswer && <p className="tap-hint">Tap card to reveal answer</p>}

				<style>{`
          .app-container {
            min-height: 100vh;
            background: #0d0d0d;
            color: #e0e0e0;
            padding: 1.5rem;
            font-family: 'Instrument Sans', system-ui, sans-serif;
          }

          .back-button {
            position: fixed;
            top: 1.5rem;
            left: 1.5rem;
            color: rgba(255,255,255,0.5);
            text-decoration: none;
            font-size: 0.9rem;
            z-index: 10;
          }

          .study-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-top: 2rem;
          }

          .deck-name {
            font-size: 1.2rem;
            font-weight: 600;
          }

          .cards-remaining {
            background: rgba(255,255,255,0.1);
            padding: 0.4rem 0.8rem;
            border-radius: 1rem;
            font-size: 0.85rem;
          }

          .flashcard-container {
            perspective: 1000px;
            margin: 2rem 0;
          }

          .flashcard {
            width: 100%;
            max-width: 400px;
            height: 280px;
            margin: 0 auto;
            cursor: pointer;
          }

          .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }

          .flashcard.flipped .card-inner {
            transform: rotateY(180deg);
          }

          .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            box-sizing: border-box;
          }

          .card-front {
            background: linear-gradient(145deg, #1a1a2e, #16162a);
            border: 1px solid rgba(255,255,255,0.08);
          }

          .card-back {
            background: linear-gradient(145deg, #1e3a2f, #162d24);
            border: 1px solid rgba(16, 185, 129, 0.2);
            transform: rotateY(180deg);
          }

          .card-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255,255,255,0.4);
            margin-bottom: 1rem;
          }

          .card-front p, .card-back p {
            font-size: 1.8rem;
            font-weight: 500;
            text-align: center;
            margin: 0;
          }

          .rating-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.75rem;
            margin-top: 2rem;
          }

          .rate-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem 0.5rem;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .rate-btn span {
            font-weight: 600;
            font-size: 0.9rem;
          }

          .rate-btn small {
            font-size: 0.7rem;
            opacity: 0.7;
            margin-top: 0.25rem;
          }

          .rate-btn.again { background: #dc2626; color: white; }
          .rate-btn.hard { background: #f59e0b; color: black; }
          .rate-btn.good { background: #10b981; color: white; }
          .rate-btn.easy { background: #3b82f6; color: white; }

          .tap-hint {
            text-align: center;
            color: rgba(255,255,255,0.3);
            margin-top: 3rem;
          }

          .study-complete {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 80vh;
            text-align: center;
          }

          .study-complete h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }

          .study-complete p {
            color: rgba(255,255,255,0.5);
            margin-bottom: 2rem;
          }

          .study-complete button {
            background: #10b981;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
			</div>
		);
	}

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>

			<div className="header">
				<h1>Flash Deck</h1>
				<p>Spaced repetition flashcards</p>
			</div>

			{!currentDeck ? (
				<>
					<div className="decks-grid">
						{decks.map((deck) => {
							const dueCount = getDueCards(deck).length;
							return (
								<div key={deck.id} className="deck-card">
									<div
										className="deck-info"
										onClick={() => setCurrentDeck(deck)}
									>
										<h3>{deck.name}</h3>
										<p>
											{deck.cards.length} cards • {dueCount} due
										</p>
									</div>
									<div className="deck-actions">
										<button
											className="study-btn"
											onClick={() => startStudy(deck)}
											disabled={dueCount === 0}
										>
											Study
										</button>
										<button
											className="delete-btn"
											onClick={() => deleteDeck(deck.id)}
										>
											×
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{showAddDeck ? (
						<div className="add-form">
							<input
								type="text"
								placeholder="Deck name..."
								value={newDeckName}
								onChange={(e) => setNewDeckName(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && addDeck()}
								autoFocus
							/>
							<div className="form-buttons">
								<button onClick={addDeck}>Create</button>
								<button
									className="cancel"
									onClick={() => setShowAddDeck(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<button
							className="add-deck-btn"
							onClick={() => setShowAddDeck(true)}
						>
							+ New Deck
						</button>
					)}
				</>
			) : (
				<>
					<div className="deck-header">
						<button
							className="back-to-decks"
							onClick={() => setCurrentDeck(null)}
						>
							← Decks
						</button>
						<h2>{currentDeck.name}</h2>
					</div>

					<div className="cards-list">
						{currentDeck.cards.map((card, idx) => (
							<div key={card.id} className="card-item">
								<span className="card-num">{idx + 1}</span>
								<div className="card-content">
									<span className="card-front">{card.front}</span>
									<span className="card-back">{card.back}</span>
								</div>
							</div>
						))}
					</div>

					{showAddCard ? (
						<div className="add-form">
							<input
								type="text"
								placeholder="Front (question)..."
								value={newCardFront}
								onChange={(e) => setNewCardFront(e.target.value)}
							/>
							<input
								type="text"
								placeholder="Back (answer)..."
								value={newCardBack}
								onChange={(e) => setNewCardBack(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && addCard()}
							/>
							<div className="form-buttons">
								<button onClick={addCard}>Add Card</button>
								<button
									className="cancel"
									onClick={() => setShowAddCard(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<button
							className="add-card-btn"
							onClick={() => setShowAddCard(true)}
						>
							+ Add Card
						</button>
					)}
				</>
			)}

			<style>{`
        .app-container {
          min-height: 100vh;
          background: #0d0d0d;
          color: #e0e0e0;
          padding: 1.5rem;
          font-family: 'Instrument Sans', system-ui, sans-serif;
        }

        .back-button {
          position: fixed;
          top: 1.5rem;
          left: 1.5rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.9rem;
          z-index: 10;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .decks-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .deck-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .deck-info {
          cursor: pointer;
          flex: 1;
        }

        .deck-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .deck-info p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        .deck-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .study-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .study-btn:disabled {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          cursor: not-allowed;
        }

        .delete-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
        }

        .delete-btn:hover {
          color: #dc2626;
        }

        .add-deck-btn, .add-card-btn {
          width: 100%;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 1rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-deck-btn:hover, .add-card-btn:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
        }

        .add-form {
          background: rgba(255,255,255,0.04);
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .add-form input {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 0.75rem;
          padding: 0.8rem 1rem;
          color: white;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
        }

        .add-form input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .form-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .form-buttons button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .form-buttons button:first-child {
          background: #10b981;
          color: white;
        }

        .form-buttons button.cancel {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }

        .deck-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .back-to-decks {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .deck-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 0.75rem;
        }

        .card-num {
          width: 24px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .card-front {
          font-weight: 500;
        }

        .card-back {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }
      `}</style>
		</div>
	);
}
