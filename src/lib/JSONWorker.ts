async function uploadFile(file: Blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = (event: any) => resolve(event.target.result);
        fileReader.onerror = (error) => reject(error)
        fileReader.readAsArrayBuffer(file)
    })
}

onmessage = async ({data}: MessageEvent<Blob>) => {
    const start = Date.now();
    const value = await uploadFile(data);
    console.log(`Worker: ${Date.now() - start}ms`);
    postMessage(value);
};