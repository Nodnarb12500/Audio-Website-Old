# Temp Docs

This Doc file is hopdully enough to get you started on making your audio archive more easily accessible to you as well as allowing you to add ratings, and possibly transcriptions eventually, but we cant do that yet.
---
## Creating the Database

This website relies heavily on a database, we use Knex so we can easily switch to any database you might want to use, but by default the server uses sqlite3 and expects the database path to be "db/audios.sqlite3"
---
## Filling the database

Now that you have created the database now we need to fill the database. there are some things to think about here, while i dont have an upload page built into this site yet Nor do i have a way to recieve files the site can still "obtain" and stream all the media you might want it to.

Below i will make an example on what you might want to do this also assumes you are on linux.
`ln -s ~/Music .../Audio-Website/resources/media/Music`
`cd .../Audio-Website/resources/media/`
`../../scripts/audioJSON.sh`

before you run the script make sure that the script can send data to the server sucessfully. the script will generate waveforms for you automatically and then add the paths to the database via Curl. You may need to edit the Curl command to tell the script where to send the data, there are also some options you can configure inside the script.