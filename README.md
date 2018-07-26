# XTM Client

## xtm.js

This is a js script that will orchestrate XTM api calls to upload files to XTM project.

It needs some dependencies
```
> yarn
```

To upload files to XTM project, you need to pass the path to the file to upload.
```
> yarn upload -f /path/to/file
```

To download tarnslations from XTM project, you need to pass the target folder path.
```
> yarn download -p /target/path
```

## For Talend/ui : xtm.sh

This is a shell script that will run Talend/ui i18n extract, and run the xtm files upload script.

```
> ./xtm.sh
```
