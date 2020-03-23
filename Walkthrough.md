
# Walkthrough

How I see the initial version of this public web application working/looking.

## Landing

Upon landing on at the website (probably hosted at https://app.birminghamurbanobservatory.com or https://data.birminghamurbanobservatory.com) the user will see a Google Map with its extent set to Birmingham. 

The map will show a marker for each top-level _Platform_. Platforms can be hosted on other platforms. For example a weather station would be classed as a platform. This weather station might be hosted on a lamppost, which is also classed as a platform. Therefore a top-level platform is a platform that isn't hosted on any others. Given that child platforms normally inherit the location of their parent platform, it makes sense to take this approach of just showing the top level platform.

Expect there to be a good 200-300 platforms across Birmingham by the end of the year.

## Getting the top-level Platforms

To get this list of top-level Platforms you will need to call the `getPlatforms()` function in the PlatformService.

To get top-level platforms pass in a _where_ argument as follows:

```js
getPlatforms({isHostedBy: {exists: false}}
```

This makes the following HTTP request:

`GET http://api.birminghamurbanobservatory.com/platforms?isHostedBy__exists=false`

The response is in JSON format, specifically JSON-LD, but we can ignore the _linked data_ parts, hence why my service removes the `@context` part. 

The function returns an object of the form `{data: [], meta: {}}`. 

The _data_ is an array of platform objects, as described in _platform.ts_. 

The _meta_ object is a work in progress, but it will be used to handle pagination at some point.

Also as it stands, there's no way to filter the platforms spatially, so just get them all for now (there's only a couple on there at the moment). 

The location of each platform is held in the _geometry_ property, which takes the same form as a GeoJSON _geometry_ property. So be aware that this might be a Polygon or LineString rather than a Point. I'm thinking that for now we should show everything on the map as points. Which means I either need to store/serve the central points on the backend or we calculate them on the fly on the frontend. The [@turf/centre](https://www.npmjs.com/package/@turf/center) package can do this.


## Showing Platform details

When a user clicks on a map marker for a Platform that Platform's details should be display on the left-hand third of the screen (or below the map on mobile devices). E.g. we can show its name, when it was created, what deployment(s) it is in. We'll have all this information from the `getPlatform()` call.

What we don't know is whether any sensors are hosted on this platform, or an child platforms with their own sensors. E.g. a weather station platform might host several sensors: a thermometer, wind vane, etc.

There's two options for finding any child platforms on this top-level platform:

```js
getPlatforms({isHostedBy: 'id-of-top-level-platform'})
```

i.e. 

`GET http://api.birminghamurbanobservatory.com/platforms?isHostedBy=id-of-top-level-platform`


**or**

```js
getPlatforms({ancestorPlatform: {includes: 'id-of-top-level-platform'}})
```

i.e. 

`GET http://api.birminghamurbanobservatory.com/platforms?ancestorPlatform__includes=id-of-top-level-platform`

The former ONLY gets direct descendants of the top level platform, the latter gets all descendants. It's rare to have more than 1 or 2 generations of platforms. 

I'm imagining that a user will click on a map marker, see the platform's details on the left-hand detail component, it will load any descendant platforms allowing you to traverse the platform tree. And for each platform it will show its sensors and the last observation it made.


## Getting sensors

To get a platform's sensors you will need to call the `getSensors()` function in the SensorService. For example

```js
getSensors({isHostedBy: 'weather-station-abc'})
```

Which makes the following HTTP request

`GET http://api.birminghamurbanobservatory.com/sensor/isHostedBy=weather-station-abc`

This on gets sensors hosted directly on the platform specified. We could probably find a way of getting all the sensors descending from the top-level platform in one go if useful.

The object returned by the function is the same structure as `getPlatforms()`, but this time the _data_ array is an array of sensors. See _sensor.ts_ for a list of its properties.


## Getting the last observation for each sensor

TODO


## Showing a map of a specific observed property

TODO





