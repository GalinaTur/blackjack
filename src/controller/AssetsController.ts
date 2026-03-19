import { Howl } from "howler";
import { Assets, Sprite } from "pixi.js";
import { ASSETS_MANIFEST } from "../data/assets";

export class AssetsController
{
	private soundsSprite: Howl | null = null;

	public async init(): Promise<void>
	{
		const deviceType = this.getDeviceType();

		await Assets.init({ manifest: ASSETS_MANIFEST });
		await Assets.loadBundle("fonts");
		// await Assets.loadBundle("initialAssets");
		await Assets.loadBundle("buttons");
		// await Assets.loadBundle("labels");
		// await Assets.loadBundle("other");
		await Assets.load(`./assets/images/exported/${ deviceType }/spritesheet.json`);
		await Assets.load(`./assets/images/exported/cardsSpritesheet.json`);
		await Assets.load(`./assets/images/exported/chipsSpritesheet.json`);

		await this.createSoundsSprite(deviceType);

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
		if (!playbackId)
		{
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

	private async createSoundsSprite(deviceType: "mobile" | "desktop"): Promise<void>
	{
		const soundsSpriteData = await fetch(`assets/sounds/exported/${ deviceType }/sounds.json`).then(r => r.json());

		this.soundsSprite = new Howl({
			src: soundsSpriteData.urls,
			sprite: soundsSpriteData.sprite
		});
	}

	private getDeviceType(): "mobile" | "desktop"
	{
		const uaData = (navigator as any).userAgentData;

		if (uaData?.mobile !== undefined)
		{
			return uaData.mobile ? "mobile" : "desktop";
		}

		return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
			? "mobile"
			: "desktop";
	}
}