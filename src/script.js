const input = document.querySelector('input[type="file"]');

input.addEventListener('change', async function (e) {
    async function parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = event => resolve(JSON.parse(event.target.result))
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })
    }
    const file = e.target.files[0]

    const object = await parseJsonFile(file)
    console.log(JSON.stringify(object))
})