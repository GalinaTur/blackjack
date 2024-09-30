import { Main } from "../main";
import { DealerModel } from "../model/DealerModel";
import { ParticipantController } from "./ParticipantController";
import { PointsController } from "./PointsController";
import { RoundController } from "./RoundController";

export class DealerController extends ParticipantController<DealerModel> {

    constructor(roundController: RoundController, pointsController: PointsController, hand: DealerModel) {
        super(roundController, pointsController, hand)
    }

    public async play() {
        if (this.pointsFrom(this.hand.cards) >= 17) {
            this.onStand();
            return;
        }
        await this.onHit();
    }

    public async checkForBJ() {
        const holeCardIndex = this.hand.holeCardIndex;
        if (!holeCardIndex) return false;
        let points = this.pointsFrom(this.hand.cards);
        if (points !== 10 && points !== 11) return false;
        let holeCardPoints = this.pointsController.getCardPoints(this.hand.cards[holeCardIndex]);
        if (points + holeCardPoints === 21) {
            await this.revealHoleCard();
            return true;
        }
        return false;
    }

    public async handleTurn() {
        if (this.hand.holeCardIndex) await this.revealHoleCard();
        if (this.pointsController.isBust(this.hand.cards)) {
            this.onBust();
            return;
        }
        this.play();
    }

    protected onStand() {
        const playerResult = this.pointsController.comparePoints(this.hand.cards, this.roundController.roundModel.mainHand.cards);
        const splitResult = this.roundController.roundModel.splitHand && this.pointsController.comparePoints(this.hand.cards, this.roundController.roundModel.splitHand.cards);

        if (!this.roundController.roundModel.getResult().main) this.roundController.roundModel.setResult(playerResult, 'player');
        if (splitResult && !this.roundController.roundModel.getResult().split) this.roundController.roundModel.setResult(splitResult, 'split');

        super.onStand();
    }

    public async revealHoleCard() {
        return new Promise<void>(resolve => {
            const cardIndex = this.hand.revealHoleCard();
            if (!cardIndex) return;
            const totalPoints = this.pointsFrom(this.hand.cards);
            Main.signalController.card.open.emit({ cardIndex, totalPoints, resolve });
        })
    }

    private onBust() {
        if (!this.roundController.roundModel.getResult().main) this.roundController.roundModel.setResult('dealerBust', 'player');
        if (this.roundController.roundModel.splitHand && !this.roundController.roundModel.getResult().split) this.roundController.roundModel.setResult('dealerBust', 'split');

        this.roundController.endTurn();
    }
}