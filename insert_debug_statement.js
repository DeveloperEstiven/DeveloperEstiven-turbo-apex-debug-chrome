let currentSettings = { debugPrefix: '' };

document.addEventListener('injectSettings', (event) => {
  currentSettings = event.detail;
});

function insertDebugStatement() {
  const editor = document.querySelector('.CodeMirror')?.CodeMirror;

  if (editor) {
    const selectedText = editor.getSelection();
    const cursor = editor.getCursor();

    if (selectedText.trim()) {
      const line = cursor.line;
      const lineContent = editor.getLine(line);
      const indentMatch = lineContent.match(/^\s*/);
      let indentation = indentMatch ? indentMatch[0] : '';

      const debugStatement = `${indentation}System.debug('${currentSettings.debugPrefix} ${selectedText}: ' + ${selectedText});`;

      if (
        lineContent.trim().startsWith('return') &&
        lineContent.includes(selectedText)
      ) {
        editor.replaceRange(`${debugStatement}\n`, { line, ch: 0 });
      } else {
        if (
          /^\s*(public|private|global|protected|if|for|while|switch|try|catch|else|@|class)/.test(
            lineContent.trim()
          )
        ) {
          indentation += '\t';
        }

        editor.replaceRange(`\n${debugStatement}`, {
          line,
          ch: lineContent.length,
        });
      }
    } else {
      console.log('❌ Please select a variable or expression to debug.');
    }
  } else {
    console.log('❌ No active editor found. Please open the Salesforce Developer Console.');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.altKey && event.key === '¬') {
    event.preventDefault();
    insertDebugStatement();
  }
});
