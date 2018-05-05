#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
import json
import nltk
import pymongo
from pymongo import MongoClient
import sys,os,re,string
from pprint import pprint
from sklearn.feature_extraction.text import CountVectorizer
import requests
import pandas as pd  
import csv

MONGO_HOST= 'mongodb://humeurdetweets:3BCbQNP5stAwDZLw@cluster0-shard-00-00-grg0y.mongodb.net:27017,cluster0-shard-00-01-grg0y.mongodb.net:27017,cluster0-shard-00-02-grg0y.mongodb.net:27017/twitterdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
client = pymongo.MongoClient(MONGO_HOST)


db = client.twitterdb
collection = db.twitter_search

# tokens = nltk.word_tokenize(text.lower())
# tags = nltk.pos_tag(tokens)
# verbes_et_adjectifs = [word for word,pos in tags if (pos == 'VBP' or pos == 'VBZ' or pos == 'JJ')]
# print(tags)
# print(verbes_et_adjectifs)


for t in collection.find():
    tweet_corrige = ""
    tokens = nltk.word_tokenize(t['tweet_complet'].lower())
    tags = nltk.pos_tag(tokens)
    tweet_corrige = [word for word,pos in tags if (pos == 'VBP' or pos == 'VBZ' or pos == 'JJ')]

    for word in tweet_corrige:
        if word == '@':
            tweet_corrige.remove(word)
    tweet_corrige = list(set(tweet_corrige))        

    collection.find_one_and_update(
        {"_id": t["_id"]}, 
        {"$set": {"tweet_corrige": tweet_corrige}})
