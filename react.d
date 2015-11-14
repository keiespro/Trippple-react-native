#!/bin/bash
DEBUG=* \
./node_modules/react-native/packager/packager.sh --platform=ios\
                                                 --entry-file=./index.ios.js\
                                                 --bundle-output=./main.jsbundle\
                                                 --root=./
                                                 --asset-roots=./
                                                 --dev=true
