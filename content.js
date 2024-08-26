class SettingsManager {
  constructor() {
    this.settings = {};
    this.listeners = [];
    this.loadSettings();
    this.listenForChanges();
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get(['debugPrefix', 'hotkey']);
    this.settings.debugPrefix = result.debugPrefix || '✅';
    this.settings.hotkey = result.hotkey || 'Ctrl+Alt+¬';
    this.notifyListeners();
  }

  listenForChanges() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        Object.keys(changes).forEach((key) => {
          this.settings[key] = changes[key].newValue;
        });
        this.notifyListeners();
      }
    });
  }

  onSettingsChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.settings));
  }
}

class ScriptInjector {
  static injectScript(src, settings) {
    this.ejectScript();

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(src);
    script.onload = () => {
      const event = new CustomEvent('injectSettings', { detail: settings });
      document.dispatchEvent(event);
      script.remove();
    };
    (document.head || document.documentElement).append(script);
  }

  static ejectScript() {
    const existingScript = document.querySelector(`script[src="${chrome.runtime.getURL(src)}"]`);
    if (existingScript) {
      console.log('🟥  Eject existing script');
      existingScript.remove();
    }
  }
}

const settingsManager = new SettingsManager();
settingsManager.onSettingsChange((settings) => {
  ScriptInjector.injectScript('insert_debug_statement.js', settings);
});
