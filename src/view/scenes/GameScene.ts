import { Container, Point, Sprite, SpriteMaskFilter, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { IRoundResult, IScene, TBets, TResult } from "../../data/types";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { TParticipants } from "../../data/types";
import { Animations } from "../styles/Animations";
import { Hand } from "./sceneComponents/Hand";
import { PlayersHand } from "./sceneComponents/PlayersHand";

export class GameScene extends Container implements IScene<void> {
    private cardsShoe = new Container();
    private dealersHand = new Hand('dealer');
    private playersHand = new PlayersHand('player');
    private splitHand: PlayersHand | null = null;
    private chipsStack = new Container();
    private activeHand: PlayersHand | null = null;

    constructor() {
        super();
        this.init();
    }

    private async init() {
        await this.setShoe();
        this.setEventListeners();
        this.sortableChildren = true;
        this.chipsStack.zIndex = 1;
        this.dealersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.3);
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.65);
        this.playersHand.addChild(this.chipsStack);
        this.addChild(this.dealersHand, this.playersHand);
    }

    private setEventListeners() {
        Main.signalController.bet.cleared.add(this.onBetClear, this);
        Main.signalController.player.double.addPriority(this.onDoubleBet, this);
        // Main.signalController.bet.doubled.addPriority(this.onDoubleBet, this);
    }

    public async setActiveHand(hand: TParticipants) {
        if (hand === 'player') {
            this.activeHand = this.playersHand;
            await this.playersHand.setPointer();
        } else if (hand === 'split') {
            this.activeHand = this.splitHand;
            this.playersHand.removePointer();
            this.splitHand && await this.splitHand.setPointer()
        } else if (hand === 'dealer') {
            this.playersHand.removePointer();
            this.splitHand && this.splitHand.removePointer();
        }
    }

    public async onCardDeal(person: TParticipants, card: CardModel, points: number) {
        const cardView = await CardView.build(card);
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

        await hand.dealCard(cardView, globalPosition);
        if (hand.cards.length < 2) return;
        hand.points = points;
    }

    public async onCardOpen(card: CardModel, points: number) {
        const cardView = this.dealersHand.cards.find((cardView) => cardView.value === card.value);
        if (!cardView) return;
        await cardView.animatedOpen();
        this.dealersHand.points = points;
    }

    public async renderWinPopup(winSize: number) {
        const background = await Main.assetsLoader.getSprite('finalLabel');
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

    private async setShoe() {
        const shoe = await Main.assetsLoader.getSprite('cardsShoe');
        const shoePart = await Main.assetsLoader.getSprite('cardsShoePart');
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

    private onBetClear() {
        Animations.chipStack.remove(this.chipsStack);
        this.chipsStack.removeChildren();
        this.chipsStack.position.set(0, 0);
    }

    public async onDoubleBet() {
        this.activeHand ? await this.activeHand.doubleBet() : await this.playersHand.doubleBet();
        Main.signalController.bet.doubled.emit(this.activeHand?.name || this.playersHand.name);
    }

    public onBetUpdate(chipsStack: TBets[]) {
        if (this.splitHand && !this.splitHand.chipsStack) {
            chipsStack.forEach((value, index) => {
                setTimeout(() => {
                    this.splitHand!.addChipToStack(value, new Point(Main.screenSize.width * 0.2, Main.screenSize.height + 100))
                }, 200 * index)
            })
        }
        this.activeHand ? this.activeHand.onChipsStackUpdate(chipsStack) : this.playersHand.onChipsStackUpdate(chipsStack);
        // else {
        //     await this.splitHand.onChipsStackUpdate(chipsStack);
        // }
    }

    public async onChipClick(value: TBets, globalPosition: Point) {
        await this.playersHand.addChipToStack(value, globalPosition);
    }

    public async splitCards(playerCards: CardModel[], splitCards: CardModel[]) {
        this.removeChild(this.playersHand);
        this.splitHand = new PlayersHand('split');
        this.playersHand = new PlayersHand('player')
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.65);
        this.splitHand.position.set(Main.screenSize.width / 1.9, Main.screenSize.height * 0.65);
        this.playersHand.updateCards(playerCards)
        this.splitHand.updateCards(splitCards)

        this.addChild(this.splitHand);
        this.addChild(this.playersHand);
        await Animations.hand.split(this.playersHand, this.splitHand);
    }

    public onTurnEnd(result: IRoundResult) {
        result.main && this.setLabels(result.main, 'player');
        result.split && this.setLabels(result.split, 'split');
    }

    private setLabels(result: TResult, hand: TParticipants) {
        const currentHand = hand === 'split' ? this.splitHand : this.playersHand
        switch (result) {
            case "dealerBJ":
                // this.setBJLabel(this.dealersHand);
                // this.setRegularLabel(this.playersHand, 'LOSE');
                this.dealersHand.setBJLabel();
                currentHand!.setRegularLabel('LOSE');
                break;
            case "playerBJ":
                // this.setBJLabel(this.playersHand);
                currentHand!.setBJLabel();
                break;
            case "playerBust":
                // this.playersHand.addLabel(result)
                // this.setRegularLabel(this.playersHand, 'BUST');
                currentHand!.setRegularLabel('BUST')
                break;
            case "dealerBust":
                // this.setRegularLabel(this.dealersHand, 'BUST');
                // this.setWinLabel(this.playersHand, 'WIN');
                this.dealersHand.setRegularLabel('BUST');
                currentHand!.setWinLabel('WIN');
                break;
            case "win":
                currentHand!.setWinLabel('WIN');
                break;
            case "lose":
                currentHand!.setRegularLabel('LOSE')
                break;
            case "push":
            case "pushBJ":
                this.dealersHand.setRegularLabel('PUSH');
                currentHand!.setRegularLabel('PUSH');
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
        Main.signalController.bet.cleared.remove(this.onBetClear);
        Main.signalController.player.double.remove(this.onDoubleBet);
    }
}