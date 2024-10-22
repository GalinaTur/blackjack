import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Button } from "./buttons/Button";
import { BUTTONS } from "../../../data/constants";
import { CloseButton } from "./buttons/CloseButton";

enum ERulesText {
    'goal' = 1,
    'cardsValues' = 2,
    'gameSetup' = 3,
    'playersActions' = 4,
    'dealersTurn' = 5,
    'winning' = 6,
}

const rulesText = {
    goal: `The goal of Blackjack is to beat the dealer by having a hand value that is closer to 21 without exceeding it.`,
    cardsValues: `Card Values\n
Number cards (2-10): Face value.\n
Face cards (Jack, Queen, King): 10 points.\n
Aces: Can be worth 1 or 11 points, depending on which value benefits the hand more.`,
    gameSetup: `Game Setup\n
Player and Dealer: The game is played between player and the dealer.\n
Initial Deal: Player is dealt two cards, and the dealer receives one card face up and one card face down.`,
    playersActions: `Player Actions\n
Hit: Take an additional card. Player can continue to hit as long as his hand total is 21 or less.\n
Stand: Keep the current hand and end the turn.\n
Double Down: Double the initial bet and receive only one more card.\n
Split: If the first two cards are of the same value, player can split them into two separate hands, doubling his bet. Each hand is played separately.`,
    dealersTurn: `Dealer's Turn\n
After player have completed his turn, the dealer reveals his face-down card.\n
The dealer must hit until his total is 17 or higher.
`,
    winning: `Winning\n
Natural Blackjack: A player wins if he has an Ace and a 10-point card (Blackjack) on the initial deal, winning 1.5 times their bet.\n
Beat the Dealer: If the player's total is higher than the dealer's without exceeding 21, the player wins.\n
Push: If the player and dealer have the same total, it's a push, and the player’s bet is returned.\n
Busted: If a player exceeds 21, he loses his bet automatically, regardless of the dealer's hand.`
}

export class Modal extends Container {
    private background: Sprite | null = null;
    private infoContainer = new Container();
    private currentText = ERulesText[1] as keyof typeof ERulesText;

    constructor() {
        super();
        this.setBackground();
        this.setInfoContainer();
        this.setInfo(this.currentText);
        this.setNextButton();
        this.setPrevButton();
        this.setCloseButton();
    }

    private setBackground(): void {
        const frame = new Graphics().beginFill(0x181818, 0.95)
            .drawRect(0, 0, Main.screenSize.width, Main.screenSize.height)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        this.background = new Sprite(texture);
        this.background.eventMode = 'static';
        this.addChild(this.background);
    }

    private setInfoContainer() {
        this.infoContainer.position.set(Main.screenSize.width / 2, Main.screenSize.height / 2);
        this.addChild(this.infoContainer);
    }

    private setInfo(sample: keyof typeof ERulesText): void {
        this.infoContainer.removeChildren();
        const text = new Text(rulesText[sample], Textstyles.INFO_TEXTSTYLE);
        text.anchor.set(0.5);
        this.infoContainer.addChild(text);
    }

    private update(): void {
        this.setInfo(this.currentText);
    }

    private setNextButton() {
        const nextButton = new Button(BUTTONS.footer.next.imgID);
        nextButton.on('pointerdown', () => {
            let currentTextIndex: number = ERulesText[this.currentText];
            currentTextIndex++;
            if (!ERulesText[currentTextIndex]) {
                currentTextIndex = 1;
            }
            this.currentText = ERulesText[currentTextIndex] as keyof typeof ERulesText;
            this.update();
        })
        nextButton.scale.set(0.05);
        nextButton.position.set(Main.screenSize.width*0.95, Main.screenSize.height/2);
        this.addChild(nextButton);
    }

    private setPrevButton() {
        const prevButton = new Button(BUTTONS.footer.previous.imgID);
        prevButton.on('pointerdown', () => {
            let currentTextIndex: number = ERulesText[this.currentText];
            currentTextIndex--;
            if (!ERulesText[currentTextIndex]) {
                currentTextIndex = Object.keys(rulesText).length;
            }
            this.currentText = ERulesText[currentTextIndex] as keyof typeof ERulesText;
            this.update();
        })
        prevButton.scale.set(0.05);
        prevButton.position.set(Main.screenSize.width*0.05, Main.screenSize.height/2);
        this.addChild(prevButton);
    }

    private setCloseButton() {
        const closeButton = new CloseButton();
        closeButton.scale.set(0.2);
        closeButton.position.set(Main.screenSize.width*0.7, Main.screenSize.height*0.15);
        this.addChild(closeButton);
    }

    public onResize(): void {
        // this.resize();
    }
    public deactivate() {
        this.parent.removeChild(this);
    }
}