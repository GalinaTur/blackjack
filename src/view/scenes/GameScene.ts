import { Container, Point, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { IRoundResult, IScene, TBets, TResult } from "../../data/types";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { TParticipants } from "../../data/types";
import { Animations } from "../styles/Animations";
import { Hand } from "./sceneComponents/Hand";
import { PlayersHand } from "./sceneComponents/PlayersHand";
import { SOUNDS } from "../../data/constants";
import { ChipButton } from "./sceneComponents/buttons/ChipButton";

export class GameScene extends Container implements IScene<void> {
    private cardsShoe = new Container();
    private dealersHand = new Hand('dealer');
    private playersHand = new PlayersHand('player');
    private splitHand: PlayersHand | null = null;
    private activeHand: PlayersHand | null = null;

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.setShoe();
        this.setEventListeners();
        this.sortableChildren = true;
        this.dealersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.3);
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.65);
        this.addChild(this.dealersHand, this.playersHand);
    }

    private setEventListeners() {
        Main.signalsController.player.double.add(this.onDoubleBet, this);
    }

    public setActiveHand(hand: TParticipants) {
        if (hand === 'player') {
            this.activeHand = this.playersHand;
            this.playersHand.setPointer();
        } else if (hand === 'split') {
            if (this.activeHand === this.splitHand) return;
            this.activeHand = this.splitHand;
            this.playersHand.removePointer();
            this.splitHand && this.splitHand.setPointer()
        } else if (hand === 'dealer') {
            this.playersHand.removePointer();
            this.splitHand && this.splitHand.removePointer();
        }
    }

    public async onCardDeal(person: TParticipants, card: CardModel, points: number, resolveAt: string) {
        const cardView = new CardView(card);
        cardView.scale.set(0.89)
        cardView.angle = -45;
        cardView.position.set(50, 121);
        this.cardsShoe.addChild(cardView);
        await Animations.cards.pull(cardView);
        const globalPosition = this.cardsShoe.toGlobal(new Point(cardView.x, cardView.y));
        this.cardsShoe.removeChild(cardView);

        let hand: Hand | null = null;
        if (person === 'dealer') hand = this.dealersHand;
        if (person === 'player') hand = this.playersHand;
        if (person === 'split') hand = this.splitHand;
        if (!hand) return;

        await hand.dealCard(cardView, globalPosition, resolveAt);
        if (hand.cards.length < 2) return;
        hand.points = points;
    }

    public async onCardOpen(cardIndex: number, points: number) {
        const cardView = this.dealersHand.cards[cardIndex];
        if (!cardView) return;
        this.playOpenCardSound()
        await cardView.animatedOpen();
        this.dealersHand.points = points;
    }


    private playOpenCardSound() {
        const sound = Main.assetsController.getSound(SOUNDS.flipCard);
        sound.play();
    }

    public renderWinPopup(winSize: number) {
        const background = Main.assetsController.getSprite('finalLabel');
        background.anchor.set(0.5);
        background.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.4)
        background.scale.set(0);
        background.zIndex = 5;
        const text = new Text(`${winSize}$`, Textstyles.WIN_TEXTSTYLE);
        text.anchor.set(0.5, 0)
        text.position.set(0, 80)
        background.addChild(text);
        Animations.popup.show(background);
        return background;
    }

    private setShoe() {
        const shoe = Main.assetsController.getSprite('cardsShoe');
        const shoePart = Main.assetsController.getSprite('cardsShoePart');
        shoe.anchor.set(0, 0);
        shoePart.anchor.set(0, 0.44);
        this.cardsShoe.addChild(shoe);
        this.cardsShoe.scale.set(Main.screenSize.height / 600);
        this.cardsShoe.sortableChildren = true;
        this.cardsShoe.position.set(Main.screenSize.width * 0.75, 0);
        shoePart.zIndex = 2;
        shoePart.position.set(shoe.position.x, shoePart.height)

        this.cardsShoe.addChild(shoePart);
        this.addChild(this.cardsShoe);
    }

    public async onDoubleBet() {
        const activeHand = this.activeHand || this.playersHand;
        await activeHand.doubleBet();
        Main.signalsController.bet.doubled.emit(activeHand.name);
    }

    public async onBetUpdate(chipsStack: TBets[]) {
        if (this.splitHand && !this.splitHand.chipsStack) {
            chipsStack.forEach(async (value, index) => {
                setTimeout(() => {
                    const chip = this.splitHand!.setChip(value, index);
                    chip.position.set(Main.screenSize.width/4, Main.screenSize.height);
                    this.splitHand!.placeChip(chip)
                }, 200 * index)
            })
        }
        this.activeHand ? this.activeHand.onChipsStackUpdate(chipsStack) : this.playersHand.onChipsStackUpdate(chipsStack);
    }

    public async onChipClick(chip: ChipButton) {
        const chipView = chip.clone();
        if (!chipView) return;
        await this.playersHand.placeChip(chipView);
    }

    public async splitCards(playerCards: readonly CardModel[], splitCards: readonly CardModel[]) {
        this.removeChild(this.playersHand);
        const chipsStack = this.playersHand.chipsStack;
        this.splitHand = new PlayersHand('split');
        this.playersHand = new PlayersHand('player');
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.65);
        this.splitHand.position.set(Main.screenSize.width / 1.9, Main.screenSize.height * 0.65);
        this.playersHand.updateCards(playerCards);
        this.splitHand.updateCards(splitCards);

        this.addChild(this.splitHand);
        this.addChild(this.playersHand);
        this.playSound(SOUNDS.slideCard);

        this.playersHand.chipsStack = chipsStack
        this.playersHand.addChild(chipsStack!)

        await Animations.hand.split(this.playersHand, this.splitHand);
    }

    private playSound(soundID: string) {
        const sound = Main.assetsController.getSound(soundID);
        sound.play();
    }

    public onTurnEnd(result: IRoundResult) {
        result.main && this.setLabels(result.main, 'player');
        result.split && this.setLabels(result.split, 'split');
    }

    private setLabels(result: TResult, hand: TParticipants) {
        const currentHand = hand === 'split' ? this.splitHand : this.playersHand;
        if (currentHand?.hasLabel) return;
        switch (result) {
            case "dealerBJ":
                this.dealersHand.setBJLabel();
                currentHand!.setRegularLabel('LOSE');
                this.playSound(SOUNDS.dealerBJ);
                break;

            case "playerBJ":
                currentHand!.setBJLabel();
                this.playSound(SOUNDS.playerBJ);
                break;

            case "playerBust":
                currentHand!.setRegularLabel('BUST');
                this.playSound(SOUNDS.tooMany);
                break;

            case "dealerBust":
                this.dealersHand.setRegularLabel('BUST');
                currentHand!.setWinLabel('WIN');
                this.playSound(SOUNDS.win)
                break;

            case "win":
                currentHand!.setWinLabel('WIN');
                this.playSound(SOUNDS.win)
                break;

            case "lose":
                currentHand!.setRegularLabel('LOSE');
                this.playSound(SOUNDS.lose);
                break;

            case "push":
            case "pushBJ":
                this.dealersHand.setRegularLabel('PUSH');
                currentHand!.setRegularLabel('PUSH');
                this.playSound(SOUNDS.push)
                break;
        }
    }

    public onResize() {
        this.cardsShoe.scale.set(Main.screenSize.height / 600);

        // this.dealersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.2);
        // this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.6);

        if (Main.screenSize.height > Main.screenSize.width) {
            this.cardsShoe.position.set(Main.screenSize.width * 0.80, 30);
            return;
        }
        this.cardsShoe.position.set(Main.screenSize.width * 0.75, 0);
    };

    public deactivate() {
        Main.signalsController.player.double.remove(this.onDoubleBet);
    }
}