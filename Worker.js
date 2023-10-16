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
console.log('Worker Started')

onmessage = async (event) => {
    const value = await parseJsonFile(event.data);
    postMessage(value);
};