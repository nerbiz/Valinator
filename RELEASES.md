# Release notes

## 0.13.1

* Forgot to update the version in package.json.

## 0.13.0

* Switched to Yarn/NPM, dropping Bower support.
* Updated the readme according to this change.
* Moved the big comments out of the code examples in the readme.

## 0.12.1

* Non-existing input elements are now skipped.
* Disabled input elements are now skipped.

## 0.12.0

* Added an easy way of setting the same validation rules for multiple input elements.
* Added the 'hexColor' validation check.
* Regular expressions in checks now all use the 'global' flag.
* Regular expressions in checks now return a boolean (previously they returned whatever string.match() returned).
* Fixed: ensureJquery() wasn't working.

## 0.11.0

* Only changed the version from 0.11 to 0.11.0 (semver). Bower wasn't seeing the last update, hopefully now it will.

## 0.11

* Added ZeeValinatorCharacters, which takes care of accented characters.
* Fixed: referencing the non-existing 'App.characters'.

## 0.10.1

* Added the version to bower.json, update should be picked up now.

## 0.10

* Added 'minNumber' and 'maxNumber' checks.
* Improved documentation.
* Fixed a regular expression typo in the 'name' check.
* Renamed the 'name' check to 'personName'.

## 0.9.3

* Replaced a wrong copy-pasted line in readme.

## 0.9.2

* Added documentation and other 'readme' info.

## 0.9.1

* Renamed the class to ZeeValinator, because Valinator was already taken: [chop0/valinator](https://github.com/chop0/valinator).
* Honestly, I think the name is now even better than it already was.

## 0.9

* Initial release.
