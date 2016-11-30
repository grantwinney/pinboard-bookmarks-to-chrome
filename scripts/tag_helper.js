class TagHelper {
    static retrieveAndDisplayAllTags() {
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
                                    JsTreeHelper.jstree_node_create(tagName);
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

    static loadSelectedTagsFromStorage() {
        chrome.storage.sync.get('selected_tags', function(result) {
            if (result != undefined && result.selected_tags != undefined) {
                var data = result.selected_tags;
            } else {
                alert(ROOT_NODE_ID);
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
}
