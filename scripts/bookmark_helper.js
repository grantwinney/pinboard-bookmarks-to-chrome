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
                            o.tags = url['tags'];
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

    static generateBookmarks(urls) {
        chrome.bookmarks.getChildren("0", function(children) {
            for (var i = 0; i < children.length; i++) {
                if (children[i].title == 'Bookmarks Bar') {
                    urls.forEach(function(url) {
                        console.log('Creating bookmark \'' + url['description'] + '\' to \'' + url['href'] + '\' with tags \'' + url['tags'] + '\'');
                    });

                    // if (ADD_ALL_TO_SUBFOLDER) {
                    //     createPageOrFolder(node, children[i].id);
                    // } else {
                    //     traverseNodes(node, children[i].id);
                    // }
                    break;
                } else {
                    console.error('Cannot add bookmarks. Unable to find the \'Bookmarks Bar\'.')
                }
            }
        });
    }

    // function traverseNodes(parentNode, parentId) {
    //     for (var i = 0; i < parentNode.nodes.length; i++) {
    //         createPageOrFolder(parentNode.nodes[i], parentId);
    //     }
    // }

    // function createPageOrFolder(node, parentId) {
    //     chrome.bookmarks.create({'parentId': parentId,
    //                              'title': node.title,
    //                              'url': node.url},
    //                             function(newPageOrFolder) {
    //                                 if (node.isFolder) {
    //                                     traverseNodes(node, newPageOrFolder.id)
    //                                 }
    //                             });
    // }

    // function node(title, url, nodes=[]) {
    //     this.id = "-1";
    //     this.title = title;
    //     this.url = url;
    //     this.isFolder = (url == null);
    //     this.nodes = nodes;
    // }
}
