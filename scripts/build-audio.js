const { spawnSync } = require('child_process');

function buildAudio(output, ffmpegOptions) {
    spawnSync(
        'audiosprite',
        [
            'assets/sounds/*.mp3',
            '--output', output,
            '--format', 'howler',
            '--export', 'mp3,ogg',
            '--ffmpeg', ffmpegOptions
        ],
        { stdio: 'inherit', shell: true }
    );
}

buildAudio('assets/sounds/exported/desktop/sounds', 'ffmpeg -ac 2 -ar 44100 -ab 128k');
buildAudio('assets/sounds/exported/mobile/sounds', 'ffmpeg -ac 1 -ar 22050 -ab 64k');