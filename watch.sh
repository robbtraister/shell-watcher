#!/bin/sh

NOTIFY="${NOTIFY:-echo}"
EXTS="${EXTS:-js}"

(
  cd $(dirname "$0")

  rm -rf ./._this_time
  touch ./._last_mod

  while [[ true ]]
  do
    touch ./._this_time
    CHANGES=$(find "$@" -type f -newer ./._last_mod | egrep "\.(${EXTS//[,; ]/|})$")
    if [[ $CHANGES ]]
    then
      mv -f ./._this_time ./._last_mod
      ${NOTIFY} "${CHANGES}" &
    fi
    sleep ${SLEEP:-1}
  done
)
