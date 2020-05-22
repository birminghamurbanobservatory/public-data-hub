
# Walkthrough

How I see the initial version of this public web application working/looking.

## Useful Links

[API Entry Point](https://api.birminghamurbanobservatory.com/)

[API Docs](https://stoplight.io/p/docs/gh/birminghamurbanobservatory/docs) - under construction

[Vocabulary Documentation](https://api.birminghamurbanobservatory.com/vocab/uo) generated on the fly from the common Urban Observatory Vocabulary.

[Urban Observatory Issues page](https://github.com/urbanobservatory/standards/issues) - where additions/modifications to the common Urban Observatory API standard are discussed. 

[Newcastle's Data Portal](https://newcastle.urbanobservatory.ac.uk/)

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


## Showing Sensors (and other Platforms) hosted on each top-level platform

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
  ancestorPlatforms: {
    includes: 'id-of-top-level-platform',
  },
  flags: {
    exists: false
  }
}, {
  onePer: 'timeseries',
})
```

Which makes the HTTP request:

`GET http://api.birminghamurbanobservatory.com/observations?onePer=timeseries&ancestorPlatforms__includes=id-of-top-level-platform&flags__exists=false`

`onePer: 'timeseries'` limits the response to one observation per _timeseries_. Specifically the most recent one. A timeseries is a series of observations with common properties, e.g. measured by the same sensor, whilst on the same platform, using the same measurement procedure, measuring the same observable property, etc etc. If, for example, the sensor was moved onto a different platform then a completely new timeseries would be created for it.

The main reason for getting an observation per _timeseries_ rather than per _sensor_ is because some sensors measure more that one observable property, for example a rain gauge measures both _PrecipitationDepth_ and _precipitation-rate_. I'd like to show both to the user, rather than just whichever is the most recent.

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
  disciplines: {
    includes: 'meteorology'
  },
  observedProperty: 'air-temperature',
  aggregation: {
    in: ['instant', 'average']
  },
  duration: {
    lte: '1800' // in seconds
  }
  flags: {
    exists: false
  },
  resultTime: {
    gte: '2020-03-09T10:31:38Z'
  }
}, {
  onePer: 'sensor'
})
```

Which makes the HTTP request:

`GET http://api.birminghamurbanobservatory.com/observations?onePer=sensor&disciplines__includes=meteorology&observedProperty=air-temperature&aggregation__in=instant,average&duration__lte=1800&flags__exists=false&resultTime__gte=2020-03-09T10:31:38Z`

The combination of the _disciplines_ and _observedProperty_ ensures we only get observations of *air-temperature* relevant to *meteorology*, i.e. it'll exclude any indoor *air-temperature* measurements.

By specifying the *aggregation* types we'll allow and *duration* we ensure that we only retrieve instantaneous observations of air temperature, or averages that are over a period less than 30 mins (1800 secs).

The `resultTime: {gte: '2020-03-09T10:31:38Z'}` sets a limit to how old the observations can be. This prevents us from showing a reading that's out of date. For example we might set this time to be 30 minutes ago. 

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

Although it is possible to  set a spatial bounding box for the request (see [docs](https://stoplight.io/p/docs/gh/birminghamurbanobservatory/docs/reference/REST-API.v1.yaml/paths/~1observations/get?srn=gh/birminghamurbanobservatory/docs/reference/REST-API.v1.yaml/paths/~1observations/get)), we probably don't need to bother, we'll just keep the default extent of the map the same (i.e. to show all of Birmingham), and if we plot an observation outside of the extent the user can always find it by manually zooming out.


## Modal with more information about an observation

When a user clicks on an observation in the side bar, or on an observation shown on the map (i.e. when showing a single observed property on the map) a modal appears showing more detail about that observation.

Here's an example of an observation object:

```json
{
  "@id": "4958-57-2020-04-27T11:18:46.000Z",
  "@type": "Observation",
  "resultTime": "2020-04-27T11:18:46.000Z",
  "hasResult": {
    "value": 0.2,
    "unit": {
      "@id": "Millimetre",
      "label": "millimetre",
      "symbol": "mm"
    }
  },
  "madeBySensor": "netatmo-05-00-00-05-b8-bc-rain",
  "observedProperty": {
    "@id": "PrecipitationDepth",
    "label": "precipitation depth"
  },
  "hasFeatureOfInterest": "EarthAtmosphere",
  "hasDeployment": "netatmo-gatekeepers",
  "ancestorPlatforms": [
    "forestdale-primary-school",
    "netatmo-05-00-00-05-b8-bc-p9z"
  ],
  "location": {
    "type": "Feature",
    "id": "7164feea-d076-4ffa-8d48-c09643656f43",
    "geometry": {
      "type": "Point",
      "coordinates": [
        -2.004847526550293,
        52.4073600769043
      ]
    },
    "properties": {
      "validAt": "2020-02-13T20:30:32.007Z"
    }
  },
  "disciplines": [
    {
      "@id": "meteorology",
      "label": "meteorology"
    },
    {
      "@id": "Hydrology",
      "label": "hydrology"
    }
  ],
  "phenomenonTime": {
    "hasBeginning": "2020-04-27T11:08:43.000Z",
    "hasEnd": "2020-04-27T11:18:46.000Z"
  },
  "usedProcedures": [
    "BhamUrbanObsPrecipDepthDerivation"
  ]
}
```

Here's what we should be showing in the modal:

1. The `value`, `unit.symbol` and `observedProperty.label` just as we did in the side bar. Further down the line the unit and the observedProperty could either have a tooltip or be a hyperlink to more information about them. E.g. a hyperlink could point to these [docs](https://api.birminghamurbanobservatory.com/vocab/uo/#PrecipitationDepth) about what PrecipitationDepth is. Or once I add the api endpoint `/observable-properties/PrecipitationDepth` we can get the comment/description from there to use as the tooltip.
   
2. Show the `resultTime` as an absolute value rather than *time ago*. If an observation has a `phenomenonTime` object (like this example) then also show the `hasBeginning` and `hasEnd`. For something like *PrecipitationDepth* this details over what timeframe the amount of rain was collected. For a maximum *air-temperature* observation the value is the max temperature recorded between the `hasBeginning` and `hasEnd`, with the `resultTime` showing the exact time within this timeframe that the max temp was recorded. 

3. Get the names of the `ancestorPlatforms` so we can show the hierarchy. 
   
You can get the details of each platform as separate requests:

- https://api.birminghamurbanobservatory.com/platforms/forestdale-primary-school
- https://api.birminghamurbanobservatory.com/platforms/netatmo-05-00-00-05-b8-bc-p9z

Or in one go:

- https://api.birminghamurbanobservatory.com/platforms?id__in=forestdale-primary-school,netatmo-05-00-00-05-b8-bc-p9z

N.B. the top grandparent platform comes first in the `ancestorPlatforms` array, and the bottom child platform is last (i.e. the one the actual sensor that made the observation is hosted on).

1. We can get more details about the sensor that made the observation from: 

- https://api.birminghamurbanobservatory.com/sensors/netatmo-05-00-00-05-b8-bc-rain

Although we'd only want to show the `name`, and possibly the `description`.

I'm thinking about creating a database of **metadata** records, with each record having certain tags, e.g. the id of platform it applies to, and/or the particular sensor, and/or deployment. Then we'll be able to get any relevant metadata for a given observation. For example a record with a tag relating to *forestdale-primary-school* could be "a large tree was cut down here on the 21st May 2019". I think we should be showing metadata like this in this modal. Obviously this needs implementing on the server first.

5. Show how far back these observations go. To be specific we want to get the earliest observation of this particular `observedProperty` from the top level platform (i.e. the first platform in the `ancestorPlatforms` array). The request will look like this

- https://api.birminghamurbanobservatory.com/observations?observedProperty=PrecipitationDepth&ancestorPlatforms__includes=forestdale-primary-school&limit=1&sortBy=resultTime&sortOrder=asc

N.B. This should do for now, although later we might need to include the usedProcedures as a query parameter too.

You should now have the human-friendly name for the platform so I'd phrase this as:

"Observations of precipitation depth from Forestdale Primary School date back to 23rd Nov 2018 at 10:58"

Bear in mind that sometimes the top level platform won't always be a place, it could be the WM-Air van, or a weather station we've not specifically hosted on anything, e.g. because it's in the middle of a field. This phrasing should work for these too.

6. Given that we have the location, we may wish to show a small zoomed in map of where the observation was made. This will be more pertinent for mobile platforms. Take the WM-Air van as an example, the location of this platform on the map could be the University, because it's now parked up, however the last PM10 reading was made when it was still on Broad Street, therefore our little map should be showing Broad Street.

7. Show the name and description of the deployment(s). You can get this information like this:

- https://api.birminghamurbanobservatory.com/platforms/deployments/netatmo-gatekeepers

8. Show what disciplines it's relevant too. Perhaps as icons.

9. There's work still to be done on the server regarding the `hasFeatureOfInterest` property, eventually you should be able to go to:

- https://api.birminghamurbanobservatory.com/features-of-interest

to get some more information about this feature of interest.

10.  We need to display the usedProcedures
```


## Getting historical observations to plot on a line graph

TODO





### URL Map

- '/'                                     : landing page, always useful I think, some basic info and what's this for...
- '/about'                                : about the project 
- '/team'                                 : some bio stuff on the team members, ie. you
- '/contact'                              : a form for comms
- '/partners'                             : place to list funders and other organisations you want to give a hat tip to

- '/deployments'                          : list of deployments, sortable and /or searchable
- '/deployments/:id'                      : deployment info page, shows all platforms in that deployment

- '/platforms'                            : list of platforms, perhaps searchable by name
- '/platforms/:id'                        : platform detail, list all sensors
- '/platforms/:id/:observedProperty       : show all the timeseries for the oberserved property from that platform

- '/map'                                  : the default google map page, showing platform locations
- '/map/observed-property/:property'      : map view of a particular observered property
- '/map/platform/:platform'               : when the user has clicked a platform location
- '/map/platform/:platform/:observation'  : when the user has clicked a particular reading and is shown the modal
