import './App.css'
import {createSignal, For, Match, Show, Switch} from "solid-js";

function App() {
    let [object, setObject] =
        createSignal(null as any);
    let [error, setError] =
        createSignal(false);
    let [fileName, setFileName] =
        createSignal("")

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
        setFileName(file.name)
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

    const Obj = ({object}: { object: Record<string, any> }) => (
        <For each={Object.keys(object)}>
            {(key) => (
                <div class="node">
                    <Switch>
                        <Match when={typeof object[key] === "object" && object[key] !== null}>
                            <p class="key" classList={{array: Array.isArray(object[key])}}>{key}:</p>
                            <Obj object={object[key]}/>
                        </Match>
                        <Match when={object[key] === null}>
                            <p class="value">{key}: null</p>
                        </Match>
                        <Match when={typeof object[key] === "string"}>
                            <p class="value">{key}: "{object[key]}"</p>
                        </Match>
                        <Match when={typeof object[key] === "number"}>
                            <p class="value">{key}: {object[key]}</p>
                        </Match>
                        <Match when={typeof object[key] === "boolean"}>
                            <p class="value">{key}: {object[key] ? "true" : "false"}</p>
                        </Match>
                    </Switch>
                </div>
            )}
        </For>);

    return (
        <>
            <div class="container">
                <Show when={object() === null}>
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
                </Show>
                <Show when={object() !== null}>
                    <h2>{fileName()}</h2>
                    <div class="tree">
                        <Obj object={object()}/>
                    </div>
                </Show>
            </div>
        </>
    )
}

export default App