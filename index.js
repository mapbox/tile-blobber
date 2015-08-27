var tilebelt = require('tilebelt');
var union = require('turf-union');

module.exports = Blobber;

function Blobber(options) {
    var blobber = {};
    var features = {};
    var cache = {};
    var id = 0;

    blobber.cache = cache;
    blobber.features = features;

    blobber.toJSON =
    blobber.geojson = function() {
        var collection = [];
        for (var id in features) {
            var feature = JSON.parse(JSON.stringify(features[id]));
            delete feature.tiles;
            collection.push(feature);
        }
        return {
            type: 'FeatureCollection',
            features: collection
        };
    };

    blobber.add = function(zxy) {
        if (cache[zxy]) return;

        var coords = zxy.split('/');
        var z = parseInt(coords[0],10);
        var x = parseInt(coords[1],10);
        var y = parseInt(coords[2],10);
        var feature = {
            type: 'Feature',
            properties: {},
            geometry: tilebelt.tileToGeoJSON([x,y,z]),
            tiles: [zxy]
        };

        // n/s/e/w tiles
        var look = [
            z +'/'+ (x-1) +'/'+ (y),
            z +'/'+ (x+1) +'/'+ (y),
            z +'/'+ (x) +'/'+ (y-1),
            z +'/'+ (x) +'/'+ (y+1)
        ];

        var newid = 0;
        var adjacents = [];
        var used = {};

        for (var i = 0; i < look.length; i++) {
            var lzxy = look[i];
            if (!cache[lzxy]) continue;
            if (used[cache[lzxy]]) continue;

            used[cache[lzxy]] = true;
            newid = newid || (++id);
            adjacents.push(cache[lzxy]);
        }

        if (newid) {
            for (var i = 0; i < adjacents.length; i++) {
                var original = feature;
                feature = union(original, features[adjacents[i]]);
                feature.tiles = original.tiles.concat(features[adjacents[i]].tiles);
                delete features[adjacents[i]];
            }
            feature.id = newid;
        } else {
            feature.id = ++id;
        }
        feature.properties.id = feature.id;
        features[feature.id] = feature;
        for (var i = 0; i < feature.tiles.length; i++) {
            cache[feature.tiles[i]] = feature.id;
        }
    };

    return blobber;
}

