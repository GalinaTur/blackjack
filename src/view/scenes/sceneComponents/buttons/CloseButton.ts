import { Main } from "../../../../main";
import { Button } from "./Button";
import { BUTTONS } from "../../../../data/constants";

export class CloseButton extends Button {

    constructor() {
        super(BUTTONS.footer.closeInfo.imgID);
        this.on('pointerdown', this.onClick);
    }

    private onClick(): void {
        Main.signalsController.info.isOn.emit(false);
        this.onPointerOut();
    }

    public deactivate(): void {
        super.deactivate();
        this.off('pointerdown', this.onClick);
    }
}