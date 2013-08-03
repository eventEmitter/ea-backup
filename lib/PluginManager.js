


	var   Class 		= require( "ee-class" )
		, Events 		= require( "ee-event" )
		, log 			= require( "ee-log" )
		, Waiter 		= require( "ee-waiter" )
		, project		= require( "ee-project" )
		, npm 			= require( "npm" )
		, fs 			= require( "fs" );



	module.exports = new Class( {

		  queue: []
		, plugins: {}

		, init: function( options ){
			var waiter = new Waiter();

			// load npm
			waiter.add( function( cb ){
				npm.load( function( err, npm ){
					if ( err ) throw err;
					else {
						this.loaded = true;
						this.npm = npm;

						cb();
					}
				}.bind( this ) );
			}.bind( this ) );
			

			// load plugin list
			waiter.add( function( cb ){
				fs.readdir( project.root + "plugins/node_modules", function( err, files ){
					if ( err ) cb();
					else {
						var innerWaiter = new Waiter();

						files.forEach( function( file ){
							innerWaiter.add( function( innerCb ){
								fs.exists( project.root + "plugins/node_modules/" + file + "/package.json", function( exists ){
									if ( exists ) this.plugins[ file ] = project.root + "plugins/node_modules/" + file;
									innerCb();
								}.bind( this ) );
							}.bind( this ) );
						}.bind( this ) );

						innerWaiter.start( cb );
					}
				}.bind( this ) );
			}.bind( this ) );


			waiter.start( function(){
				for ( var i = 0, l = this.queue.length; i < l; i++ ) this.load( this.queue[ i ].plugin, this.queue[ i ].callback );
			}.bind( this ) );
		}



		, load: function( plugin, callback ){
			if( !this.loaded ) this.queue.push( { plugin: plugin, callback: callback } );
			else {
				if ( this.plugins[ plugin ] ) {
					if ( typeof this.plugins[ plugin ] === "string" ) this.plugins[ plugin ] = require( this.plugins[ plugin ] );
					callback( null, this.plugins[ plugin ] );
				}
				else {
					this.npm.commands.install( project.root + "plugins/", [ plugin ], function( err, data ){
						if ( err ) callback( err );
						else {
							log.dir( data );
							this.plugins[ plugin ] = require( project.root + "plugins/node_modules/" + plugin );
							callback( null, this.plugins[ plugin ] );
						}
					}.bind( this ) );
				}			  
			}
		}
	} );