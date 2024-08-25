document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  const status = document.getElementById('status');
  const debugPrefixInput = document.getElementById('debugPrefix');

  // Load saved prefix from chrome.storage
  chrome.storage.sync.get(['debugPrefix'], (result) => {
    if (result.debugPrefix) {
      debugPrefixInput.value = result.debugPrefix;
    }
  });

  // Save the prefix to chrome.storage
  saveButton.addEventListener('click', () => {
    const debugPrefix = debugPrefixInput.value.trim();
    chrome.storage.sync.set({ debugPrefix }, () => {
      status.textContent = 'Prefix saved!';
      setTimeout(() => { status.textContent = ''; }, 1500);
    });
  });
});
