# Birmingham Urban Observatory

@angular/google-maps  
Be sure to use version 9.1.3 for the time being as 9.2 fails to display the map!  
https://github.com/angular/components/blob/master/src/google-maps/README.md

Good guide to the google-maps api:  
https://timdeschryver.dev/blog/google-maps-as-an-angular-component

### Online Docs  
https://stoplight.io/p/docs/gh/birminghamurbanobservatory/docs/reference/REST-API.v1.yaml  


## Building for Production

Once you've committed any changes to the code run `npm version major/minor/patch` to update the version number in *package.json* and add a new git tag.

Then build the application using `ng build --prod` or `npm run build`.

Then to deployment to firebase use: `npm run deploy`.

