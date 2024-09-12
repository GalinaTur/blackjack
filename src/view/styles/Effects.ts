import { DropShadowFilter } from "pixi-filters";

export class Effects {
    public static FOOTER_DROP_SHADOW = {
        blur: 5,
        quality: 3,
        alpha: 1,
        offset: {
            x: 0,
            y: -10,
        },
        color: 0x000000
    }

    public static HEADER_PANEL_DROP_SHADOW = {
        blur: 5,
        quality: 3,
        alpha: 0.5,
        offset: {
            x: 0,
            y: 10,
        },
        color: 0x000000
    }

    public static BUTTON_DROP_SHADOW = {
        blur: 3,
        quality: 2,
        alpha: 0.5,
        offset: {
            x: 2,
            y: -2,
        },
        color: 0x000000,
    }

    public static CARD_DROP_SHADOW = {
        blur: 1,
        quality: 1,
        alpha: 0.5,
        offset: {
            x: 2,
            y: 1,
        },
        color: 0x000000
    }

    public static CHIP_DROP_SHADOW = {
        blur: 3,
        quality: 3,
        alpha: 1,
        offset: {
            x: 5,
            y: -5,
        },
        color: 0x000000
    }
}