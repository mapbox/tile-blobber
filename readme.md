tile-blobber
------------
Transform a list of tile coordinates into covering polygons. Uses `tilebelt`, `turf-union`.

Example usage:

``` sh
echo -e "3/2/2\n3/3/2\n3/4/4" | tile-blobber | geojsonio
```

![tile-blobber](https://cloud.githubusercontent.com/assets/83384/9529088/50e7ee20-4cc6-11e5-8344-b15ebaf1a126.png)

