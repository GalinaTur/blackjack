import { TParticipants } from "../data/types";
import { CardModel } from "./CardModel";
import { DeckModel } from "./DeckModel";

export class ParticipantModel {
    protected _cards: CardModel[] = [];

    constructor(
        private _name: TParticipants, 
        private deck: DeckModel) {
    }

    public drawCard() {
        const card = this.deck.getCard();
        if (!card) {
            console.error("No more cards in deck!");
            return;
        };
        this._cards.push(card);
        return card;
    }

    get cards(): readonly CardModel[] {
        const cardsCopy = [...this._cards];
        return cardsCopy;
    }

    get name() {
        return this._name;
    }
}