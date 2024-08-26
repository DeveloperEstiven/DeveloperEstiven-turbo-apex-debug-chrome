(() => {
  console.log('🚀 Turbo Apex Debug script injected');
  let currentSettings = { debugPrefix: '✅', hotkey: 'Ctrl+Alt+¬' };

  const REGEXP = {
    ADDITIONAL_INDENT: /^\s*(public|private|global|protected|if|for|while|switch|try|catch|else|@|class)/,
    INDENT: /^\s*/,
  };

  const KEYS = {
    CTRL: 'control',
    ALT: 'alt',
    SHIFT: 'shift',
    CMD: 'meta',
  };

  document.addEventListener('injectSettings', (event) => {
    currentSettings = event.detail;
  });

  function buildStatement(indentation, selectedText) {
    return `${indentation}System.debug('${currentSettings.debugPrefix} ${selectedText}: ' + ${selectedText});`;
  }

  function insertDebugStatement() {
    const editor = document.querySelector('.CodeMirror')?.CodeMirror;

    if (!editor) {
      console.log('❌ No active editor found. Please open the Salesforce Developer Console.');
      return;
    }

    const selectedText = editor.getSelection();

    if (!selectedText.trim()) {
      console.log('❌ Please select a variable or expression to debug.');
      return;
    }

    const cursor = editor.getCursor();
    const line = cursor.line;
    const lineContent = editor.getLine(line);
    const indentMatch = lineContent.match(REGEXP.INDENT);
    let indentation = indentMatch ? indentMatch[0] : '';

    const isReturnLine = lineContent.trim().startsWith('return') && lineContent.includes(selectedText);
    if (isReturnLine) {
      editor.replaceRange(`${buildStatement(indentation, selectedText)}\n`, { line, ch: 0 });
      return;
    }

    if (REGEXP.ADDITIONAL_INDENT.test(lineContent.trim())) {
      indentation += '\t';
    }

    editor.replaceRange(`\n${buildStatement(indentation, selectedText)}`, { line, ch: lineContent.length });
  }

  function matchHotkey(event, hotkey) {
    const keys = hotkey.split('+').map((k) => k.trim().toLowerCase());
    const eventKey = event.key.toLowerCase();
    const modifiersMatch = keys.every((key) => {
      if (key === KEYS.CTRL) return event.ctrlKey;
      if (key === KEYS.ALT) return event.altKey;
      if (key === KEYS.SHIFT) return event.shiftKey;
      if (key === KEYS.CMD) return event.metaKey;
      return eventKey === key;
    });
    modifiersMatch && console.log(`Hotkey: ${keys.join(' + ')}; Key: ${eventKey}; ✅ Insert statement`);
    return modifiersMatch;
  }

  if (!window.onKeydownListener) {
    window.onKeydownListener = (event) => {
      if (matchHotkey(event, currentSettings.hotkey)) {
        event.preventDefault();
        insertDebugStatement();
      }
    };

    document.addEventListener('keydown', window.onKeydownListener);
  }
})();
