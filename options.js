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



// makeCorsRequest();
  makePinboardApiRequest();
// populateBookmarks(new node('Ignore', null, topLevel));



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


//check_for_existing_bookmark_details();

function check_for_existing_bookmark_details() {
 // if (!url_params['url']) { return; }
  var bookmark_details_api = 'https://api.pinboard.in/v1/user/api_token?format=json&auth_token=grant:';

  $.support.cors = true;
  $.get(bookmark_details_api)
    .done(function(response) {
      $('#mainspinner').addClass('hidden');
      $('#submit').data('stateText', 'Add bookmark');
      if (response['posts'].length !== 1) { return; }

      var bookmark = response['posts'][0];

      $('input#title').val(bookmark['description']);

      if (bookmark['extended']) { // previously-saved bookmark description
        if ($.trim(bookmark['extended']) !== $.trim(url_params['description'])) { // ignore duplication
          $('textarea#description').val($.trim(bookmark['extended']) + '\n\n' + $.trim(url_params['description']));
        }
      }
      leave_a_gap();

      prepopulate_tags(bookmark['tags']);

      if (bookmark['shared'] === 'no') {
        $('#private').prop('checked', true).change();
      }
      if (bookmark['toread'] === 'yes') {
        $('#toread').prop('checked', true);
      }
      if (bookmark['time']) {
        var date = new Date(bookmark['time']);
        showBookmarkTimestamp(date);
      }

      $('#submit').data('stateText', 'Update bookmark');
      $('#submit span.text').text('Update bookmark');
    })

    .fail(function(response) {
      if (response.status === 0 && (response.statusText === 'No Transport' || 'Error: Access is denied.')) {
        display_critical_error('Cross-domain request failed. Your browser is denying this request from being sent.');
        display_reload_button();
      }
      if (response.status === 401) {
        display_critical_error('401 Unauthorised. Please check the username and API access token you provided.');
      }
    });
}

// getUserToken('grant','');
//
//  function getUserToken(username, password) {
//
//       console.log('pinboardservice: getting user token...');
//
//       var deferred = $q.defer();
//       // modify url to include username + password,  user:password. See https://pinboard.in/api/ under authentication
//       var authstringReplaced = this.authstring.replace('user', username).replace('password', password);
//       // request API token for session duration
//       var request = authstringReplaced + 'user/api_token' + this.format;
//
//       // execute standard request
//       self.executeStandardRequest(request, deferred);
//
//       console.log(deferred.promise);
//
//       return deferred.promise;
//     };

function makePinboardApiRequest() {
    // var url = "https://api.pinboard.in/v1/posts/update?auth_token=grant:";
    // var url = "https://api.pinboard.in/v1/user/api_token?auth_token=grant:";
    // var representationOfDesiredState = "The cheese is old and moldy, where is the bathroom?";

    var client = new XMLHttpRequest();

    client.open("GET", "https://api.pinboard.in/v1/user/api_token?format=json&auth_token=grant:");

    //client.setRequestHeader("Content-Type", "text/plain");

    client.onload = function(e) {
    //   var img = document.createElement('img');
    //   img.src = window.URL.createObjectURL(this.response);
    //   document.body.appendChild(img);

        if (client.status == 200)
            console.log("The request succeeded!\n\nThe response representation was:\n\n" + client.responseText)
        else
            console.log("The request did not succeed!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
    };

    // client.send(representationOfDesiredState);
    client.send();

    // if (client.status == 200)
    //     console.log("The request succeeded!\n\nThe response representation was:\n\n" + client.responseText)
    // else
    //     console.log("The request did not succeed!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
}
//
//
//
//
//
// // Create the XHR object.
// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   if ("withCredentials" in xhr) {
//     // XHR for Chrome/Firefox/Opera/Safari.
//     xhr.open(method, url, true);
//   } else if (typeof XDomainRequest != "undefined") {
//     // XDomainRequest for IE.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);
//   } else {
//     // CORS not supported.
//     xhr = null;
//   }
//   return xhr;
// }
//
// // Helper method to parse the title tag from the response.
// function getTitle(text) {
//   return text.match('<title>(.*)?</title>')[1];
// }
//
// // Make the actual CORS request.
// function makeCorsRequest() {
//   // This is a sample server that supports CORS.
//   var url = 'https://api.pinboard.in/v1/user/api_token?format=json&auth_token=grant:';
//
//   var xhr = createCORSRequest('GET', url);
//   if (!xhr) {
//       alert(xhr);
//     alert('CORS not supported');
//     return;
//   }
//
//   // Response handlers.
//   xhr.onload = function() {
//     var text = xhr.responseText;
//     // var title = getTitle(text);
//     alert('Response from CORS request to ' + url + ': ' + text);
//   };
//
//   xhr.onerror = function() {
//     alert('Woops, there was an error making the request.');
//   };
//
//   xhr.send();
// }
//
//
//
// function createRequest() {
//   var result = null;
//   if (window.XMLHttpRequest) {
//     // FireFox, Safari, etc.
//     result = new XMLHttpRequest();
//     if (typeof xmlhttp.overrideMimeType != 'undefined') {
//       result.overrideMimeType('text/xml'); // Or anything else
//     }
//   }
//   else if (window.ActiveXObject) {
//     // MSIE
//     result = new ActiveXObject("Microsoft.XMLHTTP");
//   }
//   else {
//     // No known mechanism -- consider aborting the application
//   }
//   return result;
// }
//
// function whatever() {
//     var req = createRequest(); // defined above
//     // Create the callback:
//     req.onreadystatechange = function() {
//       if (req.readyState != 4) return; // Not there yet
//       if (req.status != 200) {
//         console.log(req.status);
//         return;
//       }
//       // Request successful, read the response
//       var resp = req.responseText;
//         console.log(req);
//       // ... and use it as needed by your app.
//     }
//
//     req.open("GET", "https://api.pinboard.in/v1/user/api_token?auth_token=grant:", true);
//     req.send();
// }

// var login = function(token) {
//     // test auth
//     var path = $.base64.encode("https://api.pinboard.in/v1/user/api_token?format=json&auth_token=grant:"),
//         popup = chrome.extension.getViews({
//             type: 'popup'
//         })[0],
//         jqxhr = $.ajax({
//             url: path,
//             type: 'GET',
//             timeout: 60000,
//             dataType: 'jsonp',
//             crossDomain: true,
//             contentType: 'text/plain'
//         });
//     jqxhr.always(function(data) {
//         console.log('Data: ' + data);
//         // console.log('Data Result: ' + data.result);
//         if (data.result) {
//             // success
//             _userInfo.authToken = token;
//             _userInfo.name = token.split(':')[0];
//             _userInfo.isChecked = true;
//             localStorage[authTokenKey] = token;
//             localStorage[checkedkey] = true;
//             console.log('login-succeed');
//             popup && popup.$rootScope &&
//                 popup.$rootScope.$broadcast('login-succeed');
//             _getTags();
//         } else {
//             // login error
//             console.log('login-failed1');
//             popup && popup.$rootScope &&
//                 popup.$rootScope.$broadcast('login-failed');
//         }
//     });
//     jqxhr.fail(function(data) {
//         if (data.statusText == 'timeout') {
//             console.log('login-failed2');
//             popup && popup.$rootScope &&
//                 popup.$rootScope.$broadcast('login-failed');
//         }
//     });
// };
//
// login('CF100DA71C020A2BC0DF');
