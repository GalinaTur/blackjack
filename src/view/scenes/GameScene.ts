import { Container, Point, SpriteMaskFilter, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { TRoundResult, IScene, TBets, EChips } from "../../data/types";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { TParticipants } from "../../data/types";
import { ChipView } from "./sceneComponents/ChipView";
import { Animations } from "../styles/Animations";
import { Hand } from "./sceneComponents/Hand";

let SHOE_RATIO: number = 0;

export class GameScene extends Container implements IScene<void> {
    private cardsShoe = new Container();
    private dealersHand = new Hand();
    private playersHand = new Hand();
    private splitHand = new Hand();
    private chipsStack = new Container();

    constructor() {
        super();
        this.init();
        this.sortableChildren = true;
        this.chipsStack.zIndex = 1;
        this.addChild(this.chipsStack);
    }

    private async init() {
        await this.setShoe();
        this.setEventListeners();
        this.dealersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.2);
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.6);
        this.dealersHand.scale.set(0.8);
        this.dealersHand.skew.x = -0.01;
        this.addChild(this.dealersHand, this.playersHand);
    }

    private setEventListeners() {
        Main.signalController.bet.cleared.add(this.onBetClear, this);
    }

    private async setPushLabel() {
        const image = await Main.assetsLoader.getSprite('regular_label');
        image.anchor.set(0.5);
        image.position.set(Main.screenSize.width / 2, Main.screenSize.height / 2);
        const text = new Text("PUSH", Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        this.addChild(image);
    }

    private async setBJLabel(parent: Container) {
        const image = await Main.assetsLoader.getSprite('BJ_label');
        image.scale.set(0.6)
        image.anchor.set(0.5);
        image.position.set(30, 70);
        image.zIndex = 2;
        const shine = await this.setShine();
        shine.position.set(image.position.x, image.position.y);
        shine.anchor.y = 0.4
        parent.addChild(shine);
        parent.addChild(image);
    }

    private async setRegularLabel(parent: Container, message: string) {
        const image = await Main.assetsLoader.getSprite('regular_label');
        image.anchor.set(0.5);
        image.position.set(100, 85);
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        parent.addChild(image);
    }

    private async setWinLabel(parent: Container, message: string) {
        const image = await Main.assetsLoader.getSprite('win_label');
        image.anchor.set(0.5);
        image.position.set(100, 85);
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        const shine = await this.setShine();
        shine.position.set(image.position.x, image.position.y);
        parent.addChild(shine);
        parent.addChild(image);
    }

    // private async createLabel(message: string, imageName: string) {
    //     const image = await Main.assetsLoader.getSprite('win_label');
    //     image.anchor.set(0.5);
    //     image.position.set(100, 35);
    //     const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
    //     text.anchor.set(0.5);
    //     image.addChild(text);
    // }

    private async setShine() {
        const shine = await Main.assetsLoader.getSprite('shine');
        shine.anchor.set(0.5);
        shine.scale.set(0.8)
        return shine;
    }

    public async onCardDeal(person: TParticipants, card: CardModel, points: number) {
        const cardView = new CardView(card);
        cardView.scale.set(0.89)
        cardView.angle = -44;
        cardView.position.set(-2, 111);
        this.cardsShoe.addChild(cardView);
        await Animations.cards.pull(cardView);
        const globalPosition = this.cardsShoe.toGlobal(new Point(cardView.x, cardView.y));
        this.cardsShoe.removeChild(cardView);

        let hand: Hand | null = null;
        if (person === 'dealer') hand = this.dealersHand;
        if (person === 'player') hand = this.playersHand;
        if (!hand) return;

        await hand.dealCard(cardView, globalPosition);
        if (hand.cards.length < 2) return;
        hand.points = points;
    }

    public async onCardOpen(card: CardModel, points: number) {
        const cardView = this.dealersHand.cards.find((cardView) => cardView.value === card.value);
        if (!cardView) return;
        await cardView.open();
        this.dealersHand.points = points;
    }

    public async addChipToStack(chip: ChipView) {
        const index = this.chipsStack.children.length;
        chip.dropShadowFilter.offset.x = -6 * index;
        chip.dropShadowFilter.offset.y = 0;
        chip.dropShadowFilter.alpha -= 0.1 * index;
        chip.dropShadowFilter.blur += 0.5 * index;
        chip.bevelFilter.thickness = 7,
        chip.bevelFilter.rotation = 240,
        chip.bevelFilter.shadowAlpha = 0.1,
        chip.bevelFilter.lightAlpha = 0.5,
        this.chipsStack.addChild(chip);
        await Animations.chip.place(chip, index);
        this.chipsStack.removeChildren();
    }

    public async onChipsStackUpdate(chipsStack: TBets[]) {
        this.chipsStack.removeChildren();
        chipsStack.forEach(async (value, index) => {
            const chip = new ChipView(value);
            chip.dropShadowFilter.offset.x = -6 * index;
            chip.dropShadowFilter.offset.y = 0;
            chip.dropShadowFilter.alpha -= 0.1 * index;
            chip.dropShadowFilter.blur += 0.5 * index;
            chip.bevelFilter.thickness = 7,
            chip.bevelFilter.rotation = 240,
            chip.bevelFilter.shadowAlpha = 0.1,
            chip.bevelFilter.lightAlpha = 0.5,
            chip.position.x = Main.screenSize.width * 0.4,
            chip.position.y = Main.screenSize.height * 0.55 - 7 * index,
            chip.scale.y = 0.7;
            this.chipsStack.addChild(chip);
        })
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
        SHOE_RATIO = this.cardsShoe.width / this.cardsShoe.height

        this.cardsShoe.addChild(shoePart);
        this.addChild(this.cardsShoe);
    }

    private async onBetClear() {
        await Animations.chipStack.remove(this.chipsStack);
        this.chipsStack.removeChildren();
        this.chipsStack.position.set(0, 0)
    }

    public async onRoundEnd(result: TRoundResult) {
        switch (result) {
            case "dealerBJ":
                this.setBJLabel(this.dealersHand);
                this.setRegularLabel(this.playersHand, 'LOSE');
                break;
            case "playerBJ":
                this.setBJLabel(this.playersHand);
                break;
            case "playerBust":
                this.setRegularLabel(this.playersHand, 'BUST');
                break;
            case "dealerBust":
                this.setRegularLabel(this.dealersHand, 'BUST');
                this.setWinLabel(this.playersHand, 'WIN');
                break;
            case "win":
                this.setWinLabel(this.playersHand, 'WIN');
                break;
            case "lose":
                this.setRegularLabel(this.playersHand, 'LOSE');
                break;
            case "push":
                this.setPushLabel();
                break;
            case "pushBJ":
                this.setBJLabel(this.dealersHand);
                this.setBJLabel(this.playersHand);
                this.setPushLabel();
                break;
        }
    }

    public onResize() {
        this.cardsShoe.scale.set(Main.screenSize.height / 600);

        this.dealersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.2);
        this.playersHand.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.6);

        if (Main.screenSize.height > Main.screenSize.width) {
            this.cardsShoe.position.set(Main.screenSize.width * 0.80, 30);
            return;
        }
        this.cardsShoe.position.set(Main.screenSize.width * 0.75, 0);
    };

    public deactivate() {
        Main.signalController.bet.cleared.remove(this.onBetClear);
    }
}