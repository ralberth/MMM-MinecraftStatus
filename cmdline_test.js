/*
 * Helper script to lend a hand diagnosing problems with a Minecraft
 * server.  Call this from the command-line with a host and port.
 * This connects once, sends a single Minecraft-Ping, and displays
 * the raw results to the console.
 *
 * Sample invocation:
 *      % node cmdline_test.js  myhost.ddns.net 11847
 *      Results:
 *         Error = null
 *         Data  = {
 *             pingVersion: 1,
 *             protocolVersion: 127,
 *             gameVersion: '1.12.1',
 *             motd: 'Willowlands',
 *             playersOnline: 6,
 *             maxPlayers: 10
 *         }
 */
var mcp = require('minecraft-ping');

console.log("MSPinging " + process.argv[2] + ":" + process.argv[3]);
mcp.ping_fe01({
        host: process.argv[2],
        port: process.argv[3]
    },
    function(err, response) {
        console.log("Results:");
        console.log("   Error = " + JSON.stringify(err, null, 2));
        console.log("   Data  = " + JSON.stringify(response, null, 2));
    });
