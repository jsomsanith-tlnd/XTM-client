#!/bin/sh

UI_FOLDER=/Users/jsomsanith/Documents/workspace/ui
XTM_FOLDER=/Users/jsomsanith/Documents/workspace/xtm

cd $UI_FOLDER
#yarn && yarn extract-i18n
zip -r i18n.zip i18n/

cd $XTM_FOLDER
yarn upload -f $UI_FOLDER/i18n.zip
