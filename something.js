// Extensions can save data using the storage API, the HTML5 web storage API (such as localStorage) or
// by making server requests that result in saving data. Whenever you want to save something,
// first consider whether it's from a window that's in incognito mode.

// To detect if a window is in incognito mode, check the incognito property of the relevant tabs.Tab or windows.Window object.
// For example:

// function saveTabData(tab, data) {
//   if (tab.incognito) {
//     chrome.runtime.getBackgroundPage(function(bgPage) {
//       bgPage[tab.url] = data;      // Persist data ONLY in memory
//     });
//   } else {
//     localStorage[tab.url] = data;  // OK to store data
//   }
// }
