import { TextStyle } from "pixi.js";

export class Textstyles {
    public static BUTTON_TEXTSTYLE: Partial<TextStyle> = {
        fontSize: 36,
        fill: "#ffffff",
        fontFamily: "SairaBD",
        strokeThickness: 4,
    }

    public static LABEL_TEXTSTYLE: Partial<TextStyle> = {
        ...this.BUTTON_TEXTSTYLE,
        fontSize: 28,
    }
}