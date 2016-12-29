# Import Pinboard Bookmarks to Chrome
Using a bookmarking service like [Pinboard](https://pinboard.in) is convenient. You always have what you need on-the-go, and you're not tied to a single browser. But for day-to-day use, it's tedious to open the Pinboard site and search for a URL - potentially the same one over and over again if you need it frequently.

I wrote this extension because I wanted a way to generate bookmarks in [Chrome](https://www.google.com/chrome/browser/desktop/) using Pinboard's "tags".

# What This is _Not_
This is not a two-way 'sync'. Bookmarks that you create from within Chrome will not be pushed to Pinboard. It's only for retrieving bookmarks _from_ Pinboard (via 'tag') into the Chrome browser.

# Getting the Extension
Get it from the Chrome store.

You can also clone this repo to your machine and then load it in developer mode by [following these instructions](https://developer.chrome.com/extensions/getstarted#unpacked).

This is only guaranteed to work in the latest version of Chrome. Since I'm always on the latest, that's all I'm testing for... I really don't have time or resources to ensure it's backwards-compatible with version xx.

# Starting Out


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
