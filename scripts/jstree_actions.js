ROOT_NODE_ID = 'node_0';

function jstree_node_create(nodeName = '') {
	var tagTree = $('#tagTree').jstree(true);
    var selectedNodeIds = tagTree.get_selected();
    var firstNodeId = selectedNodeIds.length ? selectedNodeIds[0] : ROOT_NODE_ID;

    var firstNode = tagTree.get_node(firstNodeId);
    if (firstNode.type == 'default') {
        firstNode.state.opened = true;
    }
    else {
        firstNodeId = tagTree.get_node(firstNode).parent;
    }

    if (nodeName == '') {
	    newNodeId = tagTree.create_node(firstNodeId, {"text" : "New Folder", "opened" : true});
        tagTree.edit(newNodeId);
    }
    else {
        tagTree.create_node(firstNodeId, {"type" : "file", "text" : nodeName});
    }
};

function jstree_node_rename() {
	var tagTree = $('#tagTree').jstree(true);
    var selectedNodeIds = tagTree.get_selected();
	if (!selectedNodeIds.length) {
        return false;
    }

	var firstNodeId = selectedNodeIds[0];
    var firstNode = tagTree.get_node(firstNodeId);
    if (firstNode.type == 'file') {
        return false;
    }

	tagTree.edit(firstNodeId);
};

function jstree_node_delete() {
	var tagTree = $('#tagTree').jstree(true);
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

// $(function () {
// 	var to = false;
// 	$('#demo_q').keyup(function () {
// 		if(to) { clearTimeout(to); }
// 		to = setTimeout(function () {
// 			var v = $('#demo_q').val();
// 			$('#jstree_demo').jstree(true).search(v);
// 		}, 250);
// 	});
//
// 	$('#jstree_demo')
// 		.jstree({
// 			"core" : {
// 				"animation" : 0,
// 				"check_callback" : true,
// 				'force_text' : true,
// 				"themes" : { "stripes" : true },
// 				'data' : {
// 					'url' : function (node) {
// 						return node.id === '#' ? '/static/3.3.3/assets/ajax_demo_roots.json' : '/static/3.3.3/assets/ajax_demo_children.json';
// 					},
// 					'data' : function (node) {
// 						return { 'id' : node.id };
// 					}
// 				}
// 			},
// 			"types" : {
// 				"#" : { "max_children" : 1, "max_depth" : 4, "valid_children" : ["root"] },
// 				"root" : { "icon" : "/static/3.3.3/assets/images/tree_icon.png", "valid_children" : ["default"] },
// 				"default" : { "valid_children" : ["default","file"] },
// 				"file" : { "icon" : "glyphicon glyphicon-file", "valid_children" : [] }
// 			},
// 			"plugins" : [ "contextmenu", "dnd", "search", "state", "types", "wholerow" ]
// 		});
// });
