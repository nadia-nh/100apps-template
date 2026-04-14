import { useState } from "react";
import { Link } from "react-router-dom";

const toasts: Record<string, { recipients: string[]; messages: string[] }> = {
	birthday: {
		recipients: ["Friend", "Mom", "Dad", "Colleague", "Partner"],
		messages: [
			"Happy Birthday! 🎂 Wishing you an amazing year ahead!",
			"Another year older, another year wiser! Have a fantastic birthday!",
			"Hope your day is as awesome as you are! 🎉",
		],
	},
	anniversary: {
		recipients: ["Spouse", "Partner", "Friend"],
		messages: [
			"Happy Anniversary! ❤️ Here's to many more years together!",
			"Celebrating love today. Wishing you endless happiness!",
		],
	},
	wedding: {
		recipients: ["Couple", "Bride", "Groom"],
		messages: [
			"Wishing you a lifetime of love and happiness! 💕",
			"Congratulations on your union! May your journey be blessed.",
		],
	},
	graduation: {
		recipients: ["Graduate"],
		messages: [
			"Congratulations on your graduation! 🎓 Amazing achievement!",
			"So proud of you! Best wishes for your next chapter!",
		],
	},
	promotion: {
		recipients: ["Colleague", "Friend"],
		messages: [
			"Congrats on the promotion! You deserve it! 🎉",
			"Well earned! Wishing you continued success!",
		],
	},
};

export default function ToastMaker() {
	const [category, setCategory] = useState("birthday");
	const [recipient, setRecipient] = useState("Friend");
	const [customName, setCustomName] = useState("");
	const [customMsg, setCustomMsg] = useState("");
	const [copied, setCopied] = useState(false);

	const generateToast = () => {
		const list = toasts[category];
		const msg = list.messages[Math.floor(Math.random() * list.messages.length)];
		let toast = msg;
		if (customName)
			toast = toast.replace(
				/(Friend|Mom|Dad|Spouse|Partner|Colleague|Couple|Bride|Groom|Graduate)/g,
				customName,
			);
		return toast;
	};

	const copy = () => {
		const toast = customMsg || generateToast();
		navigator.clipboard.writeText(toast);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Toast Maker</h1>
				<p>Pre-made toasts for any occasion</p>
			</div>
			<div className="category-tabs">
				{Object.keys(toasts).map((cat) => (
					<button
						key={cat}
						className={category === cat ? "active" : ""}
						onClick={() => setCategory(cat)}
					>
						{cat.charAt(0).toUpperCase() + cat.slice(1)}
					</button>
				))}
			</div>
			<div className="form-section">
				<label>Who is this for?</label>
				<select
					value={recipient}
					onChange={(e) => setRecipient(e.target.value)}
				>
					{toasts[category].recipients.map((r) => (
						<option key={r} value={r}>
							{r}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Or enter custom name"
					value={customName}
					onChange={(e) => setCustomName(e.target.value)}
				/>
			</div>
			<div className="preview">
				<p>{customMsg || generateToast()}</p>
			</div>
			<div className="custom-section">
				<textarea
					placeholder="Or write your own toast..."
					value={customMsg}
					onChange={(e) => setCustomMsg(e.target.value)}
				/>
			</div>
			<button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
				{copied ? "Copied! ✓" : "Copy to Clipboard"}
			</button>
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Playfair Display', Georgia, serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; font-family: system-ui; }
        .header { text-align: center; margin: 1rem 0 1.5rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #ff6b6b, #feca57); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; font-family: system-ui; }
        .category-tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-bottom: 1.5rem; }
        .category-tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.08); border: none; border-radius: 1.5rem; color: white; cursor: pointer; font-size: 0.85rem; font-family: system-ui; }
        .category-tabs button.active { background: linear-gradient(135deg, #ff6b6b, #feca57); }
        .form-section { margin-bottom: 1.5rem; }
        .form-section label { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; font-family: system-ui; }
        .form-section select, .form-section input { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.5rem; box-sizing: border-box; font-family: system-ui; }
        .preview { background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(254,202,87,0.1)); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid rgba(255,107,107,0.2); text-align: center; }
        .preview p { margin: 0; font-size: 1.2rem; font-style: italic; line-height: 1.5; }
        .custom-section { margin-bottom: 1rem; }
        .custom-section textarea { width: 100%; min-height: 80px; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; box-sizing: border-box; font-family: inherit; }
        .copy-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #ff6b6b, #feca57); border: none; border-radius: 0.75rem; color: white; font-weight: 600; font-size: 1rem; cursor: pointer; }
        .copy-btn.copied { background: linear-gradient(135deg, #2ecc71, #27ae60); }
      `}</style>
		</div>
	);
}
