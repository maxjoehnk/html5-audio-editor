const context = new AudioContext();

let nodes = [];

export const decode = file => new Promise((resolve, reject) => {
    const worker = new Worker('file-worker.js');
    worker.postMessage(file);
    worker.addEventListener('message', async event => {
        const audioBuffer = await context.decodeAudioData(event.data);
        worker.terminate();
        return resolve(audioBuffer);
    }, { once: true });
});

export const play = buffers => {
    nodes = buffers.map((buffer, i) => {
        const node = context.createBufferSource();
        node.buffer = buffer;
        node.connect(context.destination);
        return node;
    });
    nodes.forEach((node, i) => {
        if (nodes[i + 1]) {
            node.addEventListener('ended', () => {
                nodes[i + 1].start(0, 0);
            }, { once: true });
        }
    });
    const [ start ] = nodes;
    start.start(0, 0);
};

export const stop = () => {
    nodes.forEach(node => node.stop());
    nodes.forEach(node => node.disconnect());
    nodes = [];
};
