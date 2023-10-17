import "./App.css";
import {createSignal, onCleanup, Show} from "solid-js";
import {RenderObj} from "./components/RenderObj";
import JSONWorker from "./lib/JSONWorker?worker";

function App() {
  const [object, setObject] = createSignal(null as any);
  const [error, setError] = createSignal(false);
  const [fileName, setFileName] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  let w: Worker;

  async function handleUploadFile(e: { target: any }) {
    setLoading(true)
    const file = e?.target?.files[0];
    setFileName(file.name);

    if (window.Worker) {
      w = new JSONWorker();

      w.postMessage(file);

      w.onmessage = (res) => {
        const arrBuff = res.data;
        const start = Date.now();
        let json = null;
        try {
          json = JSON.parse(new TextDecoder().decode(arrBuff as ArrayBuffer));
          setError(false);
        } catch (err) {
          if (err instanceof SyntaxError) {
            console.log("Invalid JSON file");
            setError(true);
          }
        }
        setLoading(false)
        console.log(`Parse JSON: ${Date.now() - start}ms`);
        // console.log(json);
        setObject(json);
      };
    }
  }

  onCleanup(() => {
    if (w) w.terminate();
  })

  return (
    <>
      <div class="container">
        <Show when={object() === null}>
          <h1>JSON Tree Viewer</h1>
          <p>
            Simple JSON Viewer that runs completely on-client. No data exchange
          </p>
          <div class="input" classList={{loading: loading()}}>
            <label for="up_file">Load JSON</label>
            <input
              onChange={handleUploadFile}
              type="file"
              name="up_file"
              id="up_file"
              accept=".json"
            />
          </div>
          <Show when={error()}>
            <p class="error">Invalid file. Please load a valid JSON file.</p>
          </Show>
        </Show>
        <Show when={object() !== null}>
          <h2>{fileName()}</h2>
          <div class="tree">
            <RenderObj object={object()}/>
          </div>
        </Show>
      </div>
    </>
  );
}

export default App;
