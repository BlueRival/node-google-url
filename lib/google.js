"use strict";

var moment = require( 'moment' );
var request = require( 'request' );
var url = 'https://www.googleapis.com/urlshortener/v1/url';

var GoogleUrl = function ( config ) {

  this._config = config || {};

};

GoogleUrl.prototype.shorten = function ( longUrl, done ) {
  this._makeRequest( 'POST', { "longUrl": longUrl }, function ( err, data ) {
    if ( err ) {
      done( err );
    } else {
      done( null, data.id );
    }
  } );
};

GoogleUrl.prototype.expand = function ( shortUrl, done ) {
  this._makeRequest( 'GET', { "shortUrl": shortUrl }, function ( err, data ) {
    if ( err ) {
      done( err );
    } else {
      done( null, data.longUrl );
    }
  } );
};

GoogleUrl.prototype.analytics = function ( shortUrl, done ) {

  var params = {};

  if ( typeof shortUrl === 'object' ) {
    params = shortUrl;
  } else {
    params.shortUrl = shortUrl;
  }

  if ( typeof params.fields !== 'string' || params.fields.length < 1 ) {
    params.fields = 'FULL';
  }

  switch ( params.fields.toUpperCase() ) {

    case 'CLICKS':
      params.fields = 'ANALYTICS_CLICKS';
      break;

    case 'STRINGS':
      params.fields = 'ANALYTICS_TOP_STRINGS';
      break;

    default:
      params.fields = 'FULL';
      break;

  }

  this._makeRequest( 'GET', { shortUrl: params.shortUrl, projection: params.fields }, function ( err, data ) {
    if ( err ) {
      done( err );
    } else {

      // clamp to valid values
      data.analytics = data.analytics || {
        "allTime":  {
          "shortUrlClicks": null,
          "longUrlClicks":  null,
          "referrers":      [],
          "countries":      [],
          "browsers":       [],
          "platforms":      []
        },
        "month":    {
          "shortUrlClicks": null,
          "longUrlClicks":  null,
          "referrers":      [],
          "countries":      [],
          "browsers":       [],
          "platforms":      []
        },
        "week":     {
          "shortUrlClicks": null,
          "longUrlClicks":  null,
          "referrers":      [],
          "countries":      [],
          "browsers":       [],
          "platforms":      []
        },
        "day":      {
          "shortUrlClicks": null,
          "longUrlClicks":  null,
          "referrers":      [],
          "countries":      [],
          "browsers":       [],
          "platforms":      []
        },
        "twoHours": {
          "shortUrlClicks": null,
          "longUrlClicks":  null,
          "referrers":      [],
          "countries":      [],
          "browsers":       [],
          "platforms":      []
        }
      };

      done( null, {
        analytics: normalizeAnalytics( data.analytics ),
        created:   moment( data.created ).toISOString()
      } );

    }
  } );
};

GoogleUrl.prototype._makeRequest = function ( type, payload, done ) {

  var qs = null;

  var requestParams = {
    uri:    url,
    method: type
  };

  payload = payload || {};

  if ( type === 'GET' && typeof payload === 'object' ) {
    qs = payload;
  } else if ( type === 'POST' ) {
    requestParams.json = payload;
  }

  if ( this._config && typeof this._config.key === 'string' && this._config.key.length > 0 ) {
    if ( !qs ) {
      qs = {};
    }
    qs.key = this._config.key;
  }

  if ( qs ) {
    requestParams.qs = qs;
  }

  request( requestParams, function ( err, body, response ) {
      setImmediate( function () {
        if ( err || (response && response.error) ) {
          if ( response && response.error ) {
            done( response.error.message );
          } else {
            done( err );
          }
        } else {

          if ( typeof response === 'string' ) {
            response = JSON.parse( response );
          }

          done( null, response );
        }
      } );
    }
  );

};

function normalizeAnalytics( analytics ) {

  for ( var field in analytics ) {
    if ( analytics.hasOwnProperty( field ) ) {
      normalizeAnalyticsSection( analytics[field] );
    }
  }

  return analytics;
}

var test = {
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
  }
};

function normalizeAnalyticsSection( section ) {

  for ( var field in section ) {
    if ( section.hasOwnProperty( field ) ) {
      switch ( field ) {
        case 'shortUrlClicks':
        case 'longUrlClicks':
          section[field] = parseInt( section[field], 10 );
          break;
        default:
          normalizeAnalyticsSubSection( section[field] );
          break;
      }
    }
  }

}

function normalizeAnalyticsSubSection( subsection ) {
  for ( var i = 0; i < subsection.length; i++ ) {
    subsection[i].count = parseInt( subsection[i].count, 10 );
  }
}

module.exports = GoogleUrl;
