#!/bin/bash

# This file is for automaing a task that needs done over 4000 times
# extract each file count the number of pages list the name, the archive name,
# take shrink it and place it in a thumbnails folder and add the path to a json output
# use curl to post it to the server?

# Debugging
set -x

# Variables
declare -a audio_List
# as i discover what files work without adding extra shit and what doesnt this list will change
# tested not working: wma
mapfile -t audio_List < <( find ./ | grep -i -e .m4a -e .mp3 -e .wav -e .acc -e .flac)

iteration="0"

thumbs="$(pwd)/thumbs"
mkdir "$thumbs"

# json variables
# name, filename, waveform, length, rating
for i in "${audio_List[@]}"
do
    # what iteration are we on?
    iteration=$((iteration + 1))

    # input="$i"
    fileName=$(basename -- "$i")
    name="${fileName%.*}"
    ext="${fileName##*.}"

    # switch the output name to change what image format you want
    # output="$name.png"
    output="$name.avif"
    # output="$name.jpg"
    # output="$name.webp"

    # use ffprobe here to figure out the length of the audio file
    length=$(ffprobe -i "$i" |& awk '/Duration/ {print $2}' | sed 's/00://;s/\..\{2\},//')
    artist=$(ffprobe -i "$i" |& awk -F" " '/ artist / {$1=$2="";print $0}' | sed 's/^[[:space:]]*//')
    album=$(ffprobe -i "$i" |& awk -F" " '/ album / {$1=$2="";print $0}' | sed 's/^[[:space:]]*//')

    search="$name $artist $album"

    # Generate the Waveform
    res="1280x720" # change me for different resolution
    # ffmpeg -n -i "$i" -f lavfi -i color=c=black:s=640x320 -filter_complex "[0:a]showwavespic=s=640x320:colors=white[fg];[1:v][fg]overlay=format=auto" -frames:v 1 "$thumbs/$output" &> /dev/null
    ffmpeg -n -i "$i" -f lavfi -i color=c=black:s=$res -filter_complex "[0:a]showwavespic=s=$res:colors=white[fg];[1:v][fg]overlay=format=auto" -frames:v 1 "$thumbs/$output" &> /dev/null

    # Upload the data to the Server
    # -urlencode allows symbols to be uploaded to without crashing the database
    curl --data-urlencode name="$name" \
        --data-urlencode fileName="$i" \
        --data-urlencode waveform="$output" \
        --data-urlencode artist="$artist" \
        --data-urlencode album="$album" \
        --data-urlencode search="$search" \
        --data-urlencode length="$length" \
        --data-urlencode rating=-1 \
        -X POST http://localhost:3000/db/create

    echo "{\"name\": \"$name\", \"artist\": \"$artist\", \"fileName\": \"$input\", \"waveform\": \"$output\", \"length\": \"$length\", \"rating\": \"-1\"}"

done
exit
