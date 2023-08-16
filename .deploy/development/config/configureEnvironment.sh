#!/bin/sh

# Abort if no environment variable was passed
if [ "$#" -ne 1 ]; then
    exit 1
fi


# Prepare. This is the environment for LOCALHOST, so it needs to go.
rm -f /usr/share/nginx/html/environment.json

mv /usr/share/nginx/html/environments/development.json /usr/share/nginx/html/environment.json

SUPPORT_SAS_DATA=$(echo $1 | sed 's|\&|\\&|g')
sed -i 's|SUPPORT_SAS_VALUE|'"$SUPPORT_SAS_DATA"'|g' /usr/share/nginx/html/environment.json

# These can now be safely deleted
rm -rf /usr/share/nginx/html/environments

VERSION_NUMBER=${UI_UIFRONTEND_VERSION}
sed -i 's/BUILD_VERSION'"/$VERSION_NUMBER/g" /usr/share/nginx/html/index.html
