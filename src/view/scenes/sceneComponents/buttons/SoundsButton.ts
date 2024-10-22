import { Main } from "../../../../main";
import { Button } from "./Button";
import { BUTTONS } from "../../../../data/constants";

export class SoundsButton extends Button {

    constructor(private soundsOn: boolean) {
        const buttonImageID = soundsOn ? BUTTONS.footer.soundsOn : BUTTONS.footer.soundsOff;
        super(buttonImageID.imgID);

        this.on('pointerdown', this.toggle);
    }

    private toggle(): void {
        this.soundsOn = !this.soundsOn;
        Main.signalsController.sounds.isOn.emit(this.soundsOn);
        this.update();
    }

    private update(): void {
        this.image?.destroy();

        if (this.soundsOn) {
            this.setImage('soundsOn');
            return;
        }

        this.setImage('soundsOff');
    }

    public deactivate(): void {
        super.deactivate();
        this.off('pointerdown', this.toggle);
    }
}