## Discord GCE vm power

Provides Discord-bot slash command to start / stop your vm instance on GCE.

### Usage

`/gce (start|stop) [instance: <instance-name>] [zone: <zone>]`

### Hosting a bot server

Set your environment variables in `.env`.

`GOOGLE_APPLICATION_CREDENTIALS` can be omitted if you are to run this bot on GCP and attach a service account to that resource. Required permissions are:

  * compute.instances.start
  * compute.instances.stop
  * compute.instances.get
  * compute.zoneOperations.get

### License

MIT
