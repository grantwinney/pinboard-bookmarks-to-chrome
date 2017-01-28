# Import Pinboard Bookmarks to Chrome
<img src="https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/pb-to-chr-128.png" align="right">
Using a bookmarking service like [Pinboard](https://pinboard.in) is convenient. You always have what you need on-the-go, and you're not tied to a single browser. But for day-to-day use it's tedious to open the bookmark site and search for a URL, especially the most frequent ones over and over.

I wrote this extension because I wanted a way to generate bookmarks in [Chrome](https://www.google.com/chrome/browser/desktop/) using Pinboard's "tags". You specify the tags (or combinations of tags) for which you want to generate bookmarks, and they'll be added to the Bookmarks Bar.

## What This is _Not_
This is not a two-way 'sync'. Bookmarks that you create from within Chrome will not be pushed to Pinboard. It's only for retrieving bookmarks _from_ Pinboard (via tags) into the Chrome browser's "Bookmarks Bar".

# Getting the Extension
Preferably, [get it from the Chrome store](https://chrome.google.com/webstore/detail/import-pinboard-bookmarks/ehmckciofpffmihhfjbblcebgmepcjdm).

Alternatively, clone this repo and then load it in developer mode by [following these instructions](https://developer.chrome.com/extensions/getstarted#unpacked). Useful for playing around.

This extension is only guaranteed to work in the latest version of Chrome. Since I'm always on the latest, that's all I'm testing for... I don't have time to ensure it's backwards-compatible with previous versions.

# Using It
When you open the extension for the first time you'll need to supply your [Pinboard API Token](https://pinboard.in/settings/password), which is [how third-party apps securely communicate with the Pinboard service](https://blog.pinboard.in/2012/07/api_authentication_tokens/) on your behalf.

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/pinboard_api_token_2.png)

Until you supply a valid token, you'll see a red X and it'll complain that your "API token is missing. Unable to get bookmarks from Pinboard."

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/enter_your_api_token_empty.png)

[Find your API Token](https://pinboard.in/settings/password) and copy it into the box. Press the "refresh" button to validate it. If it's correct, you'll see a green checkmark and then your available tags should load automatically.

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/enter_your_api_token_valid_2.png)

## Selecting Tags
Select the tags you want to generate bookmarks for. When you click a tag on the right, you'll see it appear in the treeview list on the left. Drag items around in the treeview to reorder them. Right-click on the treeview to create folders and perform other actions. _(Some actions won't always be available, like renaming a folder when you've right-clicked on a tag.)_

Also read about the "Desired AND operator" and "Desired OR operator" options directly below this.

## Options
Click on the gear icon in the upper-right corner to view the available options.

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/settings_menu.png)

* Automatically create a parent folder for each tag?<br>_Each tag you add to the treeview is automatically placed inside a new folder of the same name._

* Add all bookmarks directly to the Bookmarks Bar?<br>_When generating bookmarks, add them directly to the Bookmarks Bar instead of into a single folder that shares the name of the root node of the treeview._

* Prompt for confirmation before deleting folder?<br>_Folder could contain any number of other folders and bookmarks. You can choose to be prompted for confirmation before deleting folders in the treeview._

* Remove previous folders and bookmarks before (re)generating?<br>_Chrome will happily add multiple folders and bookmarks with the same name. Select this to delete previously-added folders and bookmarks before (re)adding new ones._

* Ignore tag delimiters?<br>_Ignore the following two options, and treat all tags as single tags only._

* Desired AND operator<br>_If you want to only pull in bookmarks that have a combination of tags, use the operator you specify here to delimit the tags. In other words, if you specify **;** to be the delimiter, and you add a tag to the treeview that's named "company;web", then that will only generate bookmarks that had_ both _the company and web tags applied to them._

* Desired OR operator<br>_Specify a parameter that can be used to pull in multiple tags. For instance, if you specify **|** to be the delimiter, and you add a tag to the treeview that's name "company|web", then that will generate bookmarks that have_ either _the company or web tag applied to them._

* Delete Tags Only<br>_Deletes the local storage for your selected tags, leaving other settings and your API Token alone._

* Delete All Cache<br>_Deletes the local storage for this extension, wiping out any selected tags in the treeview on the left, as well as settings and your API Token. I found this useful during testing, but maybe someone else will find it useful too._

## Generating Bookmarks
Once you've got the tags in the treeview the way you'd like, click the "Generate Bookmarks" button. It'll lookup bookmarks matching your selected tags and add them to your Bookmarks Bar.

Depending on the option you select, it'll either create a master folder and place all the generated bookmarks in it...

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/sync_bookmark_single_folder_b.png)

... or it'll add them directly to the Bookmarks Bar.

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/sync_bookmark_direct_to_bookmark_bar_b.png)

From there, Chrome can take over sync'ing bookmarks between multiple machines if you're into that.

# Need Help?
If you have questions or a problem with using the extension, I'd prefer that you [create an issue](https://github.com/grantwinney/pinboard-bookmarks-to-chrome/issues/new).

Include as many details as possible about what you were doing, what errors you got (if any), what you expected to happen and what actually did happen.

In some cases, I had the extension pop up a message. Most of the time though, errors and other informational messages are simply logged to the console panel. That information could be very helpful in tracking down the source of a problem you're having. To see the console, press Ctrl+Shift+J (Windows / Linux) or Cmd+Opt+J (Mac). [Read this for more info on the console panel](https://developers.google.com/web/tools/chrome-devtools/console/#open_as_panel).

# Other Considerations
I used Chrome's built-in "local" storage for storing selected tags and other settings. It's a 5MB bucket so it'll store plenty unless someone makes a truly massive tree of selected tags. I considered using Chrome's "sync" storage but there were too many restrictions and limitations, and it became more of a pain point than anything else. So your selections won't sync between machines.

Pinboard places a couple restrictions on its API usage, one of which is that requests to get _all_ URLs can only be made once every 5 minutes. I did my best to honor this, so that the first click on "Generate Bookmarks" caches your URLs for 5 minutes. They're just stored in a variable though, so if you refresh (or close and reopen) the page and hit "Generate Bookmarks" again, it's going to hit Pinboard and pull down all the URLs again, regardless of whether the 5 minutes is up. Best I could do for now.

## Requested Permissions
This extension requests the following permissions:
* **bookmarks** - Needed to add to (and remove from) the Bookmarks Bar
* **storage** - Needed to store the API Token, selected tags and other settings locally between sessions
* **https://api.pinboard.in** - Needed in order to access the Pinboard API, including your tags and bookmarks

# Resources
Here's some stuff that helped me... maybe it'll help you too.

## Reference Material
If you want to create your own Chrome extension, start with the [Chrome developer tutorials](https://developer.chrome.com/extensions). They explain the purpose of the manifest.json file, the various API endpoints and limitations, etc.

I also found the [Mozilla Developer Network (MDN) JavaScript docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) to be a great resource.

Don't be afraid to [reach out using social media](https://twitter.com/GrantWinney/status/798240234853068801). Someone may have just the info you're looking for.

## Libraries
I used several libraries for various tasks in the extension. Here are the links if you want to check them out.

* [He](https://github.com/mathiasbynens/he): _A robust HTML entity encoder/decoder written in JavaScript._

* [jQuery](http://jquery.com/): _A fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers._

* [jQuery UI](https://jqueryui.com/): _A a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library._

* [jsTree](https://www.jstree.com/): _A jQuery plugin, that provides interactive trees._

# Contact Me

Feel free to [hit me up on Twitter](https://twitter.com/GrantWinney).

Sometimes [I write about things](https://grantwinney.com/).

