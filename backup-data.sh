#!/bin/bash

DATE=`date -Iminutes`
TARBALL=`pwd`/backups/userFiles$DATE.tgz

# keep the userFiles/ dir IN THE TARBALL
cd server
echo "Tarballing userFiles folder..."
tar -czf $TARBALL userFiles
echo "Transferring to cs server..."
rsync -aPz --no-motd $TARBALL msherman@cs.uml.edu:~/snapshot-backup


#rsync takes too long with giant database files, resort back to tarballs
# syncing the database is ok. THat's just one file, and there's no reason to every have multiple
#rsync -aPz server/userFiles msherman@cs.uml.edu:~/snapshot-backup
echo "Syncing usermap to cs server..."
rsync -aPz usermap.sqlite3 msherman@cs.uml.edu:~/snapshot-backup
 
