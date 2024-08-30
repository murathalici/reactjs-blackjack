import React from "react";
import { useGame } from "../App";
import { calculateScore, getCardImageUrl } from "../utils/deckUtils";

const Game = () => {
  const {
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
  } = useGame();

  const canSplit = () => {
    if (playerCards.length !== 2 || isSplitActive || !canSplitOrDouble) {
      return false;
    }

    const card1Value = ["10", "jack", "queen", "king"].includes(
      playerCards[0].value
    )
      ? 10
      : playerCards[0].value;
    const card2Value = ["10", "jack", "queen", "king"].includes(
      playerCards[1].value
    )
      ? 10
      : playerCards[1].value;

    return card1Value === card2Value;
  };

  const hasCardsDealt = playerCards.length === 2 && dealerCards.length === 2;

  return (
    <>
      <div className="flex justify-between w-full max-w-4xl bg-white rounded-lg p-6 shadow-md">
        <div className="w-1/2 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Dealer&apos;s Hand (
            {isDealerTurn
              ? `Score: ${calculateScore(dealerCards)}`
              : `Score: ${calculateScore([dealerCards[0]])}`}
            )
          </h2>
          <div className="flex justify-center">
            <img
              src={getCardImageUrl(dealerCards[0])}
              alt={`${dealerCards[0]?.value} of ${dealerCards[0]?.suit}`}
              className="w-24 h-36 m-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
            <img
              src={
                isDealerTurn
                  ? getCardImageUrl(dealerCards[1])
                  : "https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/png_96_dpi/blue2.png"
              }
              alt={
                isDealerTurn
                  ? `${dealerCards[1]?.value} of ${dealerCards[1]?.suit}`
                  : "Hidden Card"
              }
              className="w-24 h-36 m-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
            {isDealerTurn &&
              dealerCards
                .slice(2)
                .map((card, index) => (
                  <img
                    key={index + 2}
                    src={getCardImageUrl(card)}
                    alt={`${card.value} of ${card.suit}`}
                    className="w-24 h-36 m-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                  />
                ))}
          </div>
        </div>

        <div className="w-1/2 text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Your Hand (Score: {calculateScore(playerCards)})
          </h2>
          <div className="flex justify-center">
            {playerCards.map((card, index) => (
              <img
                key={index}
                src={getCardImageUrl(card)}
                alt={`${card.value} of ${card.suit}`}
                className="w-24 h-36 m-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>

      {splitHand.length > 0 && (
        <div className="w-full max-w-4xl bg-white rounded-lg p-6 shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Split Hand (Score: {calculateScore(splitHand)})
          </h2>
          <div className="flex justify-center">
            {splitHand.map((card, index) => (
              <img
                key={index}
                src={getCardImageUrl(card)}
                alt={`${card.value} of ${card.suit}`}
                className="w-24 h-36 m-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        {gameOver ? (
          <h2 className="text-2xl mb-4 font-semibold">{message}</h2>
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleHit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              Hit
            </button>
            <button
              onClick={handleStand}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
            >
              Stand
            </button>
            {hasCardsDealt && canSplitOrDouble && (
              <>
                {canSplit() && (
                  <button
                    onClick={handleSplit}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
                  >
                    Split
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
