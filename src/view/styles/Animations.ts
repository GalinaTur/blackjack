import gsap from "gsap"
import { ChipView } from "../scenes/sceneComponents/ChipView"
import { Main } from "../../main"
import { Container, Point, Sprite, Text } from "pixi.js"
import { CardModel } from "../../model/CardModel"
import { CardView } from "../scenes/sceneComponents/CardView"
import { BevelFilter } from "pixi-filters"
import { Background } from "../scenes/sceneComponents/Background"

export class Animations {

    public static background = {
        unblur(bg: Background) {
            gsap.to(bg.blurFilter, {
                blur: 0,
                duration: 0.5,
                ease: 'circ.inOut',
            })
        }
    }

    public static initialLogo = {
        scale(logo: Sprite) {
            gsap.to(logo, {
                id: 'scaleLogo',
                pixi: {
                    scale: logo.scale.x + 0.05,
                },
                duration: 1,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            })
        },
        remove(logo: Sprite) {
            return new Promise(resolve => gsap.to(logo, {
                id: 'removeLogo',
                pixi: {
                    scale: 0,
                },
                duration: 0.5,
                ease: 'back.in',
                onComplete: resolve,
            }))
        }
    }

    public static button = {
        enable(button: Container) {

            gsap.to(button, {
                id: 'enableButton',
                pixi: {
                    scale: 1,
                    alpha: 1,
                },
                duration: 0.2,
                ease: 'back.out',

            })

        },
        disable(button: Container) {
            return new Promise(resolve => {
            gsap.to(button, {
                id: 'disableButton',
                pixi: {
                    scale: 0,
                    alpha: 0
                },
                duration: 0.2,
                ease: 'back.in',
                onComplete: resolve,
            })
        })
        }
    }

    public static chip = {
        place(chip: ChipView, index: number) {
            return new Promise<void>((resolve) => {
                gsap.to(chip, {
                    id: 'moveChip',
                    pixi: {
                        scaleX: 0.6,
                        scaleY: 0.5,
                    },
                    duration: 0.5,
                    motionPath: {
                        path: [
                            { x: chip.x, y: chip.y },
                            { x: (chip.x + 10), y: (chip.y - 10) },
                            { x: (chip.x + 60), y: (chip.y - 350) },
                            { x: -80, y: -50 - 5 * index },

                        ],
                        type: 'cubic',
                    },
                    ease: 'power1.out',
                    onComplete: resolve
                })
            })
        },
        move(chip: ChipView, index: number) {
            return new Promise<void>((resolve) => {
                gsap.to(chip, {
                    id: 'moveChip',
                    pixi: {
                        scaleX: 0.6,
                        scaleY: 0.5,
                        positionX: -80,
                        positionY: -50 - 5 * index,
                    },
                    duration: 0.5,
                    ease: 'power1.out',
                    onComplete: resolve
                })
            })
        },
        hide(chip: ChipView) {
            return new Promise((resolve) => gsap.to(chip, {
                id: 'hideChip',
                pixi: {
                    positionY: chip.y + 200,
                },
                delay: 0.1,
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
                delay: 0.1,
                duration: 0.6,
                ease: 'back.inOut',
                onComplete: resolve
            }))
        },
    }

    public static cards = {
        pull(card: CardView) {
            return new Promise((resolve) => {
                gsap.to(card, {
                    id: 'pullCard',
                    pixi: {
                        positionX: card.position.x - 40,
                        positionY: card.position.y + 40,
                    },
                    duration: 0.3,
                    ease: 'circ.in',
                    onComplete: resolve,
                })
            })
        },
        deal(card: CardView, index: number, open: () => void, resolveAt: string) {
            return new Promise<void>((resolve) => {
                gsap.to(card, {
                    id: 'dealCard',
                    pixi: {
                        positionX: 20 + index * 30,
                        positionY: 0,
                        angle: 0
                    },
                    duration: 0.5,
                    ease: "circ.out",
                    onStart: () => {
                        resolveAt === 'onStart' && resolve();
                        open();
                    },
                    onComplete: () => {
                        resolveAt === 'onComplete' && resolve();
                    }
                })
            })
        },
        open(card: CardView) {
            return new Promise((resolve) => {
                const cardScale = card.backImage!.scale.y;
                gsap.to(card.backImage, {
                    id: 'flipCard',
                    pixi: {
                        scaleX: 0,
                    },
                    duration: 0.1,
                    delay: 0.2,
                    ease: 'power0.in',
                    onComplete: () => {
                        gsap.to(card.image!, {
                            pixi: {
                                scaleX: cardScale,
                            },
                            duration: 0.2,
                            ease: 'power0.out',
                            onStart: () => {
                                gsap.to(card.image!, {
                                    pixi: {
                                        scaleY: card.image!.scale.y + 0.1,
                                    },
                                    duration: 0.2,
                                    ease: 'sine.inOut',
                                    yoyo: true,
                                    repeat: 1,
                                    onComplete: resolve,
                                })
                            }
                        });
                        gsap.to({ x: card.dropShadowFilter.offset.x, y: card.dropShadowFilter.offset.y }, {
                            x: 20,
                            y: -10,
                            duration: 0.2,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: 1,
                            onUpdate: function () {
                                card.dropShadowFilter.offset.x = this.targets()[0].x;
                                card.dropShadowFilter.offset.y = this.targets()[0].y;
                            }
                        })
                    }
                })
            })
        },
        addPointsLabel(label: Sprite) {
            gsap.to(label, {
                id: 'addPointsLabel',
                pixi: {
                    scaleX: label.scale.y,
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
                    let number = Number(num.text).toFixed(1);
                    num.text = func(name, number);
                },
            })
        }
    }

    public static chipStack = {
        remove(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'removeChipStack',
                pixi: {
                    // positionY: -50,
                },
                duration: 0.7,
                ease: 'back.in',
                onComplete: resolve,
            }))
        }
    }

    public static popup = {
        show(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'showPopup',
                pixi: {
                    scale: 0.6,
                },
                delay: 0.1,
                yoyo: true,
                repeat: 1,
                duration: 1,
                ease: 'back.out',
                repeatDelay: 0.1,
                onComplete: resolve,
            }))
        }
    }

    public static label = {
        show(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'showLabel',
                pixi: {
                    scale: 0.7,
                },
                delay: 0.1,
                duration: 1,
                ease: 'elastic.out',
                onComplete: resolve,
            }))
        },
        showWin(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'showWinLabel',
                pixi: {
                    scale: 0.7,
                },
                delay: 0.1,
                duration: 1,
                ease: 'back.out',
                onComplete: resolve,
            }))
        },
        showRegular(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'showRegularLabel',
                pixi: {
                    scale: 0.7,
                },
                delay: 0.1,
                duration: 1,
                ease: 'elastic.out',
                onComplete: resolve,
            }))
        },

    }

    public static hand = {
        split(mainHand: Container, splitHand: Container) {
            return new Promise(resolve => gsap.to(mainHand, {
                id: 'moveMainHand',
                duration: 0.5,
                motionPath: {
                    path: [
                        { x: mainHand.x, y: mainHand.y },
                        { x: Main.screenSize.width * 0.6, y: mainHand.y },
                        { x: Main.screenSize.width * 0.7, y: Main.screenSize.height * 0.6 },
                        { x: Main.screenSize.width * 0.7, y: Main.screenSize.height * 0.55 },

                    ],
                    type: 'cubic',
                },
                ease: 'circ.out',
                onComplete: resolve,
                onStart: () => {
                    gsap.to(splitHand, {
                        id: 'moveSplitHand',
                        motionPath: {
                            path: [
                                { x: splitHand.x, y: splitHand.y },
                                { x: Main.screenSize.width * 0.4, y: splitHand.y },
                                { x: Main.screenSize.width * 0.3, y: Main.screenSize.height * 0.6 },
                                { x: Main.screenSize.width * 0.3, y: Main.screenSize.height * 0.55 },
                            ],
                            type: 'cubic',
                        },
                        duration: 0.5,
                        ease: 'circ.out',

                    })
                },
            }))
        }
    }

    public static pointer = {
        show(pointer: Sprite, shine: Sprite) {
            gsap.to(pointer, {
                id: 'showPointer',
                pixi: {
                    scale: 0.3,
                },
                duration: 0.4,
                ease: 'back.out',
                onComplete: () => {
                    gsap.to(pointer, {
                        id: 'showPointer',
                        pixi: {
                            positionY: pointer.position.y + 5,
                        },
                        duration: 0.3,
                        yoyo: true,
                        repeat: -1,
                        ease: 'none',
                    });
                    gsap.to(shine, {
                        id: 'poinerShine',
                        pixi: {
                            scale: 0,
                        },
                        duration: 0.3,
                        yoyo: true,
                        repeat: -1,
                        ease: 'none',
                    });
                }
            })
        },
        remove(pointer: Sprite) {
            gsap.to(pointer, {
                id: 'removePointer',
                pixi: {
                    scale: 0,
                },
                duration: 0.4,
                ease: 'back.out',
            })
        }
    }
}