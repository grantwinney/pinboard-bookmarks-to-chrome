function getAllPostsAndGenerateBookmarks() {
    chrome.storage.local.get('all_bookmarks_last_updated', function(result) {
        if (result != undefined
            && result.all_bookmarks_last_updated != undefined
            && ((new Date() - Date.parse(result.all_bookmarks_last_updated)) / 1000) < ALL_POSTS_REQUEST_LIMIT_IN_SEC) {
            getAllPostsFromLocalStorage();
        } else {
            getAllPostsFromPinboard();
        }
    });
}

function getAllPostsFromLocalStorage() {
    chrome.storage.local.get('all_bookmarks', function(result) {
        if (result != undefined && result.all_bookmarks != undefined) {
            generateBookmarks(result.all_bookmarks);
        } else {
            getAllPostsFromPinboard();
        }
    });
}

function getAllPostsFromPinboard() {
    chrome.storage.local.get('api_token', function(result) {
        if (result != undefined && result.api_token != undefined) {
            var client = new XMLHttpRequest();
            client.open("GET", 'https://api.pinboard.in/v1/posts/all?format=json&auth_token=' + result.api_token);
            client.onload = function(e) {
                if (client.status == 200) {
                    var rawdata = JSON.parse(client.responseText);
                    var data = [];
                    rawdata.forEach(function(url) {
                        var o = new Object();
                        o.href = url['href'];
                        o.description = url['description'];
                        o.tags = url['tags'].split(' ');
                        data.push(o);
                    });
                    chrome.storage.local.set({'all_bookmarks_last_updated': new Date().toString()});
                    chrome.storage.local.set({'all_bookmarks': data});
                    generateBookmarks(data);
                } else {
                    console.error('Call to /posts/all failed with response: ' + client.status + ' ' + client.statusText);
                }
            };
            client.send();
        } else {
            console.error('API Token is missing. Unable to get bookmarks from Pinboard.')
        }
    });
}

function generateBookmarks(allUrls) {
    chrome.bookmarks.getChildren("0", function(children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].title == 'Bookmarks Bar') {
                var relevantUrls = filterBookmarksToSelectedTags(allUrls);
                var selectedTags = getSelectedTagDataJson();
                // if (ADD_ALL_TO_SUBFOLDER) {
                    createPageOrFolder(children[i].id, selectedTags, relevantUrls);
                // } else {
                //     // call createPageOrFolder() in such a way that the main Pinboard folder is not created,
                //     // and everything else appears directly in the Bookmarks Bar instead of the Pinboard folder.
                // }
                break;
            } else {
                console.error('Cannot add bookmarks. Unable to find the \'Bookmarks Bar\'.')
            }
        }
    });
}

function filterBookmarksToSelectedTags(allUrls) {
    var distinctTagNames = getDistinctTagNames();
    var relevantUrls = [];
    distinctTagNames.forEach(function(tag) {
        allUrls.forEach(function(url) {
            if (url.tags.indexOf(tag) != -1 && relevantUrls.indexOf(url) == -1) {
                relevantUrls.push(url);
            }
        })
    })
    return relevantUrls;
}

function createPageOrFolder(parentNodeId, tagNode, urls) {
    tagNode.forEach(function(tag) {
        if (tag['type'] == 'default') {
            chrome.bookmarks.create({'parentId': parentNodeId,
                                     'title': tag['text']},
                                    function(newFolder) {
                                        createPageOrFolder(newFolder.id, tag['children'], urls);
                                    });
        } else {
            urls.forEach(function(url) {
                if (url['tags'].indexOf(tag['text']) != -1) {
                    chrome.bookmarks.create({'parentId': parentNodeId,
                                             'title': url['description'],
                                             'url': url['href']});
                }
            })
        }
    })
}
