import { CardModel } from "./CardModel";
import { ParticipantModel } from "./ParticipantModel";

export class PlayerModel extends ParticipantModel {
    
    public async drawCard() {
        const card = await super.drawCard();
        if (card) card.hidden = false;
        return card;
    }

    public splitCards() {
        const secondCard = this._cards.pop();
        return secondCard;
    }

    public pushCard(card: CardModel) {
        this._cards.push(card);
    }
}