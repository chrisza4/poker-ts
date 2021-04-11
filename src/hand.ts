import { Card } from './card'
import { ComparisonResult, Rank, HandPower } from './handPower'
import PatternMatcher from './utils/patternMatcher'

type CardFrequencies = { [key: number]: number }
type StraightResult = {
  straight: boolean
  highs: number[]
}

export class Hand {
  private cards: Card[]

  constructor(cards: Card[]) {
    this.cards = cards
  }

  private isSamePattern(src: number[], dest: number[]): boolean {
    return new PatternMatcher(src, dest).isSamePattern()
  }

  private isStraight(highs: number[]): StraightResult {
    function isBackwardConsequtive(cardValues: number[]): boolean {
      for (let index = 0; index < cardValues.length - 1; index++) {
        const thisCardValue = cardValues[index]
        const nextCardValue = cardValues[index + 1]
        if (thisCardValue - 1 !== nextCardValue) {
          return false
        }
      }
      return true
    }

    if (highs.length !== 5) {
      return { straight: false, highs }
    }
    if (isBackwardConsequtive(highs)) {
      return { straight: true, highs }
    }
    const highsAceFirst = highs
      .map((h) => (h === 14 ? 1 : h))
      .sort()
      .reverse()
    if (isBackwardConsequtive(highsAceFirst)) {
      return { straight: true, highs: highsAceFirst }
    }
    return { straight: false, highs }
  }

  private isFlush(): boolean {
    return new Set(this.cards.map((c) => c.suits)).size === 1
  }

  public compareWith(anotherHand: Hand): ComparisonResult {
    return this.power().compareWith(anotherHand.power())
  }

  public power(): HandPower {
    const freq = this.cards.reduce<CardFrequencies>((acc, card) => {
      acc[card.number] = (acc[card.number] || 0) + 1
      return acc
    }, {})
    const frequencyPattern = Object.values(freq).sort().reverse()
    const initialHighs = Object.keys(freq)
      .map((a) => parseInt(a, 10))
      .sort((b, a) => {
        if (freq[a] < freq[b]) return -1
        if (freq[a] > freq[b]) return 1
        if (a < b) return -1
        if (b > a) return 1
        return 0
      })
    const flush = this.isFlush()
    const { straight, highs } = this.isStraight(initialHighs)

    if (straight && flush) {
      return new HandPower(Rank.StraightFlush, highs)
    }
    if (this.isSamePattern(frequencyPattern, [4, 1])) {
      return new HandPower(Rank.FourOfAKind, highs)
    }
    if (this.isSamePattern(frequencyPattern, [3, 2])) {
      return new HandPower(Rank.FullHouse, highs)
    }
    if (flush) {
      return new HandPower(Rank.Flush, highs)
    }
    if (straight) {
      return new HandPower(Rank.Straight, highs)
    }
    if (this.isSamePattern(frequencyPattern, [3, 1, 1])) {
      return new HandPower(Rank.ThreeOfAKind, highs)
    }
    if (this.isSamePattern(frequencyPattern, [2, 2, 1])) {
      return new HandPower(Rank.TwoPairs, highs)
    }
    if (this.isSamePattern(frequencyPattern, [2, 1, 1, 1])) {
      return new HandPower(Rank.OnePair, highs)
    }
    throw Error(
      `Unexpected pattern ${JSON.stringify(frequencyPattern, null, 2)}`
    )
  }
}
