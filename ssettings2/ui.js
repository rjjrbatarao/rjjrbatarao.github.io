// File-backed ObraJS views. Serve through HTTP, not file://.
window.obrajs = new ObraJS();
window.OrbitUI = (() => {
  const obra = window.obrajs;
  let safeMode = false;
  let sequence = 0;
  const originalTemplate = obra.oTemplate.bind(obra);

  // oHtml internally calls oTemplate. Preserve its normal behavior, with
  // non-evaluating substitution when CSP prohibits new Function.
  obra.oTemplate = (template, props = {}) => {
    if (!safeMode) {
      try {
        return originalTemplate(template, props);
      } catch (error) {
        if (
          error.name !== "EvalError" &&
          !/unsafe-eval|content security policy/i.test(error.message)
        )
          throw error;
        safeMode = true;
      }
    }
    return template.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (_, key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key))
        throw new Error(`Missing template property: ${key}`);
      return String(props[key] ?? "");
    });
  };

  function mount(targetId, name, props = {}) {
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name))
      throw new Error("Invalid template name");
    const target = obra.oId(targetId);
    if (!target) throw new Error(`Missing view container: ${targetId}`);
    const path = `templates/${name}.html`;
    try {
      // Actual upstream oHtml file loader: target ID, URL, properties, synchronous.
      const source = obra.oHtml(targetId, path, props, false);
      if (source === null) throw new Error(`Unable to load ${path}`);
    } catch (error) {
      target.textContent = `Could not load ${path}. Run this project through an HTTP server and check that the templates folder exists.`;
      console.error(error);
      throw error;
    }
    return target;
  }

  function render(name, props = {}) {
    // Nested components also load with oHtml. Table rows need a tbody context.
    const host = document.createElement("div");
    host.hidden = true;
    const target = document.createElement(/Row$/.test(name) ? "tbody" : "div");
    target.id = `orbit-template-${++sequence}`;
    host.appendChild(target);
    document.body.appendChild(host);
    try {
      return mount(target.id, name, props).innerHTML;
    } finally {
      host.remove();
    }
  }

  return Object.freeze({ mount, render });
})();
