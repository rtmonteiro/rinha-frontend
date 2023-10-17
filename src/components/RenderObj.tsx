import "./RenderObj.css";
import {
  For,
  Switch,
  Match,
  createSignal,
  onMount,
  createEffect,
} from "solid-js";
import {createMutable} from "solid-js/store";

const OFFSET = 40;

export const RenderObj = ({object}: { object: Record<string, any> }) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [tam, setTam] = createSignal(OFFSET);
  const [objSliced, setObjSliced] = createSignal(
    Object.keys(object).slice(0, OFFSET)
  );
  const [target, setTarget] = createSignal(
    document.querySelector(".container")!
  );
  let observer: IntersectionObserver;

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(entry)
          setObjSliced(
            createMutable(Object.keys(object).slice(0, tam() + OFFSET))
          );
          setTam((tam) => tam + OFFSET);
          const el = document.querySelector(".node.last");
          if (el !== null) setTarget(el);
        }
      });
    });
  });

  createEffect(() => {
    observer.observe(target());
  });

  return (
    <For each={objSliced()}>
      {(key, index) => (
        <div class="node" classList={{last: index() === objSliced().length - 1}}>
          <Switch>
            <Match
              when={typeof object[key] === "object" && object[key] !== null}
            >
              <details onToggle={setIsOpen}>
                <summary>
                  <p
                    class="key"
                    classList={{
                      array: Array.isArray(object[key]),
                      index: !isNaN(Number(key)),
                    }}
                  >
                    {key}:
                  </p>
                </summary>
                {isOpen() && <RenderObj object={object[key]}/>}
              </details>
            </Match>
            <Match when={object[key] === null}>
              <p class="value">
                <span class="key">{key}:</span> null
              </p>
            </Match>
            <Match when={typeof object[key] === "string"}>
              <p class="value">
                <span class="key">{key}:</span> "{object[key]}"
              </p>
            </Match>
            <Match when={typeof object[key] === "number"}>
              <p class="value">
                <span class="key">{key}:</span> {object[key]}
              </p>
            </Match>
            <Match when={typeof object[key] === "boolean"}>
              <p class="value">
                <span class="key">{key}:</span> {object[key] ? "true" : "false"}
              </p>
            </Match>
          </Switch>
        </div>
      )}
    </For>
  );
};
