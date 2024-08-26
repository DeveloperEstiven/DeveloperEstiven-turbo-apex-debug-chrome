const REGEXP = {
  EMOJI:
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
  SUPPORTED_URL: /^https:\/\/[a-zA-Z0-9.-]+\.salesforce\.com\/.*\/apex\/debug\/ApexCSIPage/,
};

const CHROME_STORAGE = {
  hotkey: 'hotkey',
  debugPrefix: 'debugPrefix',
};

const ICON = {
  active: '/images/icon-128.png',
  inactive: '/images/icon-128-gray.png',
};

const TAB_OPTIONS = { active: true, currentWindow: true };

document.addEventListener('DOMContentLoaded', () => {
  const status = document.querySelector('.status');
  const optionsButton = document.querySelector('.options-button');
  const prefixIcon = document.querySelector('.prefix-icon');
  const icon = document.querySelector('.icon');

  chrome.tabs.query(TAB_OPTIONS, (tabs) => {
    if (REGEXP.SUPPORTED_URL.test(tabs[0].url)) {
      chrome.storage.sync.get(CHROME_STORAGE.hotkey, (result) => {
        const hotkey = result[CHROME_STORAGE.hotkey] ?? '';
        status.textContent = 'Extension is active. Select any apex variable and press ';

        const hotkeyHint = document.createElement('b');
        hotkeyHint.textContent = hotkey;

        status.appendChild(hotkeyHint);
        icon.src = ICON.active;
      });
      return;
    }

    status.textContent = 'Extension is not active on this page. Please open Salesforce Developer Console';
    icon.src = ICON.inactive;
  });

  chrome.storage.sync.get(CHROME_STORAGE.debugPrefix, (result) => {
    const prefix = result[CHROME_STORAGE.debugPrefix] || '';

    if (REGEXP.EMOJI.test(prefix)) {
      prefixIcon.textContent = prefix;
    }
  });

  optionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage(); //FIXME: page blinks
  });
});
