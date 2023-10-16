async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = (event) => {
            const res = event.target.result;
            return resolve(res);
        }
        fileReader.onerror = (error) => reject(error)
        fileReader.readAsArrayBuffer(file)
    })
}

onmessage = async (event) => {
    const start = Date.now();
    const value = await parseJsonFile(event.data);
    console.log(`Worker: ${Date.now() - start}ms`);
    postMessage(value);
};