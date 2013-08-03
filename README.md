#ea backup

*** not yet finished! ***

backup agent configured via mysql supporting full & incremental backups of:

- AWS S3 storage
- AWS RDS ( non blocking )
- Local Filesystem
- Remote Filesystems
- Mysql
- Remote GIT Repositories


the agent is able to store its data

- on a local filesystem
- on a remote filesystem ( using ssh )
- on external filesystem using disk rotation ( offline backup )

the agent will create detailed reports which are stored in the mysql db and can be printed and or mailed automatically. in order to be able to create incremental backups the current fullbackup must be available to the agent. the diffs are made using rdiff. the machine where this agent runs on requires a temporary storage device which is large enough to store the biggest object of any remote and or non fileysystem backup sources * the number of threads the agent is running. this is required because files from some remote sources must be downloaded completly before a diff can be made.

WARNING: backing up some resources may cause significant costs due to usage of resources as instance hours, traffic & more.