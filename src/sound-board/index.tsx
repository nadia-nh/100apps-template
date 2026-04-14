import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const sounds = [
	{
		id: "rain",
		label: "Rain",
		icon: "🌧️",
		src: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
	},
	{
		id: "thunder",
		label: "Thunder",
		icon: "⛈️",
		src: "https://assets.mixkit.co/active_storage/sfx/1153/1153-preview.mp3",
	},
	{
		id: "birds",
		label: "Birds",
		icon: "🐦",
		src: "https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3",
	},
	{
		id: "waves",
		label: "Waves",
		icon: "🌊",
		src: "https://assets.mixkit.co/active_storage/sfx/2430/2430-preview.mp3",
	},
	{
		id: "fire",
		label: "Fire",
		icon: "🔥",
		src: "https://assets.mixkit.co/active_storage/sfx/227/227-preview.mp3",
	},
	{
		id: "wind",
		label: "Wind",
		icon: "💨",
		src: "https://assets.mixkit.co/active_storage/sfx/2399/2399-preview.mp3",
	},
	{
		id: "forest",
		label: "Forest",
		icon: "🌲",
		src: "https://assets.mixkit.co/active_storage/sfx/2421/2421-preview.mp3",
	},
	{
		id: "night",
		label: "Night",
		icon: "🌙",
		src: "https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3",
	},
];

export default function SoundBoard() {
	const [activeSounds, setActiveSounds] = useState<
		Record<string, HTMLAudioElement>
	>({});
	const [volumes, setVolumes] = useState<Record<string, number>>({});
	const [presets, setPresets] = useState<
		{ name: string; sounds: Record<string, number> }[]
	>(() => {
		const saved = localStorage.getItem("sound-presets");
		return saved ? JSON.parse(saved) : [];
	});
	const [showSave, setShowSave] = useState(false);
	const [presetName, setPresetName] = useState("");

	useEffect(() => {
		localStorage.setItem("sound-presets", JSON.stringify(presets));
	}, [presets]);

	const toggleSound = (sound: (typeof sounds)[0]) => {
		if (activeSounds[sound.id]) {
			activeSounds[sound.id].pause();
			const { [sound.id]: _, ...rest } = activeSounds;
			setActiveSounds(rest);
		} else {
			const audio = new Audio(sound.src);
			audio.loop = true;
			audio.volume = volumes[sound.id] || 0.5;
			audio.play();
			setActiveSounds({ ...activeSounds, [sound.id]: audio });
		}
	};

	const setVolume = (id: string, vol: number) => {
		setVolumes({ ...volumes, [id]: vol });
		if (activeSounds[id]) activeSounds[id].volume = vol;
	};

	const savePreset = () => {
		if (!presetName) return;
		setPresets([...presets, { name: presetName, sounds: volumes }]);
		setPresetName("");
		setShowSave(false);
	};

	const loadPreset = (preset: (typeof presets)[0]) => {
		Object.entries(preset.sounds).forEach(([id, vol]) => setVolume(id, vol));
	};

	const stopAll = () => {
		Object.values(activeSounds).forEach((a) => a.pause());
		setActiveSounds({});
	};

	return (
		<div className="app-container">
			<Link to="/" className="back-button">
				← Back
			</Link>
			<div className="header">
				<h1>Sound Board</h1>
				<p>Mix ambient sounds</p>
			</div>
			<div className="controls">
				<button className="stop-btn" onClick={stopAll}>
					Stop All
				</button>
				<button className="save-btn" onClick={() => setShowSave(true)}>
					Save Mix
				</button>
			</div>
			<div className="sound-grid">
				{sounds.map((sound) => (
					<div
						key={sound.id}
						className={`sound-card ${activeSounds[sound.id] ? "active" : ""}`}
					>
						<button className="sound-toggle" onClick={() => toggleSound(sound)}>
							<span className="sound-icon">{sound.icon}</span>
							<span className="sound-label">{sound.label}</span>
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.05"
							value={volumes[sound.id] || 0.5}
							onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
							className="volume-slider"
						/>
					</div>
				))}
			</div>
			{presets.length > 0 && (
				<div className="presets-section">
					<h3>Saved Mixes</h3>
					<div className="presets-list">
						{presets.map((preset, i) => (
							<button
								key={i}
								className="preset-btn"
								onClick={() => loadPreset(preset)}
							>
								{preset.name}
							</button>
						))}
					</div>
				</div>
			)}
			{showSave && (
				<div className="modal-overlay" onClick={() => setShowSave(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h3>Save Mix</h3>
						<input
							type="text"
							placeholder="Mix name"
							value={presetName}
							onChange={(e) => setPresetName(e.target.value)}
							autoFocus
						/>
						<div className="modal-actions">
							<button onClick={() => setShowSave(false)}>Cancel</button>
							<button className="save" onClick={savePreset}>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
			<style>{`
        .app-container { min-height: 100vh; background: linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%); color: #e8e8e8; padding: 1.5rem; font-family: 'Outfit', system-ui, sans-serif; }
        .back-button { position: fixed; top: 1.5rem; left: 1.5rem; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; z-index: 10; }
        .header { text-align: center; margin: 1rem 0 1rem; }
        .header h1 { font-size: 2rem; margin: 0; background: linear-gradient(90deg, #56ab2f, #a8e063); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
        .controls { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .controls button { flex: 1; padding: 0.75rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; border: none; font-size: 0.9rem; }
        .stop-btn { background: rgba(255,107,107,0.2); color: #ff6b6b; }
        .save-btn { background: rgba(86,171,47,0.2); color: #56ab2f; }
        .sound-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
        .sound-card { background: rgba(255,255,255,0.04); border-radius: 1rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s; }
        .sound-card.active { border-color: #56ab2f; background: rgba(86,171,47,0.1); }
        .sound-toggle { width: 100%; background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .sound-icon { font-size: 2rem; }
        .sound-label { color: white; font-weight: 500; }
        .volume-slider { width: 100%; margin-top: 0.5rem; accent-color: #56ab2f; }
        .presets-section { background: rgba(255,255,255,0.03); border-radius: 1rem; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
        .presets-section h3 { margin: 0 0 0.75rem; font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
        .presets-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .preset-btn { padding: 0.5rem 1rem; background: rgba(255,255,255,0.08); border: none; border-radius: 1.5rem; color: white; cursor: pointer; font-size: 0.85rem; }
        .preset-btn:hover { background: rgba(86,171,47,0.2); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
        .modal { background: #0f2027; border-radius: 1rem; padding: 1.5rem; width: 100%; max-width: 300px; }
        .modal h3 { margin: 0 0 1rem; color: #56ab2f; }
        .modal input { width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: white; margin-bottom: 0.75rem; box-sizing: border-box; }
        .modal-actions { display: flex; gap: 0.5rem; }
        .modal-actions button { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; cursor: pointer; }
        .modal-actions button:first-child { background: rgba(255,255,255,0.1); color: white; }
        .modal-actions button.save { background: #56ab2f; color: white; font-weight: 600; }
      `}</style>
		</div>
	);
}
