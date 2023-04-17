#!/bin/bash

# Debugging
#set -x

# as i discover what files work without adding extra shit and what doesnt this list will change
# tested not working: wma

# Variables
declare -a audio_List
# change the find command to grab the audios folder
audioFolder="Music\/"
mapfile -t audio_List < <( find Music/ | grep -i -e "\.m4a" -e "\.mp3" -e "\.wav" -e "\.aac" -e "\.flac")

# iteration does do anything right now thinking about removing it
##iteration="0"

thumbs="$(pwd)/thumbs"
mkdir "$thumbs"

for i in "${audio_List[@]}"
do
    # what iteration are we on?
    ##iteration=$((iteration + 1))

    # input="$i"
    fileName=$(basename -- "$i")
    name="${fileName%.*}"
    ext="${fileName##*.}"

    # remove the root folder for all the music/audios
    path="$(dirname "$i" | sed "s/$audioFolder//")"
    echo "$path"

    mkdir --parents "$thumbs/$path"

    # switch the output name to change what image format you want
    # the smallest rested filesize is from AVIF but is very slow
    # a sane default might be webp with the smallest size and one of the faster compression times
    # output="$name.png"
    # output="$name.avif"
    # output="$name.jpg"
    #output="$name.webp"

    output="$name.jxl" # this doesnt work yet because libjxl doesnt have a stable release. so a work around must be used instead
    # the JXL workaround had worse compression then everything above

    # use ffprobe here to figure out the length of the audio file
    length=$(ffprobe -i "$i" |& awk '/Duration/ {print $2}' | sed 's/00://;s/\..\{2\},//')
    artist=$(ffprobe -i "$i" |& awk -F" " '/ artist / {$1=$2="";print $0}' | sed 's/^[[:space:]]*//')
    album=$(ffprobe -i "$i" |& awk -F" " '/ album / {$1=$2="";print $0}' | sed 's/^[[:space:]]*//')

    search="$name $artist $album"

    # Generate the Waveform
    res="1280x720" # change me for different resolution
    #ffmpeg -n -i "$i" -f lavfi -i color=c=black:s=640x320 -filter_complex "[0:a]showwavespic=s=640x320:colors=white[fg];[1:v][fg]overlay=format=auto" -frames:v 1 "$thumbs/$output" &> /dev/null
    ffmpeg -n -i "$i" -f lavfi -i color=c=black:s=$res -filter_complex "[0:a]showwavespic=s=$res:colors=white[fg];[1:v][fg]overlay=format=auto" -c:v libjxl -frames:v 1 "$thumbs/$path/$output" # &> /dev/null
#-update 
    # current workaround using imagemagic to support jxl
    #convert "$thumbs/$output" "$thumbs/$name.jxl"
    #rm "$thumbs/$output" 
    #output="$name.jxl"


    # Upload the data to the Server
    # --data-urlencode allows symbols to be uploaded to without crashing the database
    curl --data-urlencode name="$name" \
        --data-urlencode fileName="$(echo $i | sed "s/$audioFolder//")" \
        --data-urlencode waveform="$path/$output" \
        --data-urlencode artist="$artist" \
        --data-urlencode album="$album" \
        --data-urlencode search="$search" \
        --data-urlencode length="$length" \
        --data-urlencode rating=-1 \
        -X POST http://localhost:3000/db/create

    echo "{\"name\": \"$name\", \"artist\": \"$artist\", \"fileName\": \"$input\", \"waveform\": \"$output\", \"length\": \"$length\", \"rating\": \"-1\"}"

done
exit