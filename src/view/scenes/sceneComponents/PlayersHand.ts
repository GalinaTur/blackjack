import { Container, Point, Sprite } from "pixi.js";
import { ChipView } from "./ChipView";
import { Hand } from "./Hand";
import { TBets } from "../../../data/types";
import { Animations } from "../../styles/Animations";
import { CardModel } from "../../../model/CardModel";
import { CardView } from "./CardView";
import { Main } from "../../../main";

export class PlayersHand extends Hand {
    public chipsStack: Container | null = null;
    private pointer: Sprite | null = null;

    constructor() {
        super();
        this.scale.set(1.3);
    }

    private setStack() {
        this.chipsStack = new Container();
        this.addChild(this.chipsStack);
    }

    public async setPointer() {
        this.pointer = await Main.assetsLoader.getSprite('pointer');
        const shine = await Main.assetsLoader.getSprite('pointerShine');
        this.pointer.anchor.set(0.5);
        this.pointer.scale.set(0);
        this.pointer.position.y = -50;
        shine.anchor.set(0.5, 0.5);
        shine.alpha = 0.5;
        shine.position.set(25, -25);
        this.pointer.zIndex = 5;
        shine.zIndex = 6;
        this.pointer.addChild(shine);
        this.addChild(this.pointer);
        Animations.pointer.show(this.pointer, shine);
    }

    public removePointer() {
        if (!this.pointer) return;
        Animations.pointer.remove(this.pointer);
        this.removeChild(this.pointer);
    }

    public async addChipToStack(value: TBets, globalPosition: Point) {
        if (!this.chipsStack) {
            this.setStack();
        }
        const newChip = new ChipView(value);
        const index = this.chipsStack!.children.length;
        this.setChipFilter(newChip, index);
        this.chipsStack!.addChild(newChip);
        newChip.position = this.toLocal(globalPosition);
        await Animations.chip.place(newChip, index);
    }

    public async onChipsStackUpdate(chipsStack: TBets[]) {
        // if(chipsStack.length ===3) return
        if (!this.chipsStack) {
            this.setStack();
        }
        if (chipsStack.length === this.chipsStack!.children.length) return;

        this.chipsStack!.removeChildren();
        chipsStack.forEach(async (value, index) => {
            const chip = new ChipView(value);
            this.setChipFilter(chip, index);
            chip.position.x = -80;
            chip.position.y = -50 - 5 * index,
                chip.scale.set(0.6, 0.5);
            this.chipsStack!.addChild(chip);
        })
    }

    private setChipFilter(chip: ChipView, index: number) {
        chip.dropShadowFilter.offset.x = -6 * index;
        chip.dropShadowFilter.offset.y = 0;
        chip.dropShadowFilter.alpha -= 0.1 * index;
        chip.dropShadowFilter.blur += 0.5 * index;
        chip.bevelFilter.thickness = 7;
        chip.bevelFilter.rotation = 240;
        chip.bevelFilter.shadowAlpha = 0.1;
        chip.bevelFilter.lightAlpha = 0.5;
    }

    public async updateCards(cards: CardModel[]) {
        cards.forEach(async cardModel => {
            const card = await CardView.build(cardModel);
            card.open();
            card.scale.set(0.89);
            card.position.x = -10
            this.cards.push(card);
            this.addChild(card);
        })
    }

    public async doubleBet() {
        if (!this.chipsStack) return;

        const length = this.chipsStack.children.length;
        const animationPromises: Promise<void>[] = [];
        return new Promise<void>(resolve => {
                for (let i = 0; i < length; i++) {
                    const chip = this.chipsStack?.children[i] as ChipView;
                    const animationPromise = this.addChipToStack(chip.value, new Point(Main.screenSize.width * 0.2, Main.screenSize.height + 100));
                    animationPromises.push(animationPromise);
                }
                Promise.all(animationPromises).then(() => resolve());
        });
    }

    public async setBJLabel() {
        super.setBJLabel();
        const shine = await this.setShine();
        shine.position.x=150;
        this.addChildAt(shine, 0);
    }

    public async setWinLabel(message: string) {
        const label = await this.createLabel('win_label', message);
        const shine = await this.setShine();
        Animations.label.showWin(label)
        shine.scale.set(0.4);
        this.addChild(shine, label);
    }

    private async setShine() {
        const shine = await Main.assetsLoader.getSprite('shine');
        shine.anchor.set(0.5);
        // shine.scale.set(0.6);
        shine.position.set(100, 0)
        return shine;
    }
}