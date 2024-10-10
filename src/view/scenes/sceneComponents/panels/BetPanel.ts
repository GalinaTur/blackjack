import { Container, Point } from "pixi.js";
import { Main } from "../../../../main";
import { GameScene } from "../../GameScene";
import { IPanel, TBets, } from "../../../../data/types";
import { Animations } from "../../../styles/Animations";
import { BUTTONS } from "../../../../data/constants";
import { GameButton } from "./../buttons/GameButton";
import { ChipButton } from "../buttons/ChipButton";

export class BetPanel extends Container implements IPanel {
    private dealButton: GameButton | null = null;
    private doubleButton: GameButton | null = null;
    private undoButton: GameButton | null = null;
    private clearButton: GameButton | null = null;
    private isButtonsActive = false;
    private chips: ChipButton[] = [];

    constructor(private availableBets: TBets[]) {
        super();
        this.init();
    }

    private async init(): Promise<void> {
        this.setButtons();
        this.setChips();
    }

    private setButtons(): void {
        this.dealButton = new GameButton(BUTTONS.bet.deal, this.onPlaceBet, this.isButtonsActive);
        this.doubleButton = new GameButton(BUTTONS.bet.double, this.onDoubleBet, this.isButtonsActive);
        this.undoButton = new GameButton(BUTTONS.bet.undo, this.onUndoBet, this.isButtonsActive);
        this.clearButton = new GameButton(BUTTONS.bet.clear, this.onClearBet, this.isButtonsActive);

        this.positionButtons();

        this.addChild(this.dealButton, this.doubleButton, this.undoButton, this.clearButton);
    }

    private setChips(): void {
        for (let i = 0; i < this.availableBets.length; i++) {
            const value = this.availableBets[i];
            const chip = new ChipButton(value, () => this.onChipClick(value, chip));
            chip.position.x = Main.screenSize.width * (0.4 - i * 0.07);
            chip.position.y = -100;
            this.chips.push(chip);
            this.addChild(chip);
        }
    }

    private async onChipClick(value: TBets, chip: ChipButton): Promise<void> {
        const parent = this.parent as GameScene;
        // const globalPosition = this.toGlobal(new Point(chip.x, chip.y));
        await parent.onChipClick(chip);
        Main.signalsController.bet.added.emit(value);
    }

    public async onBetUpdate(betSize: number, availableBets: TBets[], isDoubleAllowed: boolean): Promise<void> {
        this.isButtonsActive = betSize > 0;
        this.availableBets = availableBets;
        await this.updateChips();
        this.dealButton && this.dealButton.updateIsActive(this.isButtonsActive);
        this.doubleButton && this.doubleButton.updateIsActive(isDoubleAllowed && this.isButtonsActive);
        this.clearButton && this.clearButton.updateIsActive(this.isButtonsActive);
        this.undoButton && this.undoButton.updateIsActive(this.isButtonsActive);
    }

    private async updateChips(): Promise<void> {
        this.chips.forEach(async (chip) => {
            if (this.availableBets.includes(chip.value)) {
                !chip.isActive && this.makeActive(chip);
                return;
            }
            await this.hide(chip);
        })
    }

    private async makeActive(chip: ChipButton): Promise<void> {
        chip.isActive = true;
        await Animations.chip.show(chip);
        chip.eventMode = 'static';
    }

    private async hide(chip: ChipButton): Promise<void> {
        if (!chip.isActive) return;
        chip.eventMode = 'none';
        chip.isActive = false;
        await Animations.chip.hide(chip);
    }

    private onClearBet(): void {
        Main.signalsController.bet.cleared.emit();
    }

    private onPlaceBet(): void {
        Main.signalsController.bet.placed.emit();
    }

    private onDoubleBet(): void {
        Main.signalsController.player.double.emit();
    }

    private onUndoBet(): void {
        Main.signalsController.bet.removedLast.emit();
    }

    private positionButtons(): void {
        this.dealButton?.position.set(Main.screenSize.width * 0.6, -100);
        this.doubleButton?.position.set(Main.screenSize.width * 0.7, -100);
        this.undoButton?.position.set(Main.screenSize.width * 0.8, -100);
        this.clearButton?.position.set(Main.screenSize.width * 0.9, -100);
    }

    public onResize(): void {
        this.chips.forEach((chip, index) => {
            chip.position.x = Main.screenSize.width * (0.4 - index * 0.07);
            this.addChild(chip);
        });

        this.positionButtons();
    }

    public async deactivate(): Promise<void> {
        Promise.all([
            this.dealButton?.updateIsActive(false),
            this.doubleButton?.updateIsActive(false),
            this.undoButton?.updateIsActive(false),
            this.clearButton?.updateIsActive(false),
        ]).then(() => {
            this.parent.removeChild(this);
            this.destroy({ children: true });
        })
    }
}