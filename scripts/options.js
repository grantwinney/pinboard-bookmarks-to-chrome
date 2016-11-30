// right now, always set to true, might add as option later
var ADD_ALL_TO_SUBFOLDER = true;

/*********************************************
 Create new bookmarks in the Bookmarks Bar
*********************************************/

function populateBookmarks(urls) {
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


/*********************************************
 API calls to Pinboard
*********************************************/

function getAllTags() {
    chrome.storage.local.get('api_token', function(result) {
        if (result != undefined) {
            var client = new XMLHttpRequest();
            client.open("GET", 'https://api.pinboard.in/v1/tags/get?format=json&auth_token=' + result.api_token);
            client.onload = function(e) {
                var tagContainer = document.getElementById('tagContainer');
                JSON.parse(client.responseText, (tagName, tagCount) =>
                {
                    if (tagName != '') {
                        var element = document.createElement('button');
                        element.textContent = tagName;
                        element.addEventListener('click', function() {
                            jstree_node_create(tagName);
                        });
                        element.classList.add("tag");
                        tagContainer.appendChild(element);
                    }
                });
                logApiResult(client, '/tags/get');
            };
            client.send();
        }
    });
}

function getAllPostsAndGenerateBookmarks() {
    chrome.storage.local.get('all_bookmarks_last_updated', function(result) {
        if (result != undefined
            && result.all_bookmarks_last_updated != undefined
            && ((new Date() - Date.parse(result.all_bookmarks_last_updated)) / 1000) <= 300) {
            getAllPostsFromLocalStorage();
        } else {
            getAllPostsFromPinboard();
        }
    });
}

function getAllPostsFromLocalStorage() {
    chrome.storage.local.get('all_bookmarks', function(result) {
        if (result != undefined && result.all_bookmarks != undefined) {
            populateBookmarks(result.all_bookmarks);
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
                    rawdata = JSON.parse(client.responseText);
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
                    populateBookmarks(data);
                } else {
                    logApiResult(client, '/posts/all');
                }
            };
            client.send();
        } else {
            console.error('API Token is missing. Unable to get bookmarks from Pinboard.')
        }
    });
}

function testUserEnteredApiToken(apiToken) {
    var client = new XMLHttpRequest();
    client.open("GET", 'https://api.pinboard.in/v1/user/api_token?format=json&auth_token=' + apiToken);
    client.onload = function(e) {
        setApiTokenValidityIcon(client.status == 200);
        if (client.status == 200) {
            chrome.storage.local.set({'api_token': apiToken});
            var tagContainer = document.getElementById('tagContainer');
            if (!tagContainer.hasChildNodes())
                getAllTags();
        }
    };
    client.send();
}

function logApiResult(client, apiMethod) {
    if (client.status != 200)
        console.error('Call to ' + apiMethod + ' failed with response: ' + client.status + ' ' + client.statusText);
}


/*********************************************
 Run the script
*********************************************/

window.addEventListener('load', function load(event) {
    loadApiTokenFromStorageAndVerify();
    registerCheckApiTokenButton();
    registerGenerateBookmarksButton();
    loadTagTreeFromSyncStorage();
    getAllTags();
});

function loadApiTokenFromStorageAndVerify() {
    chrome.storage.local.get('api_token', function(result) {
        var apiToken = document.getElementById('apiToken');
        if (result != undefined) {
            apiToken.value = result.api_token;
            testUserEnteredApiToken(result.api_token);
        } else {
            setApiTokenValidityIcon(false);
        }
    });
}

function registerCheckApiTokenButton() {
    var verifyApiToken = document.getElementById('verifyApiToken');
    verifyApiToken.addEventListener('click', function() {
        var apiToken = document.getElementById('apiToken');
        testUserEnteredApiToken(apiToken.value);
    });
}

function registerGenerateBookmarksButton() {
    var generateBookmarks = document.getElementById('generateBookmarks');
    generateBookmarks.addEventListener('click', function() {
        chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')}, function() {
            getAllPostsAndGenerateBookmarks();
        });
    });
}

function loadTagTreeFromSyncStorage() {
    chrome.storage.sync.get('selected_tags', function(result) {
        if (result != undefined && result.selected_tags != undefined) {
            data = result.selected_tags;
        } else {
            data = [ { "id" : ROOT_NODE_ID, "text" : "Pinboard", "icon" : "images/root.gif" } ];
        }

        $('#tagTree').jstree({
            'core' : {
                'animation' : 100,
                'themes' : { 'stripes' : false },
                'multiple' : false,
                'check_callback' : true,
                'data' : data,
            },
            'types' : {
                '#' : {
                    'max_children' : 1,
                    'valid_children' : ['root']
                },
                'root' : {
                    'icon' : '../../images/tree_icon.png',
                    'valid_children' : ['default']
                },
                'default' : {
                    'valid_children' : ['default', 'file']
                },
                'file' : {
                    'icon' : '../../images/bookmark_icon.png',
                    'valid_children' : []
                }
            },
            'plugins' : [
                'contextmenu', 'dnd', 'sort',
                'state', 'types', 'wholerow'
            ]
        });
    });
}

function setApiTokenValidityIcon(isValid) {
    var ind = document.getElementById('apiTokenStatusIndicator');
    if (isValid) {
        ind.src = 'images/check.png';
        ind.title = 'Valid Auth Token';
    } else {
        ind.src = 'images/wrong.png';
        ind.title = 'Invalid Auth Token';
    }
}
