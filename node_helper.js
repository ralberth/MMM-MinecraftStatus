/* global module, require */
/* jshint node: true, esversion: 6 */

/* Magic Mirror
 * Node Helper: MMM-MinecraftStatus
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var mp = require('minecraft-ping');


module.exports = NodeHelper.create({

    // Override start method.
    start: function() {
        console.log("[MinecraftStatus] Starting node helper");
    },


    /*
     * Callback function from MagicMirror invoked when one of the MinecraftStatus objects
     * in a browser anywhere call socketNotificationSend().  We consider this an async
     * request/response pair, so this pings the minecraft server given to us, then responds
     * with the result, either success or error.
     * HOWEVER, this isn't the model for MagicMirror!  Browser's sendSocketNotification()
     * and helper's socketNotificationReceived() is a Queue pattern where many senders
     * (each MinecraftStatus object in each browser) sends to a single consumer (this
     * helper).  The other side where the helper's sendSocketNotification() sends to the
     * browser's socketNotificationReceived() is a Message Bus pattern: every browser
     * object receives a copy of the message and each consumes it independently.  Because
     * of this, we include "payload.identifier" below, sent from the browser, so each
     * consumer can decide if this message was intended for it.  In practice, only one
     * browser object really consumes this message.
     *
     * This has the real call to Minecraft.  See https://www.npmjs.com/package/minecraft-ping
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === "MINECRAFT_PING") {
            //console.log("[MinecraftStatus] MCPinging " + payload.hostname + ":" + payload.port);
            var arg = { host: payload.hostname, port: payload.port };
            var start_time = new Date();
            var helper = this;
            mp.ping_fe01(arg, function(err, resp) {
                if (err) {
                    err.identifier = payload.identifier;
                    helper.sendSocketNotification("MINECRAFT_ERROR", err);
                } else {
                    var timeSec = (new Date() - start_time);
                    var playerCount = resp.numPlayers ? resp.numPlayers : resp.playersOnline;
                    helper.sendSocketNotification("MINECRAFT_UPDATE", {
                        identifier: payload.identifier,
                        players: playerCount,
                        latency: timeSec
                    });
                }
            });
        }
    }
});
