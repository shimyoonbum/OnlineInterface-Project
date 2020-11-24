#!/bin/sh
#
# Ussage :
#       service OnlineIFClient start
#       service OnlineIFClient stop
#       service OnlineIFClient restart

SERVICE_NAME=OnlineIFClient

function start_process() {
        echo "Starting $SERVICE_NAME ..."
        nohup node OnlineIFClient.js 2>> /dev/null >> /dev/null &
        echo "$SERVICE_NAME started ..."
}

function kill_process() {
        PIDS=`ps -ef|grep OnlineIFClient|grep -v grep|awk '{print $2}'`

        echo "$SERVICE_NAME stoping ..."
        for PID in $PIDS; do
                kill $PID
        done
        echo "$SERVICE_NAME stopped ..."
}

case $1 in
    start)
        start_process;
    ;;
    stop)
        kill_process;
    ;;
    restart)
        kill_process;
        sleep 3;
        start_process;
    ;;
esac
