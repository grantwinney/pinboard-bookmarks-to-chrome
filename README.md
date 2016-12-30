# Import Pinboard Bookmarks to Chrome
Using a bookmarking service like [Pinboard](https://pinboard.in) is convenient. You always have what you need on-the-go, and you're not tied to a single browser. But for day-to-day use, it's tedious to open the bookmark site and search for a URL - potentially the same one over and over again if you need it frequently.

I wrote this extension because I wanted a way to generate bookmarks in [Chrome](https://www.google.com/chrome/browser/desktop/) using Pinboard's "tags".

## What This is _Not_
This is not a two-way 'sync'. Bookmarks that you create from within Chrome will not be pushed to Pinboard. It's only for retrieving bookmarks _from_ Pinboard (via 'tag') into the Chrome browser.

# Getting the Extension
Get it from the Chrome store.

You can also clone this repo to your machine and then load it in developer mode by [following these instructions](https://developer.chrome.com/extensions/getstarted#unpacked).

This is only guaranteed to work in the latest version of Chrome. Since I'm always on the latest, that's all I'm testing for... I really don't have time or resources to ensure it's backwards-compatible with version xx.

# Using It
When you open the extension for the first time, you'll need to supply your [Pinboard API Token](https://pinboard.in/settings/password).

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/pinboard_api_token.png)

Until you supply a valid token, you'll see a red X and it'll complain that your "API token is missing. Unable to get bookmarks from Pinboard."

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/enter_your_api_token_empty.png)

[Find your API Token](https://pinboard.in/settings/password) and copy it into the box. Press the "refresh" button to validate it. If it's correct, you should see a green checkmark and then all your available tags should be loaded automatically.

![](https://raw.githubusercontent.com/wiki/grantwinney/pinboard-bookmarks-to-chrome/images/enter_your_api_token_valid_2.png)

## Selecting Tags
Select the tags you want to generate bookmarks for. When you click a tag on the right, you'll see it appear in the treeview list on the left. Drag items around in the treeview to reorder them. Right-click on the treeview to create folders and perform other actions. Some actions won't always be available, like renaming a folder when you've right-clicked on a tag.

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

* Delete Cache<br>_Deletes the local storage for this extension, wiping out any selected tags in the treeview on the left, as well as settings and your API Token. I found this useful during testing, but maybe someone else will find it useful too.

# Warnings
Storage... tags and bookmarks, sync and local

I decided to allow a single folder to have multiple tags by using `+` for AND, and `|` for OR. Since Pinboard also allows you to use those symbols in your tag names, that could cause problems. It's what I needed though, and I don't use unusual symbols in my tag names, and I suggest you don't either.

# Resources
There are several resources I used in developing this.

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
