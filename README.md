node-google-url
===

A NodeJS module to interface with Google's URL shortening service.

About
===

This library implements a client to consume the API (most of it) documented at https://developers.google.com/url-shortener/v1/getting_started#shorten

It supports the following actions:

Shorten URL
Expand Shortened URL
Get Analytics for Shortened URL

Authentication
===

The three actions supported by this library do not require an API key, but Google recommends getting one here: https://code.google.com/apis/console

Usage
===

```javascript

var GoogleUrl = require( 'google-url' );

googleUrl = new GoogleURL();

// OR

googleUrl = new GoogleURL( { key: 'Your Real Key Here' });

googleUrl.shorten( 'http://bluerival.com/', function( err, shortUrl ) {
  // shortUrl should be http://goo.gl/BzpZ54
} );

googleUrl.shorten( 'http://goo.gl/BzpZ54', function( err, longUrl ) {
  // longUrl should be http://bluerival.com/
} );

googleUrl.analytics( 'http:/goo.gl/BzpZ54', function( err, results ) {

  /* format of results will be:
  {
    created:   "An ISO Date",
    analytics: {
      allTime:  {
        shortUrlClicks: 2,
        longUrlClicks:  3,
        referrers:      [
          { count: 2, "id": "http://HildoerSystems.com/" } /* , ... */
        ],
        countries:      [
          { count: 10, "id": "US" } /* , ... */
        ],
        browsers:       [
          { count: 3, "id": "Firefox" } /* , ... */
        ],
        platforms:      [
          { count: 6, "id": "Mac" } /* , ... */
        ]
      },
      month:    { /* same schema as allTime */ },
      week:     { /* same schema as allTime */ },
      day:      { /* same schema as allTime */ },
      twoHours: { /* same schema as allTime */ }
    } */

  }

} );

```


Bugs
===

Please report bugs to https://github.com/BlueRival/node-google-url/issues
