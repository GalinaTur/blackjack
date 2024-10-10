import { TextStyle } from "pixi.js";
import { Main } from "../../main";

export class Textstyles {
    public static BUTTON_TEXTSTYLE: Partial<TextStyle> = {
        fontSize: 16,
        fill: "#ffffff",
        fontFamily: "Saira",
    }

    public static LABEL_TEXTSTYLE: Partial<TextStyle> = {
        ...this.BUTTON_TEXTSTYLE,
        fontSize: 28,
    }

    public static FOOTER_TEXTSTYLE: Partial<TextStyle> = {
        fill: "#ffffff",
        fontFamily: "SairaLightItalic",
        fontSize: 18,
        strokeThickness:1,
        letterSpacing: 1.4,
        stroke: "#000000",
    }

    public static FOOTER_SIGN_TEXTSTYLE: Partial<TextStyle> = {
        fill: "#000000",
        fontFamily: "Saira",
        fontSize: 15,
    }

    public static HEADER_TEXTSTYLE: Partial<TextStyle> = {
        fill: "#ffcc00",
        fontFamily: "SairaLightItalic",
        fontSize: 24,
        strokeThickness:4
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