window.addEventListener('load', function load(event) {
    TokenValidator.loadApiTokenFromStorageAndVerify();
    TagHelper.loadSelectedTagsFromStorage();
    EventRegistration.registerCheckApiTokenButton();
    EventRegistration.registerGenerateBookmarksButton();
});
