#!/bin/bash
SESH="TripppleClient"

tmux has-session -t $PROJECT_NAME 2>/dev/null
if [ "$?" -eq 1 ] ; then
    echo "No Session found.  Creating and configuring."
    tmux new-session -d -s $SESH
    tmux new-window
    tmux split-window -h
    tmux select-pane -t 0
    tmux send-keys "npm run integration-tests" C-m
    tmux select-pane -t 1
    tmux send-keys "npm run appium" C-m
    tmux split-window -v
    tmux select-pane -t 0
    tmux send-keys "npm start" C-m

    tmux attach-session -t $SESH

else
    echo "Session found.  Connecting."
    tmux attach-session -t $SESH
fi
