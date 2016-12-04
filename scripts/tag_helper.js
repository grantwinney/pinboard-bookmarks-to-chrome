function retrieveAndDisplayAllTags() {
    chrome.storage.local.get('api_token', function(result) {
        if (result != undefined) {
            var client = new XMLHttpRequest();
            client.open("GET", 'https://api.pinboard.in/v1/tags/get?format=json&auth_token=' + result.api_token);
            client.onload = function(e) {
                if (client.status == 200) {
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
                } else {
                    console.error('Call to /tags/get failed with response: ' + client.status + ' ' + client.statusText);
                }
            };
            client.send();
        }
    });
}

function loadSelectedTagsFromStorage() {
    chrome.storage.sync.get('selected_tags', function(result) {
        if (result != undefined && result.selected_tags != undefined) {
            var data = result.selected_tags;
        } else {
            var data = [ { "id" : ROOT_NODE_ID, "text" : "Pinboard", "icon" : "images/root.gif" } ];
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

function getSelectedTagDataJson() {
    return $('#tagTree').jstree(true).get_json('#');
}

function getDistinctTagNames() {
    var names = getAllNamesFromTagTree(getSelectedTagDataJson());
    return names.filter((v, i, a) => a.indexOf(v) === i);
}

function getAllNamesFromTagTree(treeNode) {
    var childNodeText = [];
    for (var i = 0; i < treeNode.length; i++) {
        if (treeNode[i]['type'] == 'default') {
            childNodeText = childNodeText.concat(getAllNamesFromTagTree(treeNode[i]["children"]));
        } else {
            childNodeText.push(treeNode[i]["text"]);
        }
    }
    return childNodeText;
}
