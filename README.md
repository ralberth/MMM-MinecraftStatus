# MMM-MinecraftStatus

A [MagicMirror²](https://magicmirror.builders) module to ping a remote Minecraft server and report how many players are currently on.  If the server can't be reached, this displays an alert.

Example screen showing two instances of MMM-MinecraftStatus config entries, one for Willowlands, and a second for Aliens:

![Example screen](screenshot.png)

Each entry has two metrics that are periodically updated on a schedule you set in the `config.js` file.  The number of players is retrieved from the server, and the latency is measured as the total round-trip to contact the Minecraft server from the MagicMirror² server.

If MMM-MinecraftStatus can't contact the Minecraft server, it sends an alert message to the alert module.


## Installation

Run these commands at the root of your MagicMirror² install:

```shell
cd modules
git clone https://github.com/ralberth/MMM-MinecraftStatus
cd MMM-MinecraftStatus
npm install
cd ../..
```

This module needs the `npm install` to pick up it's dependencies, including the [minecraft-ping](https://www.npmjs.com/package/minecraft-ping) module that does all the real networking in here.


## Upgrade

If you already have a version of MMM-MinecraftStatus, run the following to pick up new code changes and install necessary dependencies:

```shell
cd MMM-MinecraftStatus
git pull
npm install
cd ..
```


## Configuration

Edit your `config/config.js` file and add a new object to the `modules` array like any other module:

```js
var config = {
    modules: [
        {
            module: 'MMM-MinecraftStatus',
            config: {
                banner: "Red Mountain",           // Banner to display
                hostname: "redmountain.ddns.net", // or IP address
                port: 12345,
                intervalSeconds: 15               // how often to ping the Minecraft server
            }
        }
    ]
}
```


| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `banner` | '`Minecraft Server`'| Name of the server to display on the screen above the number of players and latency.  This length should be rather short, as long values drag the width of the player count and latency wider to match.  Pick something small enough to distinguish one server from another. |
| `hostname` | '`localhost`' | DNS hostname of the Minecraft server to monitor. |
| `port` | `12345` | TCP port the Minecraft server is listening on. |
| `intervalSeconds` | `30` | How often the MagicMirror server should try to ping the Minecraft Server, in seconds. |


## Published Messages

Messages published within the browser page by each instance of MMM-MinecraftStatus that is active (isn't covered or had `this.hide()` called on it).


### Minecraft Server Failure: `SHOW_ALERT`

MMM-MinecraftStatus publishes a `SHOW_ALERT` message intended for the built-in alert module.  This is available to all modules that choose to implement `this.receiveNotification()` in their module.

The message is sent whenever a ping to the configured Minecraft server fails for any reason.  The cadence is set by the config entry `intervalSeconds` above.

Attributes of the published object:

* `type`: always set to `notification`
* `title`: always set to the value in the module config entry `banner` above
* `message`: string description of the problem, taken from the minecraft-ping library mentioned above.


## Styling and HTML

Sample of the generated HTML from a browser, so you can restyle anything you like:

```html
<div class="minecraftStatus">
   <div class="title">Willowlands</div>
   <table>
      <tbody class="successSection">
         <tr>
            <td class="iconbox"><i class="fa fa-user fa-fw"></i></td>
            <td class="value">0</td>
            <td class="label">players</td>
         </tr>
         <tr>
            <td class="iconbox"><i class="fa fa-clock-o fa-fw"></i></td>
            <td class="value">9</td>
            <td class="label">ms latency</td>
         </tr>
      </tbody>
      <tbody class="errorSection">
         <tr>
            <td class="iconbox"><i class="fa fa-exclamation-triangle fa-fw"></i></td>
            <td class="errorLabel">Error</td>
         </tr>
         <tr>
            <td class="errorText" colspan="2">blah blah blah</td>
         </tr>
      </tbody>
   </table>
</div>
```


## Translations

MMM-MinecraftStatus is available in the following languages:

* Chinese
* German
* English
* Spanish
* French
* Italian
* Simplified Japanese
* Russian

The translations were done with Google Translate.  If you are a native speaker and have a better translation, please post a pull request!  I'd love to improve on what defaults I could find.


## Known Bugs

1. The default timeout is way too long for this use case.  The current minecraft-ping library doesn't have a way to change this, so probably need to swap to another library.
1. If the browser-based timer stops, there is no restart watcher and the display will remain as-is even though there are no current updates.  This leads to false-positives when the display contains stale data.
1. Translations were done mechanically instead of via a native human speaker.
1. This does not work well with older Minecraft servers due to the nature of the different ping protocols defined by Minecraft.
1. There is no backoff/retry logic with the Minecraft server: if it fails, it reports failure and waits the number of `intervalSeconds` before trying again.  This can paint an unduly bad picture for at most `intervalSeconds` seconds before it tries again, even if the server recovered quickly.



## TO DO

Other ideas and things I'd like to build in eventually.  Feel free to comment and suggest others.

* Make an alert SOUND when goes from 0 to non-zero
* Send an email or TXT when goes from 0 to non-zero
* Add additional notification messages so other browser modules can react
* Accept other published messages so other modules can control this module
* Automate trying different pingTypes, then keep the one that works
* Config items to control styling
* MUCH faster timeouts!  (mc socket in current library can't do this, switch libs?
* Show logged-in users
