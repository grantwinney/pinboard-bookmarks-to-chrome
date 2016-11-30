class EventRegistration {
    static registerCheckApiTokenButton() {
        var verifyApiToken = document.getElementById('verifyApiToken');
        verifyApiToken.addEventListener('click', function() {
            var apiToken = document.getElementById('apiToken');
            TokenValidator.verifyApiTokenAndLoadTags(apiToken.value);
        });
    }

    static registerGenerateBookmarksButton() {
        var generateBookmarks = document.getElementById('generateBookmarks');
        generateBookmarks.addEventListener('click', function() {
            chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')}, function() {
                BookmarkHelper.getAllPostsAndGenerateBookmarks();
            });
        });
    }
}
