import { Link, Route, Routes, useParams } from "react-router-dom";
import "./App.css";

import ApplianceAge from "./appliance-age";
import BaseEncode from "./base-encode";
import BodyTimer from "./body-timer";
import BreakBingo from "./break-bingo";
import BreatheEasy from "./breathe-easy";
import BucketList from "./bucket-list";
import BudgetEnvelope from "./budget-envelope";
import CalorieRough from "./calorie-rough";
import CarCare from "./car-care";
import CardSort from "./card-sort";
import ChoreRotate from "./chore-rotate";
import CoffeeBrew from "./coffee-brew";
import CoinFlip from "./coin-flip";
import ColorMood from "./color-mood";
import ComplimentBot from "./compliment-bot";
import ConceptMap from "./concept-map";
import Countdown from "./countdown";
import CronRead from "./cron-read";
import CryptoWatch from "./crypto-watch";
import CurrencySnap from "./currency-snap";
import DailyRank from "./daily-rank";
import DecisionDump from "./decision-dump";
import DelegationList from "./delegation-list";
import DiceRoll from "./dice-roll";
import DistanceLog from "./distance-log";
import DoneLog from "./done-log";
import EnergyMap from "./energy-map";
import FeelBetter from "./feel-better";
import FlashDeck from "./flash-deck";
import FocusRoom from "./focus-room";
import FocusScore from "./focus-score";
import GiftIdea from "./gift-idea";
import GoalPath from "./goal-path";
import GratitudeLog from "./gratitude-log";
import GroupSpend from "./group-spend";
import HabitCircles from "./habit-circles";
import HabitPair from "./habit-pair";
import HashIt from "./hash-it";
import HouseFix from "./house-fix";
import Icebreaker from "./icebreaker";
import JsonPretty from "./json-pretty";
import LearnLink from "./learn-link";
import LightStock from "./light-stock";
import MealPlan from "./meal-plan";
import MedicationMind from "./medication-mind";
import MeetingPrep from "./meeting-prep";
import MoodWaves from "./mood-waves";
import MorningKick from "./morning-kick";
import NetworkLog from "./network-log";
import NoteStack from "./note-stack";
import PackTrack from "./pack-track";
import PackingList from "./packing-list";
import PalettePick from "./palette-pick";
import PantryCheck from "./pantry-check";
import PhraseCollector from "./phrase-collector";
import PickerWheel from "./picker-wheel";
import PlantParent from "./plant-parent";
import PomodoroFlow from "./pomodoro-flow";
import PostureCheck from "./posture-check";
import PricePoint from "./price-point";
import ProgressPage from "./progress-page";
import ProjectOutline from "./project-outline";
import QuickPoll from "./quick-poll";
import QuizMe from "./quiz-me";
import QuoteVault from "./quote-vault";
import ReadingLog from "./reading-log";
import ReceiptHold from "./receipt-hold";
import RecipeCost from "./recipe-cost";
import RegexTest from "./regex-test";
import RepCounter from "./rep-counter";
import ScreenTime from "./screen-time";
import SecretSanta from "./secret-santa";
import SkillTree from "./skill-tree";
import SleepClock from "./sleep-clock";
import SocialBattery from "./social-battery";
import SomedayMaybe from "./someday-maybe";
import SoundBoard from "./sound-board";
import SplitTheBill from "./split-the-bill";
import StandCounter from "./stand-counter";
import StorySeed from "./story-seed";
import SubCount from "./sub-count";
import TaskTunnel from "./task-tunnel";
import ThoughtCatch from "./thought-catch";
import TimeBlock from "./time-block";
import TinyWin from "./tiny-win";
import TipQuick from "./tip-quick";
import ToastMaker from "./toast-maker";
import TrafficMind from "./traffic-mind";
import TriggerTrack from "./trigger-track";
import UnitConvert from "./unit-convert";
import UptimeClock from "./uptime-clock";
import UuidGen from "./uuid-gen";
import VocabGrow from "./vocab-grow";
import WaitingOn from "./waiting-on";
import WaterLog from "./water-log";
import WeightTrack from "./weight-track";
import WindDown from "./wind-down";
import WordCollector from "./word-collector";
import WorldClock from "./world-clock";
import WouldYouRather from "./would-you-rather";

const appNames: Record<string, { name: string; icon: string }> = {
	"1": { name: "Pomodoro Flow", icon: "🍅" },
	"2": { name: "Water Log", icon: "💧" },
	"3": { name: "Split the Bill", icon: "🧾" },
	"4": { name: "Habit Circles", icon: "⭕" },
	"5": { name: "Flash Deck", icon: "🃏" },
	"6": { name: "Color Mood", icon: "🎨" },
	"7": { name: "Chore Rotate", icon: "🔄" },
	"8": { name: "Plant Parent", icon: "🌿" },
	"9": { name: "Reading Log", icon: "📚" },
	"10": { name: "UUID Gen", icon: "🔑" },
	"11": { name: "Time Block", icon: "📅" },
	"12": { name: "Coffee Brew", icon: "☕" },
	"13": { name: "Body Timer", icon: "👁️" },
	"14": { name: "Compliment Bot", icon: "✨" },
	"15": { name: "Budget Envelope", icon: "💰" },
	"16": { name: "Phrase Collector", icon: "🗣️" },
	"17": { name: "Sleep Clock", icon: "😴" },
	"18": { name: "Posture Check", icon: "🧘" },
	"19": { name: "Tip Quick", icon: "💵" },
	"20": { name: "Coin Flip", icon: "🪙" },
	"21": { name: "Dice Roll", icon: "🎲" },
	"22": { name: "Picker Wheel", icon: "🎡" },
	"23": { name: "Would You Rather", icon: "🤔" },
	"24": { name: "Story Seed", icon: "✍️" },
	"25": { name: "Recipe Cost", icon: "💲" },
	"26": { name: "Pantry Check", icon: "🫙" },
	"27": { name: "Currency Snap", icon: "💱" },
	"28": { name: "World Clock", icon: "🌍" },
	"29": { name: "Packing List", icon: "🎒" },
	"30": { name: "Bucket List", icon: "🎯" },
	"31": { name: "Quote Vault", icon: "📜" },
	"32": { name: "Sound Board", icon: "🔊" },
	"33": { name: "Palette Pick", icon: "🎨" },
	"34": { name: "Hash It", icon: "#️⃣" },
	"35": { name: "JSON Pretty", icon: "📄" },
	"36": { name: "Regex Test", icon: "🔍" },
	"37": { name: "Cron Read", icon: "⏰" },
	"38": { name: "Base Encode", icon: "🔤" },
	"39": { name: "Unit Convert", icon: "🔢" },
	"40": { name: "Icebreaker", icon: "💬" },
	"41": { name: "Toast Maker", icon: "🥂" },
	"42": { name: "Decision Dump", icon: "🎯" },
	"43": { name: "Secret Santa", icon: "🎅" },
	"44": { name: "Group Spend", icon: "💸" },
	"45": { name: "Gift Idea", icon: "🎁" },
	"46": { name: "Medication Mind", icon: "💊" },
	"47": { name: "Breathe Easy", icon: "🌬️" },
	"48": { name: "Word Collector", icon: "📝" },
	"49": { name: "Card Sort", icon: "🃏" },
	"50": { name: "Daily Rank", icon: "📊" },
	"51": { name: "Focus Score", icon: "🎯" },
	"52": { name: "Energy Map", icon: "⚡" },
	"53": { name: "Skill Tree", icon: "🌳" },
	"54": { name: "Note Stack", icon: "📋" },
	"55": { name: "Meeting Prep", icon: "📝" },
	"56": { name: "Quick Poll", icon: "📊" },
	"57": { name: "Countdown", icon: "⏱️" },
	"58": { name: "Uptime Clock", icon: "🕐" },
	"59": { name: "Stand Counter", icon: "🧍" },
	"60": { name: "Gratitude Log", icon: "🙏" },
	"61": { name: "Thought Catch", icon: "💭" },
	"62": { name: "Meal Plan", icon: "🍽️" },
	"63": { name: "Calorie Rough", icon: "🥗" },
	"64": { name: "Receipt Hold", icon: "🧾" },
	"65": { name: "Goal Path", icon: "🎯" },
	"66": { name: "Distance Log", icon: "🏃" },
	"67": { name: "Weight Track", icon: "⚖️" },
	"68": { name: "Rep Counter", icon: "💪" },
	"69": { name: "Mood Waves", icon: "🌊" },
	"70": { name: "Social Battery", icon: "🔋" },
	"71": { name: "Screen Time", icon: "📱" },
	"72": { name: "Traffic Mind", icon: "🚗" },
	"73": { name: "Pack Track", icon: "📦" },
	"74": { name: "Appliance Age", icon: "🏠" },
	"75": { name: "Light Stock", icon: "💡" },
	"76": { name: "House Fix", icon: "🔧" },
	"77": { name: "Car Care", icon: "🚙" },
	"78": { name: "Crypto Watch", icon: "₿" },
	"79": { name: "Sub Count", icon: "📋" },
	"80": { name: "Price Point", icon: "💲" },
	"81": { name: "Wind Down", icon: "🌙" },
	"82": { name: "Morning Kick", icon: "☀️" },
	"83": { name: "Focus Room", icon: "🎯" },
	"84": { name: "Task Tunnel", icon: "🚇" },
	"85": { name: "Break Bingo", icon: "🧊" },
	"86": { name: "Done Log", icon: "✅" },
	"87": { name: "Delegation List", icon: "📤" },
	"88": { name: "Waiting On", icon: "⏳" },
	"89": { name: "Someday Maybe", icon: "🌠" },
	"90": { name: "Project Outline", icon: "📋" },
	"91": { name: "Habit Pair", icon: "🔗" },
	"92": { name: "Trigger Track", icon: "🎬" },
	"93": { name: "Tiny Win", icon: "🏆" },
	"94": { name: "Feel Better", icon: "💚" },
	"95": { name: "Network Log", icon: "👥" },
	"96": { name: "Learn Link", icon: "📚" },
	"97": { name: "Vocab Grow", icon: "📖" },
	"98": { name: "Concept Map", icon: "🗺️" },
	"99": { name: "Quiz Me", icon: "❓" },
	"100": { name: "Progress Page", icon: "📊" },
};

const appComponents: Record<string, React.ComponentType> = {
	"1": PomodoroFlow,
	"2": WaterLog,
	"3": SplitTheBill,
	"4": HabitCircles,
	"5": FlashDeck,
	"6": ColorMood,
	"7": ChoreRotate,
	"8": PlantParent,
	"9": ReadingLog,
	"10": UuidGen,
	"11": TimeBlock,
	"12": CoffeeBrew,
	"13": BodyTimer,
	"14": ComplimentBot,
	"15": BudgetEnvelope,
	"16": PhraseCollector,
	"17": SleepClock,
	"18": PostureCheck,
	"19": TipQuick,
	"20": CoinFlip,
	"21": DiceRoll,
	"22": PickerWheel,
	"23": WouldYouRather,
	"24": StorySeed,
	"25": RecipeCost,
	"26": PantryCheck,
	"27": CurrencySnap,
	"28": WorldClock,
	"29": PackingList,
	"30": BucketList,
	"31": QuoteVault,
	"32": SoundBoard,
	"33": PalettePick,
	"34": HashIt,
	"35": JsonPretty,
	"36": RegexTest,
	"37": CronRead,
	"38": BaseEncode,
	"39": UnitConvert,
	"40": Icebreaker,
	"41": ToastMaker,
	"42": DecisionDump,
	"43": SecretSanta,
	"44": GroupSpend,
	"45": GiftIdea,
	"46": MedicationMind,
	"47": BreatheEasy,
	"48": WordCollector,
	"49": CardSort,
	"50": DailyRank,
	"51": FocusScore,
	"52": EnergyMap,
	"53": SkillTree,
	"54": NoteStack,
	"55": MeetingPrep,
	"56": QuickPoll,
	"57": Countdown,
	"58": UptimeClock,
	"59": StandCounter,
	"60": GratitudeLog,
	"61": ThoughtCatch,
	"62": MealPlan,
	"63": CalorieRough,
	"64": ReceiptHold,
	"65": GoalPath,
	"66": DistanceLog,
	"67": WeightTrack,
	"68": RepCounter,
	"69": MoodWaves,
	"70": SocialBattery,
	"71": ScreenTime,
	"72": TrafficMind,
	"73": PackTrack,
	"74": ApplianceAge,
	"75": LightStock,
	"76": HouseFix,
	"77": CarCare,
	"78": CryptoWatch,
	"79": SubCount,
	"80": PricePoint,
	"81": WindDown,
	"82": MorningKick,
	"83": FocusRoom,
	"84": TaskTunnel,
	"85": BreakBingo,
	"86": DoneLog,
	"87": DelegationList,
	"88": WaitingOn,
	"89": SomedayMaybe,
	"90": ProjectOutline,
	"91": HabitPair,
	"92": TriggerTrack,
	"93": TinyWin,
	"94": FeelBetter,
	"95": NetworkLog,
	"96": LearnLink,
	"97": VocabGrow,
	"98": ConceptMap,
	"99": QuizMe,
	"100": ProgressPage,
};

const getRandomGradient = (index: number) => {
	const hues = [
		[348, 83, 58],
		[267, 73, 60],
		[200, 90, 50],
		[160, 65, 50],
		[35, 90, 55],
		[320, 80, 55],
		[230, 80, 65],
	];
	const baseHue = hues[index % hues.length];
	const h1 = (baseHue[0] + ((index * 17) % 30)) % 360;
	const h2 = (h1 + 45 + ((index * 11) % 40)) % 360;
	return {
		"--gradient-start": `hsl(${h1}, ${baseHue[1]}%, ${baseHue[2]}%)`,
		"--gradient-end": `hsl(${h2}, ${baseHue[1]}%, ${baseHue[2] - 15}%)`,
	} as React.CSSProperties;
};

function Gallery() {
	const apps = Array.from({ length: 100 }, (_, i) => {
		const id = (i + 1).toString();
		return {
			id: i + 1,
			name: appNames[id]?.name || `App ${i + 1}`,
			icon: appNames[id]?.icon || "",
		};
	});
	return (
		<div className="gallery-container">
			<h1 className="gallery-header">[AUTHOR]'s entries - 100-App Challenge</h1>
			<div className="gallery-grid">
				{apps.map((app, i) => (
					<Link
						to={`/app/${app.id}`}
						key={app.id}
						className="app-card"
						style={getRandomGradient(i)}
					>
						<span className="app-icon">{app.icon}</span>
						<span className="app-number">{app.id}</span>
						<span className="app-title">{app.name}</span>
					</Link>
				))}
			</div>
		</div>
	);
}

function AppWrapper() {
	const { appId } = useParams();
	const Component = appId ? appComponents[appId] : null;
	if (!Component)
		return (
			<div
				style={{
					color: "white",
					padding: "2rem",
					textAlign: "center",
					background: "#1a1a2e",
					minHeight: "100vh",
				}}
			>
				<h1>App Not Found</h1>
				<p>This app hasn't been implemented yet.</p>
				<Link to="/" style={{ color: "#4ecdc4" }}>
					← Back to Gallery
				</Link>
			</div>
		);
	return <Component />;
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Gallery />} />
			<Route path="/app/:appId" element={<AppWrapper />} />
		</Routes>
	);
}

export default App;
