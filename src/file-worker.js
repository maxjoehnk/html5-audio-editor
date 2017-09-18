this.addEventListener('message', event => {
    const file = event.data;
    const reader = new FileReaderSync();
    postMessage(reader.readAsArrayBuffer(file));
});
