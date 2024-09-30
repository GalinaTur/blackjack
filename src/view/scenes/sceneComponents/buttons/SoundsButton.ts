import { Main } from "../../../../main";
import { Button } from "./Button";
import { BUTTONS } from "../../../../data/constants";

export class SoundsButton extends Button {
    private soundsOn: boolean;

    constructor(soundsOn: boolean) {
        const buttonImageID = soundsOn ? BUTTONS.sounds.on : BUTTONS.sounds.off;
        super(buttonImageID);
        this.soundsOn = soundsOn
        this.on('pointerdown', () => {
            this.toggle();
        });
    }

    private toggle(): void {
        this.soundsOn = !this.soundsOn;
        Main.signalController.sounds.isOn.emit(this.soundsOn);
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
}