// right now, always set to true, might add as option later
ADD_ALL_TO_SUBFOLDER = true;
ALL_POSTS_REQUEST_LIMIT_IN_SEC = 300;
ROOT_NODE_ID = 'node_0';

function disableInputElements(message) {
    $("#tagTree").addClass("disabledElement");
    $("#apiToken").addClass("disabledElement");
    $("#verifyApiToken").addClass("disabledElement");
    $("#generateBookmarks").addClass("disabledElement");
    $("#tagContainer").addClass("disabledElement");

    $("#innerNotice").text(message);
}

function enableInputElements() {
    $("#tagTree").removeClass("disabledElement");
    $("#apiToken").removeClass("disabledElement");
    $("#verifyApiToken").removeClass("disabledElement");
    $("#generateBookmarks").removeClass("disabledElement");
    $("#tagContainer").removeClass("disabledElement");
}

window.addEventListener('load', function load(event) {
    loadApiTokenFromStorageAndVerify();
    loadSelectedTagsFromStorage();
    registerCheckApiTokenButton();
    registerGenerateBookmarksButton();
    disableInputElements("Initializing...");
});
