#!/bin/bash
cd /home/admsrv/dev/golf_pay/
pwd
su admsrv -c "source ./golf_pay/bin/activate"
pwd
gunicorn --bind 0.0.0.0:90 wsgi:app


