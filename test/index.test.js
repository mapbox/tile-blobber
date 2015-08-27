var fs = require('fs');
var tape = require('tape');
var Blobber = require('../index.js');

tape('add', function(assert) {
    var blobber = Blobber({});

    blobber.add('2/0/0');
    assert.deepEqual(Object.keys(blobber.features), ['1'], 'inserts new feature');

    blobber.add('2/0/0');
    assert.deepEqual(Object.keys(blobber.features), ['1'], 'noop on duplicate tile');

    blobber.add('2/1/0');
    assert.deepEqual(Object.keys(blobber.features), ['2'], 'blobs adjacent tile');

    blobber.add('2/2/2');
    assert.deepEqual(Object.keys(blobber.features), ['2', '3'], 'adds non-adjacent tile');

    assert.end();
});

tape('fixtures', function(assert) {
    var tests = fs.readdirSync(__dirname + '/fixtures').filter(function(basename) {
        return /\.list$/.test(basename);
    });
    tests.forEach(function(test) {
        var blobber = Blobber({});
        var expectedPath = __dirname + '/fixtures/' + test + '.json';
        var expected;

        try {
            expected = JSON.parse(fs.readFileSync(expectedPath));
        } catch(err) {
            expected = {};
        }

        // add tiles from fixture
        fs.readFileSync(__dirname + '/fixtures/' + test, 'utf8').split('\n').forEach(function(zxy) {
            if (!zxy) return;
            blobber.add(zxy);
        });

        if (process.env.UPDATE) {
            fs.writeFileSync(expectedPath, JSON.stringify(blobber, null, 2));
            expected = JSON.parse(fs.readFileSync(expectedPath));
        }

        assert.deepEqual(blobber.geojson(), expected);
    });
    assert.end();
});

