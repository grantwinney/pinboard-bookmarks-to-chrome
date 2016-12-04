// right now, always set to true, might add as option later
ADD_ALL_TO_SUBFOLDER = true;
ALL_POSTS_REQUEST_LIMIT_IN_SEC = 300;
ROOT_NODE_ID = 'node_0';

window.addEventListener('load', function load(event) {
    loadApiTokenFromStorageAndVerify();
    loadSelectedTagsFromStorage();
    registerCheckApiTokenButton();
    registerGenerateBookmarksButton();
});
