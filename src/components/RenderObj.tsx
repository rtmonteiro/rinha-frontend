import { For, Switch, Match, createSignal } from "solid-js";

export const RenderObj = ({ object }: { object: Record<string, any> }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <For each={Object.keys(object)}>
      {(key) => (
        <div class="node">
          <Switch>
            <Match
              when={typeof object[key] === "object" && object[key] !== null}
            >
              <details onToggle={setIsOpen}>
                <summary>
                  <p
                    class="key"
                    classList={{ array: Array.isArray(object[key]) }}
                  >
                    {key}:
                  </p>
                </summary>
                {isOpen() && <RenderObj object={object[key]} />}
              </details>
            </Match>
            <Match when={object[key] === null}>
              <p class="value">{key}: null</p>
            </Match>
            <Match when={typeof object[key] === "string"}>
              <p class="value">
                {key}: "{object[key]}"
              </p>
            </Match>
            <Match when={typeof object[key] === "number"}>
              <p class="value">
                {key}: {object[key]}
              </p>
            </Match>
            <Match when={typeof object[key] === "boolean"}>
              <p class="value">
                {key}: {object[key] ? "true" : "false"}
              </p>
            </Match>
          </Switch>
        </div>
      )}
    </For>
  );
};
