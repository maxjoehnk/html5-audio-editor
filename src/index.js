import { record } from './recorder.js';
import { decode, play, stop } from './audio.js';
import {
    connectToDnd,
    connectToPlay,
    connectToSave,
    connectVertical,
    connectHorizontal
} from './ui.js';

window.addEventListener('load', () => {
    const playlist = document.getElementById('playlist');

    let playing = false;

    const buffers = [];

    connectVertical();
    connectHorizontal();
    connectToDnd(async files => {
        [...event.dataTransfer.files]
            .filter(({ type }) => type.startsWith('audio'))
            .forEach(async file => {
                const buffer = await decode(file);
                buffers.push(buffer);
                const length = Math.round(buffer.duration / 10);
                const element = document.createElement('div');
                element.innerText = file.name;
                element.classList.add('track');
                element.style.width = `calc(${length} * var(--track-horizontal-zoom))`;
                playlist.appendChild(element);
            });
    });
    connectToPlay(async playing => {
        if (playing) {
            play(buffers);
        }else {
            stop();
        }
    });
    connectToSave(async () => {
        const audioBuffer = await record(buffers);        
    });
});
