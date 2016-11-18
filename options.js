var googBookmarks = [
    new node('Calendar', 'http://calendar.google.com'),
    new node('Email', 'https://www.gmail.com'),
    new node('Search', 'http://www.google.com')
];
var techBookmarks = [
    new node('Microsoft', 'http://www.microsoft.com'),
    new node('Google', null, googBookmarks),
    new node('Mozilla', 'http://developer.mozilla.org')
];
var topLevel = [
    new node('Tech', null, techBookmarks),
    new node('Trello', 'https://www.trello.com'),
    new node('Hmm', 'http://www.grantwinney.com')
];

var addAllToSubFolder = true;

/*********************************************
 Create new bookmarks in the Bookmarks Bar
*********************************************/

function populateBookmarks(node) {
    chrome.bookmarks.getChildren("0", function(children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].title == 'Bookmarks Bar') {
                if (addAllToSubFolder) {
                    createPageOrFolder(node, children[i].id);
                }
                else {
                    traverseNodes(node, children[i].id);
                }
                break;
            }
        }
    });
}

function traverseNodes(parentNode, parentId) {
    for (var i = 0; i < parentNode.nodes.length; i++) {
        createPageOrFolder(parentNode.nodes[i], parentId);
    }
}

function createPageOrFolder(node, parentId) {
    chrome.bookmarks.create({'parentId': parentId,
                             'title': node.title,
                             'url': node.url},
                            function(newPageOrFolder) {
                                writePageCreationMessage(newPageOrFolder, parentId);
                                if (node.isFolder) {
                                    traverseNodes(node, newPageOrFolder.id)
                                }
                            });
}

function node(title, url, nodes=[]) {
    this.id = "-1";
    this.title = title;
    this.url = url;
    this.isFolder = (url == null);
    this.nodes = nodes;
}

function writePageCreationMessage(node, parentId) {
    console.info("Added page or folder '" + node.title + "' (" + node.id + ") to parent folder id " + parentId + ".");
}

/*********************************************
 API calls to Pinboard
*********************************************/

function getUserApiToken() {
    var client = openApiRequest('/user/api_token');
    client.onload = function(e) {
        writeApiRequestResult(client, '/user/api_token');
    };
    client.send();
}

function getAllTags() {
    var client = openApiRequest('/tags/get');
    client.onload = function(e) {
        // var img = document.createElement('img');
        // img.src = window.URL.createObjectURL(this.response);
        // document.body.appendChild(img);
        writeApiRequestResult(client, '/user/api_token');
    };
    client.send();
}

function openApiRequest(api_method) {
    var client = new XMLHttpRequest();
    client.open("GET", 'https://api.pinboard.in/v1' + api_method + '?format=json&auth_token=grant:???');
    return client;
}

function writeApiRequestResult(client, api_method) {
    if (client.status == 200)
        console.info("The request succeeded!\n\nThe response representation was:\n\n" + client.responseText);
    else
        console.error('Call to ' + api_method + ' failed with response: ' + client.status + ' ' + client.statusText);
}

/*********************************************
 Storage accessors
*********************************************/

function storeValue(key, value) {
    chrome.storage.sync.set({key: value}, function() {
        console.info("Stored key '" + key + "' with value '" + value + "'");
    });
}

function getValue(key) {
    chrome.storage.sync.get(key, function() {
        // do something?
    });
}

function clearStorage() {
    chrome.storage.sync.clear();
}
