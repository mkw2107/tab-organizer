/*
To Add:
- total tabs (in window)
- organize all
- delete all (by group, or just delete google searches)
- add search function for tab titles
*/

document.addEventListener('DOMContentLoaded', () => {
  function deleteTab(tabId) {
    chrome.tabs.remove(tabId);
  }

  function switchTab(tabId) {
    chrome.tabs.update(tabId, { active: true });
  }

  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    console.log(tabs);

    const tabListElement = document.getElementById('tab-list');

    // add tab title to list, and add delete and switch buttons
    for (let i = 0; i < tabs.length; i++) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${tabs[i].title}`;

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete Tab';
      deleteButton.addEventListener('click', () => {
        deleteTab(tabs[i].id);
        window.location.reload();
      });
      deleteButton.classList.add('delete-tab');

      const switchButton = document.createElement('button');
      switchButton.innerHTML = 'Switch to';
      switchButton.addEventListener('click', () => {
        switchTab(tabs[i].id);
      });
      switchButton.classList.add('switch-tab');

      listItem.appendChild(buttonContainer);
      buttonContainer.appendChild(switchButton);
      buttonContainer.appendChild(deleteButton);
      tabListElement.appendChild(listItem);
    }

    // Organize Tabs
    function organizeTabs() {
      tabs.sort((tab1, tab2) => {
        if (tab1.url < tab2.url) return -1;
        if (tab2.url < tab1.url) return 1;
        else return 0;
      });
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.move(tabs[i].id, { index: i });
      }
    }
    let organizeButton = document.getElementById('organize');
    organizeButton.addEventListener('click', organizeTabs);

    // Close All Tabs
    function closeAll() {
      chrome.tabs.create({});
      for (let i = 0; i < tabs.length; i++) {
        deleteTab(tabs[i].id);
      }
    }
    let closeAllButton = document.getElementById('close-all');
    closeAllButton.addEventListener('click', closeAll);
  });
});
