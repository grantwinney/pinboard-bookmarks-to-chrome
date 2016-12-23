// right now, always set to true, might add as option later
ADD_ALL_TO_SUBFOLDER = true;
ALL_POSTS_REQUEST_LIMIT_IN_SEC = 300;
ROOT_NODE_ID = 'node_0';

function disableInputElements(message) {
    ['#tagTree','#apiToken','#verifyApiToken','#generateBookmarks','#tagContainer'].forEach(function(element) {
        $(element).addClass('disabledElement');
    });
    $("#innerNotice").text(message + '...');
}

function enableInputElements() {
    ['#tagTree','#apiToken','#verifyApiToken','#generateBookmarks','#tagContainer'].forEach(function(element) {
        $(element).removeClass("disabledElement");
    });
    $("#innerNotice").text('');
}


/***********************************
 LOADING AND MANIPULATING TAG DATA
************************************/

function retrieveAndDisplayAllTags() {
    chrome.storage.local.get('api_token', function(result) {
        if (result != undefined && result.api_token != undefined && $.trim(result.api_token) != '') {
            var client = new XMLHttpRequest();
            client.open("GET", 'https://api.pinboard.in/v1/tags/get?format=json&auth_token=' + result.api_token);
            client.onload = function(e) {
                if (client.status == 200) {
                    disableInputElements("Loading Tags from Pinboard");
                    $("#tagContainer").empty();
                    JSON.parse(client.responseText, (tagName, tagCount) =>
                    {
                        if (tagName != '') {
                            var element = document.createElement('button');
                            element.textContent = tagName;
                            element.addEventListener('click', function() {
                                jstree_node_create(tagName);
                            });
                            element.classList.add("tag");
                            $("#tagContainer").append(element);
                        }
                    });
                    enableInputElements();
                } else {
                    logInvalidResponse('/tags/get', client);
                }
            };
            client.send();
        } else {
            enableInputElements();
        }
    });
}

function loadSelectedTagsFromStorage() {
    chrome.storage.sync.get('selected_tags', function(result) {
        if (result != undefined && result.selected_tags != undefined) {
            generateTagTree(result.selected_tags);
        } else {
            generateTagTree([{"id":ROOT_NODE_ID, "text":"Pinboard", "icon":"images/root.gif"}]);
        }
        enableInputElements();
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

function generateTagTree(data) {
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
        ],
        'sort' : function (a, b) {
    		return this.get_type(a) === this.get_type(b)
                ? (this.get_text(a).toLowerCase() > this.get_text(b).toLowerCase() ? 1 : -1)
                : (this.get_type(a) >= this.get_type(b) ? 1 : -1)
        },
        'contextmenu' : {
            'items' : function (node, callback) {
    			return {
    				"create_folder" : {
    					"separator_before"	: false,
    					"separator_after"	: false,
    					"_disabled"			: node.type == 'file',
    					"label"				: "Add Folder",
    					"action"			: function (data) {
    						var inst = $.jstree.reference(data.reference);
    					    var curr_node = inst.get_node(data.reference);
    						inst.create_node(curr_node, { "text" : "New Folder" }, "last", function (new_node) {
    							setTimeout(function () { inst.edit(new_node); },0);
    						});
    					}
    				},
    				"rename_folder" : {
    					"separator_before"	: false,
    					"separator_after"	: false,
    					"_disabled"			: node.type == 'file',
    					"label"				: "Rename Folder",
    					"action"			: function (data) {
    						var inst = $.jstree.reference(data.reference);
    						var obj = inst.get_node(data.reference);
    						inst.edit(obj);
    					}
    				},
    				"remove_folder" : {
    					"separator_before"	: false,
    					"separator_after"	: false,
    					"_disabled"			: node.type != 'default',
    					"label"				: "Delete Folder",
    					"action"			: function (data) {
    						var inst = $.jstree.reference(data.reference);
    					    var obj = inst.get_node(data.reference);
                            // if (obj.type == 'default' && obj.children.length > 0) {
                            //     if (!(confirm('Are you sure you want to delete this folder and all subfolders and bookmarks within it?'))) {
                            //         return true;
                            //     }
                            // }
    						if(inst.is_selected(obj)) {
    							inst.delete_node(inst.get_selected());
    						}
    						else {
    							inst.delete_node(obj);
    						}
    					}
    				},
    				"create_tag" : {
    					"separator_before"	: true,
    					"separator_after"	: false,
    					"_disabled"			: node.type == 'file',
    					"label"				: "Add Tag",
    					"action"			: function (data) {
                            jstree_node_create();
    					}
    				},
    				"rename_tag" : {
    					"separator_before"	: false,
    					"separator_after"	: false,
    					"_disabled"			: node.type != 'file',
    					"label"				: "Rename Tag",
    					"action"			: function (data) {
    						jstree_node_rename();
    					}
    				},
    				"remove_tag" : {
    					"separator_before"	: false,
    					"separator_after"	: false,
    					"_disabled"			: node.type != 'file',
    					"label"				: "Delete Tag",
    					"action"			: function (data) {
    						jstree_node_delete();
    					}
    				},
    				"ccp" : {
    					"separator_before"	: true,
    					"icon"				: false,
    					"separator_after"	: false,
    					"label"				: "Edit",
    					"_disabled"			: node.id == 'node_0',
    					"action"			: false,
    					"submenu" : {
    						"cut" : {
    							"separator_before"	: false,
    							"separator_after"	: false,
    							"label"				: "Cut",
    							"action"			: function (data) {
    								var inst = $.jstree.reference(data.reference);
    								var obj = inst.get_node(data.reference);
    								if(inst.is_selected(obj)) {
    									inst.cut(inst.get_top_selected());
    								}
    								else {
    									inst.cut(obj);
    								}
    							}
    						},
    						"copy" : {
    							"separator_before"	: false,
    							"icon"				: false,
    							"separator_after"	: false,
    							"label"				: "Copy",
    							"action"			: function (data) {
    								var inst = $.jstree.reference(data.reference);
    								var obj = inst.get_node(data.reference);
    								if(inst.is_selected(obj)) {
    									inst.copy(inst.get_top_selected());
    								}
    								else {
    									inst.copy(obj);
    								}
    							}
    						},
    						"paste" : {
    							"separator_before"	: false,
    							"icon"				: false,
    							"_disabled"			: function (data) {
    								return !$.jstree.reference(data.reference).can_paste();
    							},
    							"separator_after"	: false,
    							"label"				: "Paste",
    							"action"			: function (data) {
    								var inst = $.jstree.reference(data.reference),
    									obj = inst.get_node(data.reference);
    								inst.paste(obj);
    							}
    						}
    					}
    				}
    			};
    		}
        }
    });
}

/***********************
 JSTREE NODE FUNCTIONS
************************/

function jstree_node_create(nodeName = null) {
	var tagTree = $('#tagTree').jstree();
    var selectedNodeIds = tagTree.get_selected();
    var firstNodeId = selectedNodeIds.length ? selectedNodeIds[0] : ROOT_NODE_ID;

    var firstNode = tagTree.get_node(firstNodeId);
    if (firstNode.type == 'default') {
        firstNode.state.opened = true;
    } else {
        firstNodeId = tagTree.get_node(firstNode).parent;
    }

    if ($('#create_folder_for_tag').is(':checked')) {
        firstNodeId = tagTree.create_node(firstNodeId,
            {"id" : "", "type" : "default", "text" : (nodeName == null ? "New Folder" : nodeName), "opened" : true});
    }

    if (nodeName == null) {
        newNodeId = tagTree.create_node(firstNodeId, {"id" : "", "type" : "file", "text" : "New Tag", "opened" : true});
        tagTree.edit(newNodeId);
    } else {
        tagTree.create_node(firstNodeId, {"id" : "", "type" : "file", "text" : nodeName});
    }
};

function createPageOrFolder(parentNodeId, tagNode, urls, shouldCreateParentFolder) {
    tagNode.forEach(function(tag) {
        if (tag['type'] == 'default') {
            chrome.bookmarks.create({'parentId': parentNodeId,
                                     'title': tag['text']},
                                    function(newFolder) {
                                        createPageOrFolder(newFolder.id, tag['children'], urls, shouldCreateParentFolder);
                                    });
        } else {
            urls.forEach(function(url) {
                if (url['tags'].indexOf(tag['text']) != -1) {
                    if (shouldCreateParentFolder) {
                        chrome.bookmarks.create({'parentId': parentNodeId,
                                                 'title': url['description']},
                                                 function(newFolder) {
                                                     chrome.bookmarks.create({'parentId': newFolder.id,
                                                                              'title': url['description']});
                                                });
                    } else {
                        chrome.bookmarks.create({'parentId': parentNodeId,
                                                 'title': url['description'],
                                                 'url': url['href']});
                    }
                }
            })
        }
    })
    enableInputElements();
}

function jstree_node_rename() {
	var tagTree = $('#tagTree').jstree();
    var selectedNodeIds = tagTree.get_selected();
	if (!selectedNodeIds.length) {
        return false;
    }

	tagTree.edit(selectedNodeIds[0]);
};

function jstree_node_delete() {
	var tagTree = $('#tagTree').jstree();
    var selectedNodeIds = tagTree.get_selected();
	if (!selectedNodeIds.length) {
        return false;
    }

	var firstNodeId = selectedNodeIds[0];
    if (firstNodeId == ROOT_NODE_ID) {
        return false;
    }

    var firstNode = tagTree.get_node(firstNodeId);
    if (firstNode.type == 'default' && firstNode.children.length > 0) {
        if (!(confirm('Are you sure you want to delete this folder and all subfolders and bookmarks within it?'))) {
            return false;
        }
    }

	tagTree.delete_node(firstNodeId);
};


/****************************************
 GET/SET AND VERIFICATION FOR API TOKEN
*****************************************/

function loadApiTokenFromStorageAndVerify() {
    chrome.storage.local.get('api_token', function(result) {
        if (result != undefined && result.api_token != undefined) {
            $("#apiToken").val(result.api_token);
            verifyApiTokenAndLoadTags(result.api_token);
        } else {
            setApiTokenValidityIcon(false);
            enableInputElements();
        }
    });
}

function verifyApiTokenAndLoadTags(apiToken) {
    var client = new XMLHttpRequest();
    client.open("GET", 'https://api.pinboard.in/v1/user/api_token?format=json&auth_token=' + apiToken);
    client.onload = function(e) {
        setApiTokenValidityIcon(client.status == 200);
        if (client.status == 200) {
            chrome.storage.local.set({'api_token': apiToken});
            retrieveAndDisplayAllTags();
        } else {
            logInvalidResponse('/user/api_token', client, false);
        }
    };
    if ($.trim($("#apiToken").val()) != '') {
        disableInputElements("Verifying API Token");
        client.send();
    }
}

function setApiTokenValidityIcon(isTokenValid) {
    var ind = document.getElementById('apiTokenStatusIndicator');
    if (isTokenValid) {
        ind.src = 'images/check.png';
        ind.title = 'Valid Auth Token';
    } else {
        ind.src = 'images/wrong.png';
        ind.title = 'Invalid Auth Token';
    }
}

/****************************
 ERROR HANDLING AND LOGGING
*****************************/

function logInvalidResponse(action, client, showPopup = true) {
    var errorMessage = 'Call to ' + action + ' failed with response: ' + client.status + ' ' + client.statusText;
    console.error(errorMessage);
    if (showPopup)
        alert(errorMessage);
    enableInputElements();
}

function logError(message, showPopup = false) {
    var errorMessage = 'An error has occurred: ' + message;
    console.error(errorMessage);
    if (showPopup)
        alert(errorMessage);
    enableInputElements();
}

window.onerror = function(messageOrEvent, sourceUrl, lineNo, columnNo, error) {
    var errorMessage = 'An error occurred on "' + sourceUrl + '[' + lineNo + ':' + columnNo + ']": ' + messageOrEvent;
    console.error(errorMessage);
    console.error('Stack trace: ' + error.stack);
    alert(errorMessage);
    enableInputElements();
    return false;
}

// window.addEventListener('error', function load(event) {
//     var errorMessage = 'An error has occurred: ' + event.error.toString();
//     console.error(errorMessage);
//     console.error('Stack trace: ' + event.error.stack);
//     alert(errorMessage)
//     enableInputElements();
// });


/***************************************************************
 GET BOOKMARK DATA FROM PINBOARD AND LOCAL BOOKMARK GENERATION
****************************************************************/

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
                    logInvalidResponse('/posts/all', client);
                }
            };
            client.send();
        } else {
            var message = 'API Token is missing.\n\nUnable to get bookmarks from Pinboard.';
            alert(message);
            logError(message);
        }
    });
}

function generateBookmarks(allUrls) {
    chrome.bookmarks.getChildren("0", function(children) {
        var isBarFound = false;
        for (var i = 0; i < children.length; i++) {
            if (children[i].title == 'Bookmarks Bar') {
                isBarFound = true;
                var relevantUrls = filterBookmarksToSelectedTags(allUrls);
                var selectedTags = getSelectedTagDataJson();
                // if (ADD_ALL_TO_SUBFOLDER) {
                    createPageOrFolder(children[i].id, selectedTags, relevantUrls);
                // } else {
                //     // call createPageOrFolder() in such a way that the main Pinboard folder is not created,
                //     // and everything else appears directly in the Bookmarks Bar instead of the Pinboard folder.
                // }
                break;
            }
        }
        if (isBarFound == false) {
            logError('Cannot add bookmarks. Unable to find the \'Bookmarks Bar\'.')
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
    enableInputElements();
}


/*********************
 EVENT SUBSCRIPTIONS
**********************/

function subscribeEvents() {
    $("#verifyApiToken").on("click", function() {
        verifyApiTokenAndLoadTags($("#apiToken").val());
    });

    $("#generateBookmarks").on('click', function() {
        disableInputElements("Generating Bookmarks... this may take a minute");
        chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')}, function() {
            getAllPostsAndGenerateBookmarks();
        });
    });

    $("#debug").on('click', function() {
        if (confirm('Delete all stored data for this extension?')) {
            chrome.storage.local.clear();
            chrome.storage.sync.clear();
            window.location.reload();
        }
    });

    $("#saveTags").on('click', function() {
        chrome.storage.sync.set({'selected_tags': $('#tagTree').jstree(true).get_json('#')});
    });

    $("#help").on('click', function() {
        $("#settingsBox").hide('size', { origin: ["top", "right"] }, 300);
        $("#helpBox").toggle('size', { origin: ["top", "right"] }, 500);
    });

    $("#settings").on('click', function() {
        $("#helpBox").hide('size', { origin: ["top", "right"] }, 300);
        $("#settingsBox").toggle('size', { origin: ["top", "right"] }, 500);
    });

    $("#create_folder_for_tag").on('click', function() {
        chrome.storage.sync.set({'create_folder_for_tag': $('#create_folder_for_tag').is(':checked')});
    });
}

window.addEventListener('load', function load(event) {
    disableInputElements("Initializing");
    loadSelectedTagsFromStorage();
    loadApiTokenFromStorageAndVerify();
    subscribeEvents();

    chrome.storage.sync.get('create_folder_for_tag', function(result) {
        $('#create_folder_for_tag').attr('checked',
            result != undefined && result.create_folder_for_tag != undefined && result.create_folder_for_tag);
    });
});
