const playBtn = document.getElementById('play-btn');
const saveBtn = document.getElementById('save-btn');
const dropTarget = document.getElementById('drop-target');

const setupZoom = dir => () => {
    const target = document.getElementById(`${dir}-zoom`);
    target.addEventListener('input', event => {
        document.documentElement.style.setProperty(`--track-${dir}-zoom`, `${event.target.value}px`);
    });
};

export const connectHorizontal = setupZoom('horizontal');
export const connectVertical = setupZoom('vertical');

export const connectToSave = callback => {
    saveBtn.addEventListener('click', async event => {
        saveBtn.setAttribute('disabled', true);
        saveBtn.innerText = 'Saving...';
        await callback();
        saveBtn.setAttribute('disabled', false);
        saveBtn.innerText = 'Save';
    });
};

export const connectToPlay = callback => {
    let playing = false;
    playBtn.addEventListener('click', async event => {
        playing = !playing;
        playBtn.innerText = playing ? 'Stop' : 'Play';
        await callback(playing);
    });
};

const captureEvent = event => {
    event.stopPropagation();
    event.preventDefault();
};

export const connectToDnd = callback => {
    document.addEventListener('drop', async event => {
        captureEvent(event);
        dropTarget.classList.remove('hover');

        await callback(event.dataTransfer.files);
    }, false);
    document.addEventListener('dragover', event => {
        captureEvent(event);
        event.dataTransfer.dropEffect = 'copy';
        dropTarget.classList.add('hover');
    }, false);
    document.addEventListener('dragleave', event => {
        captureEvent(event);
        dropTarget.classList.remove('hover');
    }, false);
};
