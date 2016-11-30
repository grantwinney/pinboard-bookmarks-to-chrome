class TokenValidator {
    static loadApiTokenFromStorageAndVerify() {
        chrome.storage.local.get('api_token', function(result) {
            var apiToken = document.getElementById('apiToken');
            if (result != undefined && result.api_token != undefined) {
                apiToken.value = result.api_token;
                TokenValidator.verifyApiTokenAndLoadTags(result.api_token);
            } else {
                setApiTokenValidityIcon(false);
            }
        });
    }

    static verifyApiTokenAndLoadTags(apiToken) {
        var client = new XMLHttpRequest();
        client.open("GET", 'https://api.pinboard.in/v1/user/api_token?format=json&auth_token=' + apiToken);
        client.onload = function(e) {
            TokenValidator.setApiTokenValidityIcon(client.status == 200);
            if (client.status == 200) {
                chrome.storage.local.set({'api_token': apiToken});
                var tagContainer = document.getElementById('tagContainer');
                if (!tagContainer.hasChildNodes()) {
                    TagHelper.retrieveAndDisplayAllTags();
                }
            } else {
                console.error('Call to /user/api_token failed with response: ' + client.status + ' ' + client.statusText);
            }
        };
        client.send();
    }

    static setApiTokenValidityIcon(isTokenValid) {
        var ind = document.getElementById('apiTokenStatusIndicator');
        if (isTokenValid) {
            ind.src = 'images/check.png';
            ind.title = 'Valid Auth Token';
        } else {
            ind.src = 'images/wrong.png';
            ind.title = 'Invalid Auth Token';
        }
    }
}
