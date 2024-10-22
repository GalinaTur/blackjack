import { Main } from "../../../../main";
import { Button } from "./Button";
import { BUTTONS } from "../../../../data/constants";

export class InfoButton extends Button {
private isModalOn = false;

    constructor() {
        super(BUTTONS.footer.info.imgID);

        this.on('pointerdown', this.toggle);
        Main.signalsController.info.isOn.add(this.onInfoChange, this);
    }

    private toggle(): void {
        this.isModalOn = !this.isModalOn;
        Main.signalsController.info.isOn.emit(this.isModalOn);
    }

    private onInfoChange(isOn: boolean): void {
        this.isModalOn = isOn;
    }

    public deactivate(): void {
        super.deactivate();
        this.off('pointerdown', this.toggle);
        Main.signalsController.info.isOn.remove(this.onInfoChange);
    }
}