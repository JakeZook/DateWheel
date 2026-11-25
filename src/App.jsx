import { useState } from "react";
import "./App.css";

const dateOptions = {
	evening: [
		"Cheesecake Factory Dinner",
		"Drive in Movie",
		"Mini Golf",
		"Bowling",
		"Escape Room",
		"Movie",
		"Fire Pit Night",
		"Walk",
	],

	chill: [
		"Mall Date",
		"Explore Broomfield",
		"Swimming",
		"Do a project",
		"Go to a fun town",
		"Video Games",
		"Botanical Gardens",
		"Ghost Tour",
	],

	allDay: [
		"Go on a hike",
		"Drive to the mountains",
		"Elitche's",
		"Meow Wolf",
		"Zoo",
		"Art Class",
		"Royal Gorge",
		"Museum",
	],
	movies: [
		"Mandy",
		"star Wars",
		"Dune",
		"Paranorman",
		"Kubo and the six strings",
		"But I'm a cheerleader",
		"Dog soldiers",
		"Ghostbusters",
		"Monster Squad",
		"Train to Busan",
		"Indiana Jones",
		"The Mummy",
		"Ugly Stepsister",
		"Videodrome",
		"Mad God",
		"Missing Link",
		"Interview With a Vampire",
		"Blackberry",
		"The Dirties",
		"The Blob",
		"Basket Case",
		"1408",
		"What We Do in The Shadows",
		"Love and Cameras in America",
	],
};

const colors = [
	"#FF6B6B",
	"#4ECDC4",
	"#45B7D1",
	"#96CEB4",
	"#FFE66D",
	"#F7A072",
	"#C06C84",
	"#6C5CE7",
];

const SIZE = 500;
const RADIUS = 240;
const CENTER = SIZE / 2;

function polarToCartesian(cx, cy, r, angle) {
	const radians = ((angle - 90) * Math.PI) / 180;

	return {
		x: cx + r * Math.cos(radians),

		y: cy + r * Math.sin(radians),
	};
}

function describeArc(startAngle, endAngle) {
	const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);

	const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);

	const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

	return `
    M ${CENTER} ${CENTER}
    L ${start.x} ${start.y}
    A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}
    Z
  `;
}

export default function App() {
	const [category, setCategory] = useState(null);

	const [ideas, setIdeas] = useState([]);

	const [winner, setWinner] = useState("");

	const [rotation, setRotation] = useState(0);

	const [spinning, setSpinning] = useState(false);

	const [showAccept, setShowAccept] = useState(false);

	const getHistory = () => {
		return (
			JSON.parse(localStorage.getItem("dateHistory")) || {
				evening: [],
				chill: [],
				allDay: [],
				movies: [],
			}
		);
	};

	const chooseCategory = (type) => {
		const history = getHistory();

		setCategory(type);

		setIdeas(dateOptions[type].filter((item) => !history[type].includes(item)));

		setWinner("");
		setShowAccept(false);
		setRotation(0);
	};

	const spin = () => {
		if (spinning || ideas.length < 2) return;

		setWinner("");
		setShowAccept(false);
		setSpinning(true);

		const sliceAngle = 360 / ideas.length;

		const randomAngle = Math.floor(Math.random() * 360);

		const finalRotation = rotation + 360 * 6 + randomAngle;

		setRotation(finalRotation);

		setTimeout(() => {
			const normalized = ((finalRotation % 360) + 360) % 360;

			const pointerAngle = (360 - normalized) % 360;

			const index = Math.floor(pointerAngle / sliceAngle);

			setWinner(ideas[index]);

			setShowAccept(true);
			setSpinning(false);
		}, 5000);
	};

	const acceptDate = () => {
		const history = getHistory();

		history[category] = [...history[category], winner];

		localStorage.setItem("dateHistory", JSON.stringify(history));

		setIdeas((prev) => prev.filter((item) => item !== winner));

		setWinner("");
		setShowAccept(false);
	};

	const resetCategory = () => {
		const history = getHistory();

		history[category] = [];

		localStorage.setItem("dateHistory", JSON.stringify(history));

		setIdeas(dateOptions[category]);

		setWinner("");
		setRotation(0);
		setShowAccept(false);
	};

	if (!category) {
		return (
			<div className="container">
				<h1>❤️ Choose Date Type ❤️</h1>

				<button onClick={() => chooseCategory("evening")}>
					🌙 Evening Date
				</button>

				<button onClick={() => chooseCategory("chill")}>
					☀️ Chill Off Day
				</button>

				<button onClick={() => chooseCategory("allDay")}>
					🗓️ All Day Date
				</button>

				<button onClick={() => chooseCategory("movies")}>🎞️ Movies</button>
			</div>
		);
	}

	return (
		<div className="container">
			<h1>❤️ Date Wheel ❤️</h1>

			<h2>
				{category === "evening"
					? "🌙 Evening"
					: category === "chill"
						? "☀️ Chill"
						: category === "allDay"
							? "🗓️ All Day"
							: "Movies"}
			</h2>

			<div className="wheel-container">
				<div className="pointer" />

				<svg
					className="wheel"
					viewBox={`0 0 ${SIZE} ${SIZE}`}
					style={{
						transform: `rotate(${rotation}deg)`,
					}}
				>
					{ideas.map((idea, i) => {
						const angle = 360 / ideas.length;

						const start = i * angle;

						const mid = start + angle / 2;

						const textPos = polarToCartesian(
							CENTER,
							CENTER,
							RADIUS * 0.65,
							mid,
						);

						return (
							<g key={idea}>
								<path
									d={describeArc(start, start + angle)}
									fill={colors[i % colors.length]}
									stroke="white"
									strokeWidth="2"
								/>

								<text
									x={textPos.x}
									y={textPos.y}
									fill="#222"
									fontSize={ideas.length > 8 ? 11 : 14}
									textAnchor="middle"
									dominantBaseline="middle"
									transform={`rotate(${mid - 90},
                    ${textPos.x},
                    ${textPos.y})`}
								>
									{idea}
								</text>
							</g>
						);
					})}
				</svg>
			</div>

			<button onClick={spin} disabled={spinning}>
				{spinning ? "Spinning..." : "Spin"}
			</button>

			{winner && (
				<>
					<h2>🎉 {winner}</h2>

					{showAccept && <button onClick={acceptDate}>❤️ Accept Date</button>}
				</>
			)}

			<button onClick={resetCategory}>Reset This Category</button>

			<button
				onClick={() => {
					setCategory(null);
					setIdeas([]);
				}}
			>
				Change Category
			</button>
		</div>
	);
}
