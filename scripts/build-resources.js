const {spawnSync} = require('child_process');

function buildAtlas(outputSheet, outputJson, scale, maxSize) {
    spawnSync(
        'texturepacker',
        [
            'assets/images/png',
            '--sheet', outputSheet,
            '--data', outputJson,
            '--format', "pixijs4",
            '--trim-sprite-names',
            '--png-opt-level', '7',
            '--scale', scale,
            '--max-width', maxSize,
            '--max-height', maxSize
        ],
        {stdio: 'inherit', shell: true}
    );
}

buildAtlas(
    'assets/images/exported/desktop/spritesheet.png',
    'assets/images/exported/desktop/spritesheet.json',
    '1',
    '4096'
);

buildAtlas(
    'assets/images/exported/mobile/spritesheet.png',
    'assets/images/exported/mobile/spritesheet.json',
    '0.5',
    '2048'
);