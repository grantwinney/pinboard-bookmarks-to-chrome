// right now, always set to true, might add as option later
var ADD_ALL_TO_SUBFOLDER = true;
var ALL_POSTS_REQUEST_LIMIT_IN_SEC = 300;

class BookmarkHelper {
    static getAllPostsAndGenerateBookmarks() {
        chrome.storage.local.get('all_bookmarks_last_updated', function(result) {
            if (result != undefined
                && result.all_bookmarks_last_updated != undefined
                && ((new Date() - Date.parse(result.all_bookmarks_last_updated)) / 1000) < ALL_POSTS_REQUEST_LIMIT_IN_SEC) {
                BookmarkHelper.getAllPostsFromLocalStorage();
            } else {
                BookmarkHelper.getAllPostsFromPinboard();
            }
        });
    }

    static getAllPostsFromLocalStorage() {
        chrome.storage.local.get('all_bookmarks', function(result) {
            if (result != undefined && result.all_bookmarks != undefined) {
                BookmarkHelper.generateBookmarks(result.all_bookmarks);
            } else {
                BookmarkHelper.getAllPostsFromPinboard();
            }
        });
    }

    static getAllPostsFromPinboard() {
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
                        BookmarkHelper.generateBookmarks(data);
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

    static generateBookmarks(allUrls) {
        chrome.bookmarks.getChildren("0", function(children) {
            for (var i = 0; i < children.length; i++) {
                if (children[i].title == 'Bookmarks Bar') {
                    var relevantUrls = BookmarkHelper.filterBookmarksToSelectedTags(allUrls);
                    var selectedTags = TagHelper.getSelectedTagDataJson();
                    // if (ADD_ALL_TO_SUBFOLDER) {
                        BookmarkHelper.createPageOrFolder(children[i].id, selectedTags, relevantUrls);
                    // } else {
                    //     BookmarkHelper.traverseNodes(selectedTags[0]["children"], relevantUrls);
                    // }
                    break;
                } else {
                    console.error('Cannot add bookmarks. Unable to find the \'Bookmarks Bar\'.')
                }
            }
        });
    }

    static filterBookmarksToSelectedTags(allUrls) {
        var distinctTagNames = TagHelper.getDistinctTagNames();
        var relevantUrls = [];
        for (var t = 0; t < distinctTagNames.length; t++) {
            var tag = distinctTagNames[t];
            for (var u = 0; u < allUrls.length; u++) {
                var url = allUrls[u];
                if (url.tags.indexOf(tag) != -1 && relevantUrls.indexOf(url) == -1) {
                    relevantUrls.push(url);
                }
            }
        }
        return relevantUrls;
    }

    static createPageOrFolder(parentNodeId, tagNode, urls) {
        for (var x = 0; x < tagNode.length; x++) {
            var tag = tagNode[x];
            var tagClone = JSON.parse(JSON.stringify(tag));
            if (tagClone['type'] == 'default') {
                chrome.bookmarks.create({'parentId': parentNodeId,
                                         'title': tagClone['text']},
                                        function(newFolder) {
                                            alert(JSON.stringify(tagClone));
                                            BookmarkHelper.createPageOrFolder(newFolder.id, tagClone['children'], urls);
                                        });
            // } else {
            //     for (var i = 0; i < urls.length; i++) {
            //         var url = urls[i]
            //         if (url['tags'].indexOf(tag['text'] != -1)) {
            //             chrome.bookmarks.create({'parentId': parentNodeId,
            //                                      'title': url['description'],
            //                                      'url': url['href']});
            //         }
            //     }
            }
        }
    }


    // function traverseNodes(parentNode, parentId) {
    //     for (var i = 0; i < parentNode.nodes.length; i++) {
    //         createPageOrFolder(parentNode.nodes[i], parentId);
    //     }
    // }


    // function node(title, url, nodes=[]) {
    //     this.id = "-1";
    //     this.title = title;
    //     this.url = url;
    //     this.isFolder = (url == null);
    //     this.nodes = nodes;
    // }
}
