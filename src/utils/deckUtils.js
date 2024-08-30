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
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const drawCard = (deck) => {
  if (deck.length === 0) return null;

  if (deck.length <= 208) {
    // Reshuffle if the deck is halfway depleted (8 decks * 52 / 2 = 208)
    const reshuffledDeck = shuffleDeck(initializeDeck());
    return { card: reshuffledDeck.pop(), newDeck: reshuffledDeck };
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
