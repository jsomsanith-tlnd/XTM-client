#!/bin/sh

UI_FOLDER=/Users/jsomsanith/Documents/workspace/ui
XTM_FOLDER=/Users/jsomsanith/Documents/workspace/xtm

echo 'Extracting Talend/ui translations...'
cd $UI_FOLDER
yarn > talend_ui_build.log && yarn extract-i18n > talend_ui_extraction.log
zip -r i18n.zip i18n/
echo "Successful extraction to $UI_FOLDER/i18n.zip"
echo

cd $XTM_FOLDER
yarn upload -f $UI_FOLDER/i18n.zip
