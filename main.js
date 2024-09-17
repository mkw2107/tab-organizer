/*
To Add:
- total tabs (in window)
- delete all (by group, or just delete google searches)
*/

// add delete button for search results
// when search bar has anything other than an empty string, have a delete results button available
// delete search results button should delete only the tabs that are in the list

document.addEventListener('DOMContentLoaded', () => {
  // query the current window's tabs, and do things with the tabs
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    // delete one tab
    // chrome.tabs.remove is asynchronous but doesn't return a promise, so is hard to use reliably.
    // so I made it a Promise
    function deleteTab(tabId) {
      return new Promise((resolve, reject) => {
        chrome.tabs.remove(tabId, () => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          resolve();
        });
      });
    }

    // switch active tab to specific tab
    function switchTab(tabId) {
      chrome.tabs.update(tabId, { active: true });
    }

    // variables
    const tabListElement = document.getElementById('tab-list');
    let searchedTabs = [];

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
      deleteButton.addEventListener('click', async () => {
        await deleteTab(tab.id);

        clearList();
        chrome.tabs.query(
          { windowId: chrome.windows.WINDOW_ID_CURRENT },
          (tabs) => {
            addAllTabs(tabs);
          }
        );
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
    function addAllTabs(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        addTabToList(tabs[i]);
      }
    }

    addAllTabs(tabs);

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
      clearList();
      addAllTabs(tabs);
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

    // Delete Searched Tabs
    const deleteSearchButton = document.createElement('button');
    deleteSearchButton.innerHTML = 'Delete Searched Tabs';
    deleteSearchButton.id = 'delete-search';
    const searchContainer = document.getElementById('search-container');
    async function deleteSearchResults() {
      const deletedTabs = [];
      for (let i = 0; i < searchedTabs.length; i++) {
        deletedTabs.push(deleteTab(searchedTabs[i].id));
      }
      await Promise.all(deletedTabs);
      searchInput.value = '';
      clearList();
      chrome.tabs.query(
        { windowId: chrome.windows.WINDOW_ID_CURRENT },
        (tabs) => {
          addAllTabs(tabs);
        }
      );
    }
    deleteSearchButton.addEventListener('click', deleteSearchResults);

    // Search input
    function searchTabs(input) {
      clearList();
      searchedTabs = [];

      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url.includes(input) || tabs[i].title.includes(input)) {
          addTabToList(tabs[i]);
          searchedTabs.push(tabs[i]);
          console.log(searchedTabs);
        }
      }

      if (input.length > 0) {
        searchContainer.appendChild(deleteSearchButton);
      } else {
        searchContainer.removeChild(deleteSearchButton);
      }
    }
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
      searchTabs(e.target.value);
    });
  });
});
