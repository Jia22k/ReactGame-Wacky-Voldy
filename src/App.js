import React, { useState, useEffect } from "react";
import "./styles.css";
import HogwartsBackground from "./Images/HogwartsBackground.jpeg";
import HatImage from "./Images/SortingHat.png";
import VoldyImage from "./Images/Voldemort.png";
import HarryImage from "./Images/Harry.png";
import "typeface-roboto";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayCircleOutlineTwoToneIcon from "@mui/icons-material/PlayCircleOutlineTwoTone";
import Tooltip from "@mui/material/Tooltip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import WandImage from "./Images/Wand.png";

const CARD_STATES = {
  HAT: "hat",
  VOLDY: "voldy",
  HARRY: "harry",
};

export default function App() {
  const [cards, setCards] = useState(new Array(9).fill(CARD_STATES.HAT));
  const [score, setScore] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");
  const [intervalTime, setIntervalTime] = useState(2000);
  const [revertTime, setRevertTime] = useState(1000);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("Game Over");

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  function handleStartGame() {
    setShowWelcomeDialog(false);
    startGameBasedOnDifficulty();
  }

  function startGameBasedOnDifficulty() {
    let newIntervalTime;
    let newRevertTime;

    if (difficulty === "easy") {
      newIntervalTime = 2000;
      newRevertTime = 1500;
    } else if (difficulty === "medium") {
      newIntervalTime = 1500;
      newRevertTime = 1100;
    } else if (difficulty === "hard") {
      newIntervalTime = 900;
      newRevertTime = 820;
    }

    setIntervalTime(newIntervalTime);
    setRevertTime(newRevertTime);
  }

  function handleRestartGame() {
    setShowGameOverDialog(true);
    setGameOverReason("Game Over, You pressed restart");
  }
  function playAgain() {
    setShowGameOverDialog(false);
    setShowWelcomeDialog(true);
    setScore(0);
    setDifficulty("medium");
  }

  function GameOverDialog() {
    if (!showGameOverDialog) return null;

    return (
      <div className="dialog-overlay">
        <div className="dialog">
          <h1>{gameOverReason}</h1>
          <p>Your Score: {score}</p>
          <button
            onClick={playAgain}
            sx={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "#885e69",
              border: "none",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s, box-shadow 0.3s",
              "&:hover": {
                backgroundColor: "#a76d7f",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              },
              outline: "none",
            }}
            className="start-button"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  function WelcomeDialog({ isOpen, onClose, onDifficultyChange, onStartGame }) {
    if (!isOpen) return null;

    return (
      <div className="dialog-overlay">
        <div className="dialog">
          <h2>Welcome to Whack Voldy</h2>
          <ul style={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}>
            <li style={{ marginBottom: "10px" }}>
              Whack Voldemort and gain 10 points.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Avoid hitting Harry Potter to prevent ending the game.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Clicking on a hat costs 5 points, dont get below 0, its game over
            </li>
          </ul>

          <p style={{ margin: "40px 20px 20px 20px" }}>
            Choose your difficulty level:
          </p>
          <div style={{ margin: "20px" }}>
            <label>
              <input
                type="radio"
                value="easy"
                checked={difficulty === "easy"}
                onChange={onDifficultyChange}
              />
              Easy
            </label>
            <label>
              <input
                type="radio"
                value="medium"
                checked={difficulty === "medium"}
                onChange={onDifficultyChange}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                value="hard"
                checked={difficulty === "hard"}
                onChange={onDifficultyChange}
              />
              Hard
            </label>
          </div>
          <button
            onClick={onStartGame}
            className="start-button"
            sx={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "#885e69",
              border: "none",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s, box-shadow 0.3s",
              "&:hover": {
                backgroundColor: "#a76d7f",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              },
              outline: "none",
            }}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!showWelcomeDialog) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const cardState =
          Math.random() < 0.3 ? CARD_STATES.HARRY : CARD_STATES.VOLDY;
        const newCards = [...cards];
        newCards[randomIndex] =
          newCards[randomIndex] === CARD_STATES.HAT
            ? cardState
            : CARD_STATES.HAT;
        setCards(newCards);

        setTimeout(() => {
          flipCardBackToHat(randomIndex);
        }, revertTime);
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [cards, intervalTime, revertTime, showWelcomeDialog]);

  function whack(index) {
    const newCards = [...cards];
    if (newCards[index] === CARD_STATES.VOLDY) {
      setScore((prevScore) => prevScore + 10);
    } else if (newCards[index] === CARD_STATES.HARRY) {
      setShowGameOverDialog(true);
      setGameOverReason("Oh no, Game Over, You Whacked Harry");
    } else if (newCards[index] === CARD_STATES.HAT) {
      setScore((prevScore) => {
        const newScore = prevScore - 5;
        if (newScore < 0) {
          setGameOverReason("Game Over, your score dropped below zero!");
          setShowGameOverDialog(true);
        }
        return newScore;
      });
    }
    newCards[index] = CARD_STATES.HAT;
    setCards(newCards);
  }

  function flipCardBackToHat(index) {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      if (
        newCards[index] === CARD_STATES.HARRY ||
        newCards[index] === CARD_STATES.VOLDY
      ) {
        newCards[index] = CARD_STATES.HAT;
      }
      return newCards;
    });
  }

  function InfoDialog({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="dialog-overlay">
        <div className="dialog">
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "rgb(136, 94, 105)",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "dimgray",
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>

          <h2>Game Rules</h2>
          <ul style={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}>
            <li style={{ marginBottom: "10px" }}>
              Whack Voldemort and gain 10 points.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Avoid hitting Harry Potter to prevent ending the game.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Clicking on a hat costs 5 points, a negative score is game over
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      className="Background"
      style={{
        backgroundImage: `url(${HogwartsBackground})`,
      }}
    >
      {showWelcomeDialog && (
        <WelcomeDialog
          isOpen={showWelcomeDialog}
          onClose={() => setShowWelcomeDialog(false)}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={handleStartGame}
        />
      )}

      {!showWelcomeDialog && (
        <>
          <div className="header">
            <h1>Whack Voldy</h1>
            <h2>Score: {score}</h2>
            <Tooltip title="Info" placement="left">
              <IconButton
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "8px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  ":hover": {
                    backgroundColor: "rgba(96, 92, 92, 0.4)",
                    borderRadius: "50%",
                  },
                }}
                onClick={() => setDialogOpen(true)}
                aria-label="info"
                className="info-button"
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Restart" placement="left">
              <IconButton
                onClick={handleRestartGame}
                sx={{
                  position: "absolute",
                  top: "50px",
                  right: "10px",
                  color: "white",
                  ":hover": {
                    backgroundColor: "rgba(96, 92, 92, 0.4)",
                  },
                }}
                aria-label="restart"
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </div>

          <InfoDialog
            isOpen={isDialogOpen}
            onClose={() => setDialogOpen(false)}
          />
          <div className="board">
            {cards.map((card, index) => (
              <div className="tile" key={index}>
                <img
                  src={
                    card === CARD_STATES.HAT
                      ? HatImage
                      : card === CARD_STATES.VOLDY
                      ? VoldyImage
                      : HarryImage
                  }
                  alt={card}
                  onClick={() => whack(index)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {showGameOverDialog && <GameOverDialog />}
    </div>
  );
}
