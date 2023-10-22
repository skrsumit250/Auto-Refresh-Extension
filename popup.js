document.getElementById('start').addEventListener('click', () => {
  const interval = parseInt(document.getElementById('interval').value, 10);

  if (isNaN(interval) || interval < 1) {
    alert('Please enter a valid time interval');
    return;
  }

  chrome.runtime.sendMessage({ action: 'startRefresh', interval });
  window.close();
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stopRefresh' });
  window.close();
});
