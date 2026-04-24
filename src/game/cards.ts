export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'

export type Card = {
  id: string
  suit: Suit
  rank: Rank
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function makeDeck(): Card[] {
  const cards: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: `${rank}${suit}`, suit, rank })
    }
  }
  return cards
}

export function makeShuffledDeck(): Card[] {
  const deck = makeDeck()
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = deck[i]
    deck[i] = deck[j]
    deck[j] = tmp
  }
  return deck
}

export function cardLabel(card: Card): string {
  return `${card.rank}${card.suit}`
}

