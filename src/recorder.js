export const record = async buffers => {
    const length = buffers.reduce((length, buffer) => length + buffer.length, 0);
    const recordingCtx = new OfflineAudioContext(2, length * 44100, 44100);
    const recordingNodes = [];
    buffers.forEach(buffer => {
        const source = recordingCtx.createBufferSource();
        source.buffer = buffer;
        recordingNodes.push(source);
    });
    recordingNodes.forEach((node, i) => {
        if (recordingNodes[i + 1]) {
            node.addEventListener('ended', () => {
                recordingNodes[i + 1].start(0, 0);
            });
        }
        node.connect(recordingCtx.destination);
    });
    const [first] = recordingNodes;
    first.start(0, 0);
    const audioBuffer = await recordingCtx.startRendering();
    return audioBuffer;
};
