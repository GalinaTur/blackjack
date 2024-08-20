import { CardModel } from "./CardModel";
import { HandModel } from "./HandModel";
import { Person } from "./Person";

export class DealerModel extends Person {
    mainHand: HandModel;

    constructor() {
        super();
        this.mainHand = new HandModel();
    }

    hit() {

    }

    stand() {

    }

    drawCard(card: CardModel): void {
        if (this.mainHand.cards.length === 0) {
            card.hidden = false;
        }

        this.mainHand.cards.push(card);
    }
}