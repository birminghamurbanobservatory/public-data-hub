
# Walkthrough

How I see the initial version of this public web application working/looking.

## Landing

Upon landing on at the website (probably hosted at https://app.birminghamurbanobservatory.com or https://data.birminghamurbanobservatory.com) the user will see a Google Map with its extent set to Birmingham. 

The map will show a marker for each top-level _Platform_. Platforms can be hosted on other platforms. For example a weather station would be classed as a platform. This weather station might be hosted on a lamppost, which is also classed as a platform. Therefore a top-level platform is a platform that isn't hosted on any others. Given that child platforms normally inherit the location of their parent platform, it makes sense to take this approach of just showing the top level platform.

Expect there to be a good 200-300 platforms across Birmingham by the end of the year.

## Getting the top-level Platforms

To get this list of top-level Platforms you will need to call the `getPlatforms()` function in the _PlatformService_.

To get top-level platforms pass in a _where_ argument as follows:

```js
await getPlatforms({isHostedBy: {exists: false}}
```

This makes the following HTTP request:

`GET http://api.birminghamurbanobservatory.com/platforms?isHostedBy__exists=false`

The response is in JSON format, specifically JSON-LD, but we can ignore the _linked data_ parts, hence why my service removes the `@context` part. 

The function returns an object of the form `{data: [], meta: {}}`. 

The _data_ is an array of platform objects, as described in _platform.class.ts_. 

The _meta_ object is a work in progress, but it will be used to handle pagination at some point.

Also as it stands, there's no way to filter the platforms spatially, so just get them all for now (there's only a couple on there at the moment). 

The location of each platform is held in the _geometry_ property, which takes the same form as a GeoJSON _geometry_ property. So be aware that this might be a Polygon or LineString rather than a Point. I'm thinking that for now we should show everything on the map as points. Which means I either need to store/serve the central points on the backend or we calculate them on the fly on the frontend. The [@turf/centre](https://www.npmjs.com/package/@turf/center) package can do this.


## Showing Platform details

When a user clicks on a map marker for a Platform that Platform's details should be display on the left-hand third of the screen (or below the map on mobile devices). E.g. we can show its name, when it was created, what deployment(s) it is in. We'll have all this information from the `getPlatforms()` call.

What we don't know is whether any sensors are hosted on this platform, or any child platforms with their own sensors. E.g. a weather station platform might host several sensors: a thermometer, wind vane, etc.

To get this information we'll use the `getPlatform()` function, by default this would get the information we already have about the platform, however by providing the options object `{nest: true}` the response will also include all the platforms and sensors hosted on this top level platform. 

```js
await getPlatform('id-of-top-level-platform', {nest: true})
```

This makes the HTTP request:

`GET http://api.birminghamurbanobservatory.com/platforms/id-of-top-level-platform?nest=true`

The returned platform will have a property called `hosts`, which is an array of all the direct descendants of this top level platform. These descendants could be platforms or sensors. You can differentiate between them using the `@type` property. Descendant platforms could themselves have their own `hosts` array, and so on, in a nested structure. 


## Getting the latest observations from these sensors

Now that we know which sensors are hosted (directly or indirectly) on the top level platform, it's time to get the latest observations from these sensors.

To get observations we use the `getObservations()` function in the _ObservationService_.

The first argument of this _getObservations()_ function, the _where_ object has a LOT of properties we can set to filter the observations we get back. See the _get-observations-where.class.ts_ file for details.

To save us having to get the latest observation for each sensor one at a time, the call we make should look something like:

```js
await getObservations({
  onePer: 'timeseries',
  ancestorPlatforms: {
    includes: 'id-of-top-level-platform',
  },
  flags: {
    exists: false
  }
})
```

Which makes the HTTP request:

`GET http://api.birminghamurbanobservatory.com/observations?onePer=timeseries&ancestorPlatforms__includes=id-of-top-level-platform&flags__exists=false`

`onePer: 'timeseries'` limits the response to one observation per _timeseries_. Specifically the most recent one. A timeseries is a series of observations with common properties, e.g. measured by the same sensor, whilst on the same platform, using the same measurement procedure, measuring the same observable property, etc etc. If, for example, the sensor was moved onto a different platform then a completely new timeseries would be created for it.

The main reason for getting on observation per _timeseries_ rather than per _sensor_ is because some sensors measure more that one observable property, for example a rain gauge measures both _PrecipitationDepth_ and _PrecipitationRate_. I'd like to show both to the user, rather than just whichever is the most recent.

The `ancestorPlatforms: {includes: 'id-of-top-level-platform'}` bit ensures that we only get observations that have been collected by sensors whilst hosted on this platform.

The `flags: {exists: false}` bit removes any observations that have been flagged as suspect in quality.

We'll need to process the server's response a bit to match up the observations with the correct sensor to show in the HTML.

N.B. if this platform had previously hosted other sensors, that have since been removed, then the last observation from these sensors when they were on the platform would also be included. You can simply filter these out on the client side, or you can add a _madeBySensor_ object to the _where_ argument. e.g.

```js
{
  // ...
  madeBySensor: {
    in: ['sensor-1-id', 'sensor-2-id']
  }
}
```

This will ensure only observations from the specified sensors are returned.


## Showing a map of a specific observed property

The above is great for seeing where all the platforms are and seeing the latest sensor readings, but what users probably want to see is how temperature, air quality, rainfall, varies spatially across Birmingham.

We need some buttons or a dropdown that lets users select a specific observed property and plot it across Birmingham. The markers should no longer be the default Google Maps marker pin, but should instead be an actual value, e.g. 21, for 21°C when showing air temperature. The colour of the marker could also reflect it's temperature.

The obvious and easy variable to begin with is outdoor air temperature.

We can use the same `getObservations()` function to get this data. The _where_ argument will be something like:

```js
await getObservations({
  onePer: 'sensor'
  disciplines: {
    includes: 'Meteorology'
  },
  observedProperty: 'AirTemperature',
  flags: {
    exists: false
  },
  resultTime: {
    gte: '2020-03-09T10:31:38Z'
  }
})
```

Which makes the HTTP request:

`GET http://api.birminghamurbanobservatory.com/observations?onePer=sensor&disciplines__includes=Meteorology&observedProperty=AirTemperature&flags__exists=false&resultTime__gte=2020-03-09T10:31:38Z`

The combination of the _disciplines_ and _observedProperty_ ensures we only get observations of *AirTemperature* relevant to *Meteorology*, i.e. it'll exclude any indoor *AirTemperature* measurements.

The `resultTime: {gte: '2020-03-09T10:31:38Z'}` sets a limit to how old the observations can be. This prevents us from showing a reading that's out of date. For example we might set this to time to be 30 minutes ago. 

At some point we'll want to add the ability for a user to go back in time to see observations over a specific short window in time, e.g. between 12:00 and 13:00 last Tuesday. In which case we can add a `lt` property too, e.g.

```js
{
  resultTime: {
    gte: '2020-03-17T12:00:00Z',
    lt: '2020-03-17T13:00:00Z'
  }
}
```

Most observations should have a _location_ object so we know where to plot it on the map.

N.B. as yet there's still no ability to set a spatial bounding box for the request, but it shouldn't be too much of an issue as we'll just keep the default extent of the map the same (i.e. to show all of Birmingham), and if we plot an observation outside of the extent the user can always find it by manually zooming out.

At some point we should add the ability to click on a marker and see more details, e.g. when it was recorded and by which sensor, but this feature can be added further down the line.


## Getting historical observations to plot on a line graph

TODO





