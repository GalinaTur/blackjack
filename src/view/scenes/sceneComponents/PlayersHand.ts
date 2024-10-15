import { Container, Sprite } from "pixi.js";
import { ChipView } from "./ChipView";
import { Hand } from "./Hand";
import { TBets, TParticipants } from "../../../data/types";
import { Animations } from "../../styles/Animations";
import { CardModel } from "../../../model/CardModel";
import { CardView } from "./CardView";
import { Main } from "../../../main";
import { SOUNDS } from "../../../data/constants";
import gsap from "gsap";

export class PlayersHand extends Hand {
    public chipsStack: Container | null = null;
    private pointer: Sprite | null = null;

    constructor(name: TParticipants) {
        super(name);
        this.scale.set(1.3);
    }

    private setStack() {
        this.chipsStack = new Container();
        this.addChild(this.chipsStack);
    }

    public setPointer() {
        this.pointer = Main.assetsController.getSprite('pointer');
        const shine = Main.assetsController.getSprite('pointerShine');
        this.pointer.anchor.set(0.5);
        this.pointer.scale.set(0);
        this.pointer.position.y = -50;
        shine.anchor.set(0.5, 0.5);
        shine.alpha = 0.5;
        shine.position.set(25, -25);
        this.pointer.zIndex = 3;
        shine.zIndex = 4;
        this.pointer.addChild(shine);
        this.addChild(this.pointer);
        Animations.pointer.show(this.pointer, shine);
    }

    public removePointer() {
        if (!this.pointer) {
            return;
        }

        Animations.pointer.remove(this.pointer);
        this.removeChild(this.pointer);
    }

    private addChipToStack(chip: ChipView): number {
        if (!this.chipsStack) {
            this.setStack();
        }

        const index = this.chipsStack!.children.length;
        this.setChipFilter(chip, index);
        this.chipsStack!.addChild(chip);
        chip.position = this.toLocal(chip.position);
        return index;
    }

    public async placeChip(chip: ChipView) {
        const index = this.addChipToStack(chip);
        const sound = index === 0 ? SOUNDS.firstChipPlace : SOUNDS.chipPlace
        await Animations.chip.place(chip, index);
        this.playSound(sound);
    }

    public onChipsStackUpdate(chipsStack: TBets[]) {
        if (!this.chipsStack) {
            this.setStack();
        }
        if (chipsStack.length === this.chipsStack!.children.length) {
            return;
        }

        this.chipsStack!.removeChildren();

        chipsStack.forEach((value, index) => {
            const chip = this.setChip(value, index);
            chip.image?.scale.set(0.7)
            chip.position.set(-80, -50 - 5 * index);
            this.chipsStack!.addChild(chip);
        })
    }

    public setChip(value: TBets, index: number) {
        const chip = new ChipView(value);
        this.setChipFilter(chip, index);
        chip.scale.set(0.6, 0.5);
        return chip;
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

    public updateCards(cards: readonly CardModel[]) {
        cards.forEach(cardModel => {
            const card = new CardView(cardModel);
            card.open();
            card.scale.set(0.89);
            card.position.x = -10
            this.cards.push(card);
            this.addChild(card);
        })
    }

    public doubleBet() {
        if (!this.chipsStack) {
            return;
        }

        const length = this.chipsStack.children.length;
        const animationPromises: Promise<void>[] = [];
        return new Promise<void>(async resolve => {
            for (let i = 0; i < length; i++) {
                const chip = (this.chipsStack?.children[i] as ChipView).clone();
                chip?.position.set(Main.screenSize.width / 4, Main.screenSize.height);
                const animationPromise = this.placeChip(chip!);
                animationPromises.push(animationPromise);
            }
            Promise.all(animationPromises).then(() => resolve());
        });
    }

    public setBJLabel() {
        super.setBJLabel();
        const shine = this.setShine();
        shine.position.x = 150;
        this.addChildAt(shine, 0);
    }

    public setWinLabel(message: string) {
        const label = this.createLabel('win_label', message);
        const shine = this.setShine();
        Animations.label.showWin(label)
        shine.scale.set(0.4);
        this.label = label
        this.addChild(shine, label);
    }

    private setShine() {
        const shine = Main.assetsController.getSprite('shine');
        shine.anchor.set(0.5);
        shine.position.set(100, 0)
        return shine;
    }
}