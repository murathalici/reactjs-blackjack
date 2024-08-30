import React, { useState, useEffect, useContext, createContext } from "react";
import Game from "./components/Game";
import {
  initializeDeck,
  shuffleDeck,
  drawCard,
  calculateScore,
} from "./utils/deckUtils";

// Context for global state management
const GameContext = createContext();

export const useGame = () => useContext(GameContext);

function App() {
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [splitHand, setSplitHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [isDealerTurn, setIsDealerTurn] = useState(false);
  const [isSplitActive, setIsSplitActive] = useState(false);
  const [canSplitOrDouble, setCanSplitOrDouble] = useState(true);
  const [currentHand, setCurrentHand] = useState("original");

  useEffect(() => {
    resetDeck();
  }, []);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        startGame(); // Start a new game after 2 seconds
      }, 2000);
    }
  }, [gameOver]);

  const resetDeck = () => {
    const newDeck = shuffleDeck(initializeDeck());
    setDeck(newDeck);
    startGame(newDeck); // Start the game immediately after deck reset
  };

  const startGame = (currentDeck = deck) => {
    if (!currentDeck || currentDeck.length < 4) {
      currentDeck = shuffleDeck(initializeDeck());
      setDeck(currentDeck);
    }

    const { card: playerCard1, newDeck: deckAfterPlayer1 } =
      drawCard(currentDeck);
    const { card: playerCard2, newDeck: deckAfterPlayer2 } =
      drawCard(deckAfterPlayer1);
    const { card: dealerCard1, newDeck: deckAfterDealer1 } =
      drawCard(deckAfterPlayer2);
    const { card: dealerCard2, newDeck: finalDeck } =
      drawCard(deckAfterDealer1);

    setDeck(finalDeck);
    setPlayerCards([playerCard1, playerCard2]);
    setDealerCards([dealerCard1, dealerCard2]);

    setSplitHand([]);
    setGameOver(false);
    setMessage("");
    setIsDealerTurn(false);
    setIsSplitActive(false);
    setCanSplitOrDouble(true);
    setCurrentHand("original");

    if (calculateScore([playerCard1, playerCard2]) === 21) {
      endGame("Blackjack! You win!");
    }
  };

  const handleHit = () => {
    if (gameOver) return;

    const { card: newCard, newDeck } = drawCard(deck);
    if (!newCard) return;

    setDeck(newDeck);

    if (currentHand === "split") {
      const newSplitHand = [...splitHand, newCard];
      setSplitHand(newSplitHand);
      if (calculateScore(newSplitHand) > 21) {
        setMessage("You bust on split hand!");
        if (playerCards.length > 0) {
          setCurrentHand("original");
          setIsSplitActive(false);
        } else {
          handleStand();
        }
      }
    } else {
      const newPlayerCards = [...playerCards, newCard];
      setPlayerCards(newPlayerCards);
      if (calculateScore(newPlayerCards) > 21) {
        setMessage("You bust on original hand!");
        if (splitHand.length > 0) {
          setCurrentHand("split");
        } else {
          endGame("You bust!");
        }
      }
    }
    setCanSplitOrDouble(false);
  };

  const handleStand = () => {
    if (currentHand === "split") {
      setIsDealerTurn(true);
      dealerTurn();
    } else if (splitHand.length > 0) {
      setMessage("Now playing your split hand.");
      setCurrentHand("split");
      setIsSplitActive(true);
    } else {
      setIsDealerTurn(true);
      dealerTurn();
    }
  };

  const handleSplit = () => {
    if (
      playerCards.length === 2 &&
      playerCards[0].value === playerCards[1].value
    ) {
      setSplitHand([playerCards[1]]);
      setPlayerCards([playerCards[0]]);
      setIsSplitActive(true);
      setCurrentHand("original");
    } else {
      setMessage("Cannot split these cards!");
    }
  };

  const dealerTurn = () => {
    let dealerScore = calculateScore(dealerCards);

    while (dealerScore < 17) {
      const { card: newCard, newDeck } = drawCard(deck);
      if (!newCard) break;
      const newDealerCards = [...dealerCards, newCard];
      setDealerCards(newDealerCards);
      dealerScore = calculateScore(newDealerCards);
      setDeck(newDeck);
    }

    const playerScore = calculateScore(playerCards);
    const splitScore = splitHand.length > 0 ? calculateScore(splitHand) : null;

    if (splitScore !== null && currentHand === "split") {
      evaluateSplitHand(dealerScore, splitScore);
    }

    evaluateMainHand(dealerScore, playerScore);
  };

  const evaluateSplitHand = (dealerScore, splitScore) => {
    if (dealerScore > 21 || splitScore > dealerScore) {
      setMessage("You win on split hand!");
      setWins((prev) => prev + 1);
    } else if (splitScore === dealerScore) {
      setMessage("It's a tie on split hand!");
    } else {
      setMessage("Dealer wins on split hand!");
      setLosses((prev) => prev + 1);
    }
  };

  const evaluateMainHand = (dealerScore, playerScore) => {
    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage((prev) => `${prev} You win!`);
      setWins((prev) => prev + 1);
    } else if (playerScore === dealerScore) {
      setMessage((prev) => `${prev} It's a tie!`);
    } else {
      setMessage((prev) => `${prev} Dealer wins!`);
      setLosses((prev) => prev + 1);
    }
    setGameOver(true);
  };

  const endGame = (endMessage) => {
    setGameOver(true);
    setMessage(endMessage);

    // Automatically start a new game after 2 seconds
    setTimeout(() => {
      setGameOver(false);
      startGame(deck);
    }, 2000);
  };

  return (
    <GameContext.Provider
      value={{
        playerCards,
        dealerCards,
        splitHand,
        gameOver,
        message,
        isDealerTurn,
        isSplitActive,
        handleHit,
        handleStand,
        handleSplit,
        canSplitOrDouble,
        currentHand,
      }}
    >
      <div className="min-h-screen bg-gradient-to-r from-green-500 to-teal-700 text-white flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold mb-8 font-sans">
          Blackjack Game
        </h1>
        <p className="mb-4 text-xl">
          Wins: {wins} | Losses: {losses}
        </p>
        <Game />
      </div>
    </GameContext.Provider>
  );
}

export default App;
