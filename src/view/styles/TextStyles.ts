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

    public static HEADER_TEXTSTYLE: Partial<TextStyle> = {
        fill: "#ffcc00",
        fontFamily: "Orbitron",
        // letterSpacing:3,
        fontSize: 24,
    }

    public static WIN_TEXTSTYLE: Partial<TextStyle> = {
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowDistance: 10,
        fill: [
            "#c59020",
            "#e6c832",
            "#f4eecc",
            "#e6c832",
            "#c59020"
        ],
        fillGradientType: 1,
        fillGradientStops: [
            0,
            0.2,
            0.5,
            0.8,
            1
        ],
        fontFamily: "Impact",
        fontSize: 128,
        fontWeight: "bold",
        letterSpacing: 6,
        lineJoin: "round",
        stroke: "#623900",
        strokeThickness: 20
    }
}