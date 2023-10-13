import './App.css'
import {createSignal, For, Match, Show, Switch} from "solid-js";

function App() {
    let [object, setObject] =
        createSignal(null as any);
    let [error, setError] =
        createSignal(false);

    async function parseJsonFile(file: Blob) {

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onloadend = (event: any) => resolve(event.target.result)
            fileReader.onerror = (error: any) => reject(error)
            fileReader.readAsArrayBuffer(file)
        })
    }

    async function handleUploadFile(e: any) {
        const file = e?.target?.files[0]
        setObject(await parseJsonFile(file)
            .then((result) => {
                try {
                    const json = JSON.parse(new TextDecoder().decode(result as ArrayBuffer))
                    console.log(json)
                    setError(false)
                    return json;
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log("Invalid JSON file")
                        setError(true)
                    }
                    return null;
                }
            }))
    }

    const Obj = ({object}: { object: any }) => <For each={Object.keys(object)}>
        {(key) => (
            <div class="node">
                <Switch
                    fallback={<p class="value">{key}:{object[key].toString()}</p>}>
                    <Match when={typeof object[key] === "object" && object[key] !== null}>
                        <div class="key">{key}</div>
                        <Obj object={object[key]}/>
                    </Match>
                    <Match when={object[key] === null}>
                        <p class="value">{key}: null</p>
                    </Match>
                </Switch>
            </div>
        )}
    </For>;
    return (
        <>
            <div class="container">
                <h1>JSON Tree Viewer</h1>
                <p>Simple JSON Viewer that runs completely on-client. No data exchange</p>
                <div class="input">
                    <label for="up_file">Load JSON</label>
                    <input onChange={handleUploadFile}
                           type="file"
                           name="up_file"
                           id="up_file"
                           accept=".json"/>
                </div>
                <Show when={error()}>
                    <p class="error">Invalid file. Please load a valid JSON file.</p>
                </Show>
                <Show when={object() !== null}>
                    <div class="tree">
                        {<Obj object={object()}/>}
                    </div>
                </Show>
            </div>
        </>
    )
}

export default App