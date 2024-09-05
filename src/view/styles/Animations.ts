import gsap from "gsap"
import { ChipView } from "../scenes/sceneComponents/ChipView"
import { Main } from "../../main"
import { Sprite } from "pixi.js"
import { CardModel } from "../../model/CardModel"
import { CardView } from "../scenes/sceneComponents/CardView"
import { BevelFilter } from "pixi-filters"

export class Animations {

    public static initialLogo = {
        scale(logo: Sprite) {
            gsap.to(logo, {
                id: 'scaleLogo',
                pixi: {
                    scale: 1.01,
                },
                duration: 1,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            })
        }
    }

    public static chip = {
        place(chip: ChipView, index: number) {
            gsap.to(chip, {
                id: 'moveChip',
                pixi: {
                    positionX: Main.screenSize.width * 0.8,
                    positionY: Main.screenSize.height * 0.5 - 10 * index,
                    scaleY: 0.6
                },
                duration: 0.7,
                ease: 'expo.out',
                onStart: () => Animations.chip.increaseBevelEffect(chip),
            })
        },
        increaseBevelEffect(chip: ChipView) {
            gsap.to(chip.bevelFilter, {
                thickness: 5,
                rotation: 260,
                duration: 0.7,
                ease: 'expo.out',
            })
        }
    }

    public static cards = {
        deal(card: CardView, index: number) {
            return new Promise((resolve) => {
                gsap.to(card, {
                    id: 'dealCard',
                    pixi: {
                        positionX: index * 50,
                        positionY: 0,
                    },
                    duration: 0.4,
                    ease: 'expo.out',
                    onComplete: resolve,
                })
            })
        },
        open(back: Sprite, face: Sprite) {
            return new Promise((resolve) => {
                gsap.to(back, {
                    id: 'flipCard',
                    pixi: {
                        scaleX: 0,
                    },
                    duration: 0.2,
                    ease: 'power0.inOut',
                    onComplete: () => {
                        gsap.to(face, {
                            pixi: {
                                scaleX: 0.4,
                            },
                            duration: 0.2,
                            ease: 'power0.inOut',
                        });
                        gsap.to(face, {
                            pixi: {
                                scaleY: 0.5,
                            },
                            duration: 0.2,
                            ease: 'power0.inOut',
                            yoyo: true,
                            repeat: 1,
                            onComplete: resolve,
                        })
                    }
                })
            })
        },
        addPointsLabel(label: Sprite) {
            gsap.to(label, {
                id: 'addPointsLabel',
                pixi: {
                    scaleX: 1,
                },
                duration: 0.3,
                ease: 'back.out',
            })
        }
    }
}