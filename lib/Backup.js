


	var   Class 			= require( "ee-class" )
		, Events 			= require( "ee-event" )
		, log 				= require( "ee-log" )
		, project 			= require( "ee-project" )
		, MysqlSchema 		= require( "ee-mysql-schema" )
		, TaskScheduler 	= require( "ee-taskscheduler" );


	var   BackupInstance 	= require( "./BackupInstance" )
		, PluginManager 	= require( "./PluginManager" );



	module.exports = new Class( {


		instances: {}


		, init: function( options ){
			this.schema = new MysqlSchema( project.config.db );
			this.schema.on( "load", this.initializeConsumers.bind( this ) );
			this.plugins = new PluginManager();
		}



		, initializeConsumers: function(){
			this.schema.query( "SELECT c.id, c.name FROM consumer c JOIN backupJob bj ON bj.id_consumer = c.id JOIN schedule s ON s.id_backupJob = bj.id GROUP BY c.id; ", function( err, consumers ){
				if ( err ) throw new Error( "faield to laod consumer list form db: " + err );
				else {
					consumers.forEach( function( c ){
						this.instances[ c ] = new BackupInstance( {
							  schema: 	this.schema
							, plugins: 	this.plugins
							, name: 	c.name
							, id: 		c.id
						} );
					}.bind( this ) );
				}
			}.bind( this ) );
		}
	} );