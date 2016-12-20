#!/bin/bash
date=$(date +"%Y-%m-%d-%H_%M_%S")
mv nohup.out nohup.out.$date

exec nohup npm start &
