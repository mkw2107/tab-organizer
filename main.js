/*
To Add:
- total tabs (in window)
- delete all (by group, or just delete google searches)
*/

document.addEventListener('DOMContentLoaded', () => {
  function deleteTab(tabId) {
    chrome.tabs.remove(tabId);
  }

  function switchTab(tabId) {
    chrome.tabs.update(tabId, { active: true });
  }

  // query the current window's tabs, and do things with the tabs
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    console.log(tabs);

    const tabListElement = document.getElementById('tab-list');

    // Creating/maintaing tab list
    function addTabToList(tab) {
      // make list item
      const listItem = document.createElement('li');
      listItem.innerHTML = `${tab.title}`;

      // make container for switch and delete buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      // make delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete Tab';
      deleteButton.addEventListener('click', () => {
        deleteTab(tab.id);
        window.location.reload();
      });
      deleteButton.classList.add('delete-tab');

      // make switch button
      const switchButton = document.createElement('button');
      switchButton.innerHTML = 'Switch to';
      switchButton.addEventListener('click', () => {
        switchTab(tab.id);
      });
      switchButton.classList.add('switch-tab');

      // append everything to the DOM
      listItem.appendChild(buttonContainer);
      buttonContainer.appendChild(switchButton);
      buttonContainer.appendChild(deleteButton);
      tabListElement.appendChild(listItem);
    }

    function clearList() {
      tabListElement.innerHTML = '';
    }

    // add tab title to list, and add delete and switch buttons
    for (let i = 0; i < tabs.length; i++) {
      addTabToList(tabs[i]);
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
      window.location.reload();
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

    // Search input
    function searchTabs(input) {
      clearList();

      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url.includes(input) || tabs[i].title.includes(input)) {
          addTabToList(tabs[i]);
        }
      }
    }
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
      console.log('input received!');
      searchTabs(e.target.value);
    });
  });
});
