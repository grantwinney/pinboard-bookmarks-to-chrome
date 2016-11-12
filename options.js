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

populateBookmarks(new node('Ignore', null, topLevel));


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
                                writeLogMessage(newPageOrFolder, parentId);
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

function writeLogMessage(node, parentId) {
    console.log("Added page or folder '" + node.title + "' (" + node.id +
                ") to parent folder id " + parentId + ".");
}
