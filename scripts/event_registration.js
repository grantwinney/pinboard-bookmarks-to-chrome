function registerCheckApiTokenButton() {
    $("#verifyApiToken").on('click', function() {
        verifyApiTokenAndLoadTags($("#apiToken").val());
    });
}

function registerGenerateBookmarksButton() {
    $("#generateBookmarks").on('click', function() {
        chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')}, function() {
            getAllPostsAndGenerateBookmarks();
        });
    });
}
