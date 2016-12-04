function jstree_node_create(nodeName = '') {
	var tagTree = $('#tagTree').jstree();
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
	    newNodeId = tagTree.create_node(firstNodeId, {"id" : "", "text" : "New Folder", "opened" : true});
        tagTree.edit(newNodeId);
    }
    else {
        tagTree.create_node(firstNodeId, {"id" : "", "type" : "file", "text" : nodeName});
    }
};

// function jstree_node_rename() {
// 	var tagTree = $('#tagTree').jstree();
//     var selectedNodeIds = tagTree.get_selected();
// 	if (!selectedNodeIds.length) {
//         return false;
//     }
//
// 	var firstNodeId = selectedNodeIds[0];
//     var firstNode = tagTree.get_node(firstNodeId);
//     if (firstNode.type == 'file') {
//         return false;
//     }
//
// 	tagTree.edit(firstNodeId);
// };

// function jstree_node_delete() {
// 	var tagTree = $('#tagTree').jstree();
//     var selectedNodeIds = tagTree.get_selected();
// 	if (!selectedNodeIds.length) {
//         return false;
//     }
//
// 	var firstNodeId = selectedNodeIds[0];
//     if (firstNodeId == ROOT_NODE_ID) {
//         return false;
//     }
//
//     var firstNode = tagTree.get_node(firstNodeId);
//     if (firstNode.type == 'default' && firstNode.children.length > 0) {
//         if (!(confirm('Are you sure you want to delete this folder and all subfolders and bookmarks within it?'))) {
//             return false;
//         }
//     }
//
// 	tagTree.delete_node(firstNodeId);
// };
