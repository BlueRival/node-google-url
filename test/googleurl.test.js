"use strict";

var assert = require( 'assert' );
var key = 'AIzaSyBjQqvU4WJNaxJ9BvgQOUOV0f2-5V2OAj0'; // this is a key generated from a public Google account. if you use it, you will probably DoS yourself if others are using this Key
var GoogleUrl = require( '../index' );
var longUrl = 'http://bluerival.com/';
var shortUrl = 'http://goo.gl/BzpZ54';

describe( 'Goo.gl URL Shortener API', function () {
  loadTests( 'with API key', true );
  loadTests( 'without API key', false );
} );

function loadTests( name, withKey ) {

  describe( name, function () {

    var params = { };

    if ( withKey ) {
      params = { key: key };
    }

    it( 'should shorten a URL', function ( done ) {

      var googleUrl = new GoogleUrl( params );
      googleUrl.shorten( longUrl, function ( err, shortenedUrl ) {

        try {
          assert.ifError( err );
          assert.strictEqual( shortenedUrl, shortUrl );
          done();
        } catch ( e ) {
          done( e );
        }

      } );

    } );

    it( 'should expand a URL', function ( done ) {

      var googleUrl = new GoogleUrl( params );
      googleUrl.expand( shortUrl, function ( err, expandedUrl ) {

        try {
          assert.ifError( err );
          assert.strictEqual( expandedUrl, longUrl );
          done();
        } catch ( e ) {
          done( e );
        }

      } );

    } );

    it( 'should get analytics for a URL', function ( done ) {

      var googleUrl = new GoogleUrl( params );
      googleUrl.analytics( shortUrl, function ( err, results ) {

        try {

          assert.ifError( err );
          checkSection( results.analytics.allTime );
          checkSection( results.analytics.month );
          checkSection( results.analytics.week );
          checkSection( results.analytics.day );
          checkSection( results.analytics.twoHours );
          assert.strictEqual( typeof results.created, 'string' );
          assert.ok( results.created.length > 0 );
          assert.ok( results.created.match( /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]+[A-Za-z]+$/ ) );

          done();
        } catch ( e ) {
          done( e );
        }

      } );

    } );
  } );

}

function checkSection( section ) {
  assert.strictEqual( typeof section, 'object' );
  assert.strictEqual( typeof section.shortUrlClicks, 'number' );
  assert.strictEqual( typeof section.longUrlClicks, 'number' );
  assert.strictEqual( typeof section.referrers, 'object' );
  assert.strictEqual( typeof section.countries, 'object' );
  assert.strictEqual( typeof section.browsers, 'object' );
  assert.strictEqual( typeof section.platforms, 'object' );
  assert.ok( section.referrers.length > 0 );
  assert.ok( section.countries.length > 0 );
  assert.ok( section.browsers.length > 0 );
  assert.ok( section.platforms.length > 0 );
  assert.strictEqual( typeof section.referrers[0].count, 'number' );
  assert.strictEqual( typeof section.countries[0].count, 'number' );
  assert.strictEqual( typeof section.browsers[0].count, 'number' );
  assert.strictEqual( typeof section.platforms[0].count, 'number' );
}
