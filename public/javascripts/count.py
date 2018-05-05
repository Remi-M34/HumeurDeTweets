#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
from pymongo import MongoClient
import sys,os,re,string
import pandas as pd  


MONGO_HOST= 'mongodb://31.207.34.34:27017'
client = MongoClient(MONGO_HOST)

db = client.twitterdb

print(db.twitter_search.count())