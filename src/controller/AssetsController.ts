import { Howl } from "howler";
import { Assets, Sprite } from "pixi.js";
import { ASSETS_MANIFEST, SOUNDS } from "../data/assets";

export class AssetsController
{
	private soundsSprite: Howl | null = null;

	public async init(): Promise<void>
	{
		await Assets.init({ manifest: ASSETS_MANIFEST });
		await Assets.loadBundle("fonts");
		// await Assets.loadBundle("initialAssets");
		await Assets.loadBundle("buttons");
		// await Assets.loadBundle("labels");
		// await Assets.loadBundle("other");
		await Assets.load("./assets/images/exported/spritesheet.json");
		await Assets.load("./assets/images/exported/cardsSpritesheet.json");
		await Assets.load("./assets/images/exported/chipsSpritesheet.json");

		await this.createSoundsSprite();

		// Object.values(this.soundsStorage).forEach((howl) => howl.load());
	};

	// private soundsStorage: { [key: string]: Howl } = {
	// 	welcome: new Howl({
	// 		src: [ SOUNDS.welcome ],
	// 		preload: true
	// 	}),
	// 	backgroundMusic: new Howl({
	// 		src: [ SOUNDS.backgroundMusic ],
	// 		preload: true,
	// 		loop: true
	// 	})
	// };

	public getSprite(id: string): Sprite
	{
		const texture = Assets.get(id);
		return new Sprite(texture);
	}

	public playSound(id: string, volume = 1, loop = false): void
	{
		const playbackId = this.soundsSprite?.play(id);
		if (!playbackId)		{
			return;
		}
		this.soundsSprite?.volume(volume, playbackId);
		this.soundsSprite?.loop(loop, playbackId);
	}

	// public getSound(id: string): Howl
	// {
	// 	if (this.soundsStorage[id])
	// 	{
	// 		return this.soundsStorage[id];
	// 	}
	// 	const sound = new Howl({
	// 		src: [ SOUNDS[id as keyof typeof SOUNDS] ]
	// 	});
	// 	return sound;
	// }

	private async createSoundsSprite(): Promise<void>
	{
		const soundsSpriteData = await fetch("assets/sounds/exported/sounds.json").then(r => r.json());

		this.soundsSprite = new Howl({
			src: soundsSpriteData.urls,
			sprite: soundsSpriteData.sprite
		});
	}
}