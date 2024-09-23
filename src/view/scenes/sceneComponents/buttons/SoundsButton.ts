import { Main } from "../../../../main";
import { Button } from "./Button";
import { BUTTONS } from "../../../../data/constants";

export class SoundsButton extends Button {
    private soundsOn: boolean = true;

    constructor() {
        super(BUTTONS.sounds.on);
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