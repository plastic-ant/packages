#!/usr/bin/env bash

if [[ -f $1/.env.local ]]
then
    exit 0
fi
{
    echo "#############################################################"
    echo "ERROR: Missing .env.local, please check README.md for details"
    echo "#############################################################"
} >&2

exit 1

