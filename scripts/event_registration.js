function registerCheckApiTokenButton() {
    $("#verifyApiToken").on('click', function() {
        verifyApiTokenAndLoadTags($("#apiToken").val());
    });
}

function registerGenerateBookmarksButton() {
    $("#generateBookmarks").on('click', function() {
        disableInputElements("Generating Bookmarks... (this may take a minute)");
        chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')}, function() {
            try {
                getAllPostsAndGenerateBookmarks();
            }
            finally {
                enableInputElements();
            }
        });
    });
}
