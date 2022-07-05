// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

   // For live
  // apiUrl: 'http://localhost:8080/',
  apiUrl: 'https://app.9mmenergy.com/',
  uiUrl:'http://localhost:4200/',
  oldUiUrl:"http://localhost:4202/",
  contactUrl: `https://9mmenergy.com/contact-us`,
 
   // For Testing
   // apiUrl: 'http://9mmenergydrink-env.us-east-2.elasticbeanstalk.com/',
   // uiUrl:'http://app.9mmenergydrink.s3-website.us-east-2.amazonaws.com/',
   // contactUrl: `http://app.9mmenergydrink.s3-website.us-east-2.amazonaws.com/contact-us`,
  europeDomain: 'http://localhost:4300/',
  mainDomain: 'http://localhost:4200/',
  mmaDomain: 'http://localhost:4400/',
  esportsDomain: 'http://localhost:4500/',
  motorDomain: 'http://localhost:4600/',
  brazilDomain: 'http://localhost:4700',

  mmaFRDomain: 'http://localhost:4401/',
  esportsFRDomain: 'http://localhost:4501/',
  motorFRDomain: 'http://localhost:4601/',

  
  prismic9mm: 'https://9mmenergydrink.prismic.io/api/v2',
  prismicmma: 'https://mma-9mmenergydrinks.prismic.io/api/v2',
  prismicesports: 'https://esports-9mmenergydrinks.prismic.io/api/v2',
  prismicmotor: 'https://motorsports.prismic.io/api/v2',
  prismicbrazil: 'https://9mmenergydrink-brazil.prismic.io/api/v2',

  imageUrl:'https://9mmenergydrink-gallery.s3.us-east-2.amazonaws.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
