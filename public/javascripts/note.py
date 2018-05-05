#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
import json
import pymongo
from pymongo import MongoClient
import sys,os,re,string
from pprint import pprint

MONGO_HOST= 'mongodb://humeurdetweets:3BCbQNP5stAwDZLw@cluster0-shard-00-00-grg0y.mongodb.net:27017,cluster0-shard-00-01-grg0y.mongodb.net:27017,cluster0-shard-00-02-grg0y.mongodb.net:27017/twitterdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
client = pymongo.MongoClient(MONGO_HOST)

pprint('un')
db = client.twitterdb
coll = db.twitter_search

id = sys.argv[1]

for t in db.twitter_search.find():
    print(t['user']['screen_name'])

    if (t['id_str'] == sys.argv[1]):
        print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

db.twitter_search.find_one_and_update(
{"id_str": sys.argv[1]}, 
{"$set": {"Personne.GH": "A"}})


pprint(sys.argv[1])

    # db.coll.update(
    # {"_id": t["_id"]}, 
    # {"$set": {"tweet_corrige": tweet_corrige.lower()}})
    # pprint(tweet_corrige)