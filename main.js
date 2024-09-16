document.addEventListener('DOMContentLoaded', () => {
  console.log('testing');
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    console.log(tabs);
    // document.querySelector('body').innerHTML = `tabs: ${tabs[0].title}`;
    // console.log(tabs);
    function deleteTab(tabId) {
      chrome.tabs.remove(tabId);
    }

    // iterate over array of tabs
    // for each tab
    // create new li item
    // add innerhtml to li item equal to tab title
    // create new button item with innerhtml of Delete Tab
    // add onclick event listener to button with anonymous function invoking deleteTab with current tabId
    // append button to li item
    // append li to ol
    const tabListElement = document.getElementById('tab-list');

    for (let i = 0; i < tabs.length; i++) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${tabs[i].title}`;

      const button = document.createElement('button');
      button.innerHTML = 'Delete Tab';
      button.addEventListener('click', () => {
        deleteTab(tabs[i].id);
        window.location.reload();
      });

      listItem.appendChild(button);
      tabListElement.appendChild(listItem);
    }
  });
});
