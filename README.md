# Kula Level Editor

A simple to use tool to create, edit, and view Kula World Levels.

[Live Demo Site](https://www.kulaworkshop.net/tools/leveleditor/)

## Installation

Head over to the [releases page](https://github.com/KulaWorkshop/LevelEditor/releases/), and download the latest version of your preferred executable.

## Windows 7

This program requires **WebView2**, a commonly used Microsoft runtime that allows web interfaces to be built into desktop applications. This **should** be already installed, notably on Windows versions **10 and 11**, but some versions of Windows do not have it installed. If you are getting an error when launching the program, you may not have this dependency installed. To install it, simply download it from Microsoft's website [here](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section).

-   Click the download button under the **Bootstrapper** section.
-   Run through the installer instructions.

## Changelog

**v1.3**

-   Added full support for transporters
-   Added full support for buttons
-   Added random theme loading on startup
-   Reworked menu icons
-   Reworked menu design
-   Reworked asset filenames
-   Fixed an issue where transporters wouldn't connect properly

**v1.2**

-   Added full support for moving blocks
-   Added full support for laser blocks
-   Added support for changing the amount of time a level starts with
-   Added support for choosing if the level is secret or not
-   Added support for far-sighted invisible blocks
-   Added support for choosing the direction of the player spawn
-   Added support for choosing the direction of arrows
-   Added support for choosing the orientation of fast moving stars
-   Added support for choosing the timing of flashing blocks
-   Added support for choosing the timing of moving spikes
-   Added a feature that warns the user if a block is too close to the bounding box or outside
-   Added categories for all items for better organization
-   Changed the bounding box for clearer visibility
-   Items can no longer be placed on certain blocks that wouldn't allow for it in game
-   Fixed an issue where moving blocks would corrupt a level if the theme was switched
-   Fixed an issue where the tileset and skybox would be offset from the current theme
-   Fixed an issue where a block would be overwritten incorrectly if another block was placed in the same position
-   Fixed an issue where all the items on a block would be overwritten if one was changed
-   Fixed an issue where a level couldn't be reloaded if the same level was chosen

**v1.1**

-   Added flashing blocks
-   Added support for viewing moving blocks
-   Added support for viewing laser blocks
-   Added the ability to change the skybox and tileset
-   Added a tile base for bounce pads
-   Changed some of the sprite sizes, rotations, and positions to fit more accurately with the game
-   Fixed an issue where crumble blocks wouldn't play any sound in game
-   Fixed an issue where fruits couldn't be seen in certain levels
-   Fixed an issue where changing the size of the page would affect the block selection collision
-   Fixed an issue where some blocks weren't viewed accurately

**v1.0**

Initial release.

-   Ability to create and edit levels, viewing levels may vary on accuracy as of this version.
