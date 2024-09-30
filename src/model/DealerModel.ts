import { ParticipantModel } from "./ParticipantModel";

export class DealerModel extends ParticipantModel {

    public drawCard() {
        const card = super.drawCard();
        if (card && this._cards.length !== 2) card.hidden = false;
        return card;
    }

    public revealHoleCard() {
        const holeCardIndex = this.holeCardIndex
        if (!holeCardIndex) return;
        this.cards[holeCardIndex].hidden = false;
        return holeCardIndex;
    }

    get holeCardIndex() {
        const holeCardIndex = this.cards.findIndex(card => card.hidden);
        if (holeCardIndex === -1) return null;
        return holeCardIndex;
    }
}