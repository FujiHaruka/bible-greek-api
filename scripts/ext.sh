#!/bin/sh
#
# Prepare external repositories

cd `dirname $0`/../ext

git clone https://github.com/biblicalhumanities/greek-new-testament.git
git clone https://github.com/openscriptures/strongs.git

# ないので
echo 'module.exports = strongsGreekDictionary' >> ext/strongs/greek/strongs-greek-dictionary.js
