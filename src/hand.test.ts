import { Card, Suits } from './card'
import { Hand } from './hand'
import { Rank } from './handPower'

describe('Hand', () => {
  it('Can determined one pair', () => {
    const cards = [
      new Card(10, Suits.Club),
      new Card(10, Suits.Diamond),
      new Card(14, Suits.Club),
      new Card(12, Suits.Club),
      new Card(11, Suits.Club),
    ]
    const hand = new Hand(cards)
    const result = hand.power()
    expect(result.rank).toEqual(Rank.OnePair)
    expect(result.highs).toEqual([10, 14, 12, 11])
  })

  it('Can determined two pair', () => {
    const cards = [
      new Card(10, Suits.Club),
      new Card(10, Suits.Diamond),
      new Card(11, Suits.Club),
      new Card(12, Suits.Club),
      new Card(11, Suits.Club),
    ]
    const hand = new Hand(cards)
    const result = hand.power()
    expect(result.rank).toEqual(Rank.TwoPairs)
    expect(result.highs).toEqual([11, 10, 12])
  })

  it('Can determined three of a kind', () => {
    const cards = [
      new Card(10, Suits.Club),
      new Card(12, Suits.Diamond),
      new Card(11, Suits.Club),
      new Card(11, Suits.Club),
      new Card(11, Suits.Club),
    ]
    const hand = new Hand(cards)
    const result = hand.power()
    expect(result.rank).toEqual(Rank.ThreeOfAKind)
    expect(result.highs).toEqual([11, 12, 10])
  })

  it('Can determined straight', () => {
    const cards = [
      new Card(10, Suits.Club),
      new Card(11, Suits.Diamond),
      new Card(12, Suits.Club),
      new Card(13, Suits.Club),
      new Card(14, Suits.Club),
    ]
    const hand = new Hand(cards)
    const result = hand.power()
    expect(result.rank).toEqual(Rank.Straight)
    expect(result.highs).toEqual([14, 13, 12, 11, 10])
  })

  it('Can determined straight ace first', () => {
    const cards = [
      new Card(14, Suits.Club),
      new Card(2, Suits.Diamond),
      new Card(3, Suits.Club),
      new Card(4, Suits.Club),
      new Card(5, Suits.Club),
    ]
    const hand = new Hand(cards)
    const result = hand.power()
    expect(result.rank).toEqual(Rank.Straight)
    expect(result.highs).toEqual([5, 4, 3, 2, 1])
  })
})
