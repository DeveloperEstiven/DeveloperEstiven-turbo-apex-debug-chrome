document.addEventListener('DOMContentLoaded', function () {
  const saveButton = document.getElementById('saveButton');
  const status = document.getElementById('status');
  const debugPrefixInput = document.getElementById('debugPrefix');
  const hotkeyInput = document.getElementById('hotkey-input');

  let pressedKeys = new Set();
  let isRecording = false;

  const validModifiers = ['Shift', 'Alt', 'Control', 'Meta'];

  chrome.storage.sync.get(['debugPrefix', 'hotkey'], (result) => {
    if (result.debugPrefix) {
      debugPrefixInput.value = result.debugPrefix;
    }
    if (result.hotkey) {
      hotkeyInput.value = result.hotkey;
    }
  });

  saveButton.addEventListener('click', () => {
    const debugPrefix = debugPrefixInput.value.trim();
    const hotkey = hotkeyInput.value.trim();

    chrome.storage.sync.set({ debugPrefix, hotkey }, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    });
  });

  function isValidHotkey() {
    const keys = Array.from(pressedKeys);
    const modifierKeys = keys.filter((key) => validModifiers.includes(key));
    const nonModifierKeys = keys.filter((key) => !validModifiers.includes(key));

    return modifierKeys.length >= 1 && modifierKeys.length <= 2 && nonModifierKeys.length === 1;
  }

  function updateHotkeyInput() {
    const keysArray = Array.from(pressedKeys);
    const modifierKeys = keysArray.filter((key) => validModifiers.includes(key));
    const nonModifierKeys = keysArray.filter((key) => !validModifiers.includes(key));

    if (modifierKeys.length > 0 && nonModifierKeys.length === 0) {
      hotkeyInput.value = keysArray.join(' + ') + ' + ...';
    } else {
      hotkeyInput.value = keysArray.join(' + ');
    }
  }

  hotkeyInput.addEventListener('focus', () => {
    pressedKeys.clear();
    hotkeyInput.value = '';
    isRecording = false;
  });

  hotkeyInput.addEventListener('keydown', (event) => {
    event.preventDefault();

    if (isRecording || validModifiers.includes(event.key)) {
      pressedKeys.add(event.key);
      isRecording = true;
    }

    updateHotkeyInput();

    if (isValidHotkey()) {
      hotkeyInput.blur();
    }
  });

  hotkeyInput.addEventListener('keyup', (event) => {
    if (isValidHotkey()) {
      hotkeyInput.blur();
    }
  });

  document.addEventListener('click', (event) => {
    if (!hotkeyInput.contains(event.target)) {
      hotkeyInput.blur();
    }
  });
});
