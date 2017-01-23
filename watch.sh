#!/bin/sh

NOTIFY="${NOTIFY:-echo}"
EXTS="${EXTS:-js}"

ROOT=$(dirname "$0")

MOD_FILE="${ROOT}/._mod_file_$$"
LOOP_FILE="${ROOT}/._loop_file_$$"
touch ${MOD_FILE}

while [[ true ]]
do
  touch ${LOOP_FILE}
  CHANGES=$(find "$@" -type f -newer ${MOD_FILE} | egrep "\.(${EXTS//[,; ]/|})$")
  if [[ $CHANGES ]]
  then
    mv -f ${LOOP_FILE} ${MOD_FILE}
    ${NOTIFY} "${CHANGES}" &
  fi
  sleep ${SLEEP:-1}
done
