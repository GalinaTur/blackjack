import { DropShadowFilter } from "pixi-filters";

export class Effects {
    public static DropShadow = new DropShadowFilter({
        blur: 3,
        quality: 2,
        alpha: 0.5,
        offset: {
            x: 2,
            y: -2,
        },
        color: 0x000000
    })

}