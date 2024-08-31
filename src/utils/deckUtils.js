const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
  "ace",
];
const RESHUFFLE_THRESHOLD = 0.75; // Reshuffle when 75% of the deck is used

export const initializeDeck = () => {
  const newDeck = [];
  for (let i = 0; i < 8; i += 1) {
    // 8 decks
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ value, suit });
      }
    }
  }
  return newDeck;
};

export const shuffleDeck = (deck) => {
  // Fisher-Yates (Knuth) Shuffle Algorithm
  const fisherYatesShuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  };

  // Perform the Fisher-Yates shuffle multiple times to simulate thorough mixing
  for (let i = 0; i < 3; i++) {
    fisherYatesShuffle(deck);
  }

  // Simulate a casino-style "cut"
  const cutPoint =
    Math.floor(Math.random() * (deck.length / 2)) + deck.length / 4;
  const cutDeck = deck.splice(0, cutPoint);
  deck.push(...cutDeck);

  // Optionally perform an additional light shuffle to simulate the final cut
  fisherYatesShuffle(deck);

  return deck;
};

export const drawCard = (deck) => {
  if (deck.length === 0) return null;

  const initialDeckSize = 8 * 52; // Assuming 8 decks, each with 52 cards
  const remainingCardsPercentage = deck.length / initialDeckSize;

  if (remainingCardsPercentage <= 1 - RESHUFFLE_THRESHOLD) {
    // Reshuffle if the threshold is reached
    deck = shuffleDeck(initializeDeck());
  }

  return { card: deck.pop(), newDeck: deck };
};

export const calculateScore = (cards) => {
  let score = 0;
  let aceCount = 0;

  cards.forEach((card) => {
    if (!card) return;

    if (["king", "queen", "jack"].includes(card.value)) {
      score += 10;
    } else if (card.value === "ace") {
      aceCount += 1;
      score += 11;
    } else {
      score += parseInt(card.value, 10);
    }
  });

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }

  return score;
};

export const getCardImageUrl = (card) => {
  if (!card || !card.suit || !card.value) {
    return "https://tekeye.uk/playing_cards/images/svg_playing_cards/backs/png_96_dpi/blue2.png";
  }
  return `https://tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/${card.suit}_${card.value}.png`;
};
