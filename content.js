let debugPrefix = '✅'; // Default prefix

function injectScript(src, prefix) {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  s.onload = () => {
    const event = new CustomEvent('injectDebugPrefix', { detail: { prefix } });
    document.dispatchEvent(event);
    s.remove();
  };
  (document.head || document.documentElement).append(s);
}

// Initial load of the debug prefix
chrome.storage.sync.get(['debugPrefix'], (result) => {
  debugPrefix = result.debugPrefix || '✅';
  injectScript("insert_debug_statement.js", debugPrefix);
});

// Listen for changes to the debug prefix
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.debugPrefix) {
    debugPrefix = changes.debugPrefix.newValue || '✅';
    // Update the prefix in the injected script
    const event = new CustomEvent('injectDebugPrefix', { detail: { prefix: debugPrefix } });
    document.dispatchEvent(event);
  }
});
