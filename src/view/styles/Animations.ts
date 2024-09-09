import gsap from "gsap"
import { ChipView } from "../scenes/sceneComponents/ChipView"
import { Main } from "../../main"
import { Container, Sprite, Text } from "pixi.js"
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
                    positionX: Main.screenSize.width * 0.4,
                    positionY: Main.screenSize.height * 0.55 - 7 * index,
                    scaleX: chip.scale.x*0.6,
                    scaleY: chip.scale.y*0.5
                },
                duration: 0.5,
                ease: 'expo.inOut',
                onStart: () => Animations.chip.increaseBevelEffect(chip),
            })
        },
        increaseBevelEffect(chip: ChipView) {
            gsap.to(chip.bevelFilter, {
                thickness: 7,
                rotation: 240,
                duration: 0.3,
                shadowAlpha: 0.1,
                lightAlpha: 0.6,
                ease: 'expo.in',
            })
        },
        hide(chip: ChipView) {
            return new Promise((resolve) => gsap.to(chip, {
                id: 'hideChip',
                pixi: {
                    positionY: chip.y + 200,
                },
                delay: 0.2,
                duration: 0.5,
                ease: 'back.inOut',
                onComplete: resolve
            }))
        },
        show(chip: ChipView) {
            return new Promise((resolve) => gsap.to(chip, {
                id: 'showChip',
                pixi: {
                    positionY: chip.y - 200,
                },
                delay: 0.2,
                duration: 0.6,
                ease: 'back.inOut',
                onComplete: resolve
            }))
        },
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
        },
        updatePointsLabel(label: Sprite) {
            gsap.to(label.children[0], {
                id: 'addPointsLabel',
                pixi: {
                    scale: 1.3,
                },
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power4.inOut',
            })
        }
    }

    public static headerText = {
        update(num: Text, name: string, newValue: number, func: (name: string, value: string) => string) {
            gsap.to(num, {
                pixi: {
                    text: newValue,
                },
                duration: 0.5,
                onUpdate() {
                    const number = Number(num.text);
                    num.text = func(name, Math.round(number).toString());
                },
            })
        }
    }

    public static chipStack = {
        remove(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'removeChipStack',
                pixi: {
                    positionX: element.position.x - Main.screenSize.width/2,
                },
                delay: 0.2,
                duration: 1,
                ease: 'back.inOut',
                onComplete: resolve,
            }))
        }
    }
}