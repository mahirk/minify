# Link Minifier

A simple application to help minify links for an organization. Simply deploy this to your server and link it to your short url and watch the magic happen.


## Simple Installation on server:

### Terminal window 1:

You need to have [redis-server](http://redis.io/topics/quickstart) to run this locally.

```bash
redis-server
```
 ensure it's connected and keep this terminal open, or you can also run

```bash
redis-server --daemonize yes
```
if you want to kill the instance running in the background run:

```bash
kill $(ps aux | grep redis-server | grep -v grep | awk '{print $2}')
```

### Terminal window 2:

Create your username and password.

```bash
redis-cli
select 1
set [username] [password]
```
You can close this terminal with a `Ctrl - C` command.

### Terminal window 3:

```bash
git clone https://github.com/mahirk/minify.git
npm install
node app.minify.js
```
this will run the application. You want to keep this open. Alternatively, you can dockerize the service and run it or run it using the `forever` module on [npm](https://www.npmjs.com/package/forever) .

```bash
npm install forever
forever start app.minify.js
```

### Endpoints

Public facing Routes

```http
GET / : GOES TO /cp
GET /:mini : GETS THE MINIFIED LINK @ /:mini
```

Internal App Routes
```http
GET /cp : CONTROL PANEL
GET /cp/all : ALL LINKS (RETURNS AN OBJECT) (requires a callback)
POST /cp/login : LOGIN PAGE
POST /generate: CREATE NEW LINK
DEL /:mini : DELETE LINK
```

## Customization

The pages for the admin side can be modified to include the logo of the organization running the project. These files are available under `/views/*`.

## License

This project follows the MIT License. In simple words, feel free to copy it and make it yours. All we ask is that you give us (Mahir Kothary) recognition for the project.
