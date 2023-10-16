import "./App.css";
import { createSignal, onCleanup, Show } from "solid-js";
import { RenderObj } from "./components/RenderObj";

function App() {
  let [object, setObject] = createSignal(null as any);
  let [error, setError] = createSignal(false);
  let [fileName, setFileName] = createSignal("");

  const w = new Worker("../Worker.js");

  async function handleUploadFile(e: { target: any }) {
    const file = e?.target?.files[0];
    setFileName(file.name);
    w.postMessage(file);

    w.onmessage = (res) => {
      const arrBuff = res.data;
      const json = JSON.parse(new TextDecoder().decode(arrBuff as ArrayBuffer));
      setError(false);
      setObject(json);
    };

    w.onmessageerror = (err) => {
      if (err instanceof SyntaxError) {
        console.log("Invalid JSON file");
        setError(true);
      }
      return null;
    };
  }

  onCleanup(() => {
    w.terminate();
  });

  return (
    <>
      <div class="container">
        <Show when={object() === null}>
          <h1>JSON Tree Viewer</h1>
          <p>
            Simple JSON Viewer that runs completely on-client. No data exchange
          </p>
          <div class="input">
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
            <RenderObj object={object()} />
          </div>
        </Show>
      </div>
    </>
  );
}

export default App;
