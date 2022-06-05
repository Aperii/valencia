#!/bin/bash

# Fetch latest changes
git fetch origin

# Get the changes
declare changes="$(git log HEAD..origin/main --oneline)"

declare pidRegex="pid=([0-9]+)"

#Check if there are any changes
if [ -z "$changes" ]
then
    echo "No changes present"
else
    echo "Found remote changes, pulling from source..."
    git pull origin main
    echo "Restarting the api..."
    declare foundProcesses=$(sudo ss -lptn 'sport = :80')
    if [[ $foundProcesses =~ $pidRegex ]]
    then
        declare pid="${BASH_REMATCH[1]}"
        echo "Killing $pid"
        sudo kill $pid
        echo "Starting..."
        sudo npm start
    else
        echo "Starting..."
        sudo npm start
    fi
fi