


	var   Class 		= require( "ee-class" )
		, Events 		= require( "ee-event" )
		, log 			= require( "ee-log" )
		, TaskScheduler = require( "ee-taskscheduler" );


	module.exports = new Class( {

		scheduleIdMap: {}


		, init: function( options ){
			this.schema 	= options.schema;
			this.plugins 	= options.plugins;
			this.name 		= options.name;
			this.id 		= options.id;

			this.plugins.load( "ee-class", function(){} );
			this.initializeScheduler();
		}


		, handleLog: function( group, id, status, data ){
			log.debug( group, id, status );
		}

		, handleError: function( group, id, err ){	
			log.error( group, id );
			log.trace( err );
		}

		, executeTask: function( group, id, next ){
			next();
		}


		, initializeScheduler: function(){
			this.scheduler = new TaskScheduler( {
				on: {
					  log: 		this.handleLog.bind( this )
					, error: 	this.handleError.bind( this )
					, task: 	this.executeTask.bind( this )
				}
			} );

			this.schema.query( "SELECT s.*, bj.name jobName FROM backupJob bj JOIN schedule s ON s.id_backupJob = bj.id WHERE bj.id_consumer = 1;", function( err, schedules ){
				if ( err ) throw new Error( "failed to fetch schedule from db: " + err );
				else {
					schedules.forEach( function( schedule ){
						if ( schedule.interval ) this.scheduleIdMap[ schedule.id ] = this.scheduler.interval( schedule.interval, schedule.referenceDate, schedule.jobName, schedule.maxAge );
						else this.scheduleIdMap[ schedule.id ] = this.scheduler.schedule( schedule.days, schedule.times, schedule.jobName, schedule.maxAge );
					}.bind( this ) );
				}
			}.bind( this ) );
		}
	} );