import './App.css'

function App() {
    const input = document.querySelector('input[type="file"]');

    const fileReader = new FileReader()
    let object = null

    async function parseJsonFile(file: Blob) {
        return new Promise((resolve, reject) => {
            fileReader.onload = (event: Event) => resolve(JSON.parse(event.target!.result))
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })
    }

    input!.addEventListener('change', async function (e) {
        const file = e?.target?.files[0]
        object = await parseJsonFile(file)

        window.open('/json.html', '_blank')
    })

    return (
        <>
            <div class="container">
                <h1>JSON Tree Viewer</h1>
                <p>Simple JSON Viewer that runs completely on-client. No data exchange</p>
                <div class="input">
                    <label for="up_file">Load JSON</label>
                    <input type="file" name="up_file" id="up_file" accept=".json"/>
                </div>
                <p class="error">Invalid file. Please load a valid JSON file.</p>
            </div>
        </>
    )
}

export default App
