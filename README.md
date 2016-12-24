# Import Pinboard Bookmarks to Chrome
An extension to import bookmarks from the [Pinboard](https://pinboard.in) bookmark service into the [Chrome browser](https://www.google.com/chrome/browser/desktop/).

This is not a 'sync', as bookmarks created manually in Chrome will not be pushed to Pinboard.

This is only guaranteed to work in the latest version of Chrome. I've seen other extensions like the Google Mail Checker that do a certain amount of work to be backwards-compatible. Since I'm always on the latest, that's all I'm testing for.

# Warnings
Storage... tags and bookmarks, sync and local

I decided to allow a single folder to have multiple tags by using `+` for AND, and `|` for OR. Since Pinboard also allows you to use those symbols in your tag names, that could cause problems. It's what I needed though, and I don't use unusual symbols in my tag names, and I suggest you don't either.
