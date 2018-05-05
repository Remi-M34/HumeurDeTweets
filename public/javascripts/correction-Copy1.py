#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
import json
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
coll = ""
collection = ""


collection = db.twitter_search

emoticons_str = r"""
    (?:
        [:=;] # Eyes
        [oO\-]? # Nose (optional)
        [D\)\]\(\]/\\OpP] # Mouth
    )"""

regex_str = [
    emoticons_str,
    r'<[^>]+>',
    r'(?:@[\w_]+)',
    r"(?:\#+[\w_]+[\w\'_\-]*[\w_]+)",
    r'http[s]?://(?:[a-z]|[0-9]|[$-_@.&amp;+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+',
    r'(?:(?:\d+,?)+(?:\.?\d+)?)',
    r"(?:[a-z][a-z'\-_]+[a-z])",
    r'(?:[\w_]+)',
    r'(?:\S)'
]

tokens_re = re.compile(r'('+'|'.join(regex_str)+')', re.VERBOSE | re.IGNORECASE)
emoticon_re = re.compile(r'^'+emoticons_str+'$', re.VERBOSE | re.IGNORECASE)

def tokenize(s):
    return tokens_re.findall(s)

def preprocess(s, lowercase=True):
    tokens = tokenize(s)
    if lowercase:
        tokens = [token if emoticon_re.search(token) else token.lower() for token in tokens]
    return tokens


with open("stopwords.txt", "r") as f:
    liststopwords = []
    for item in f:
        liststopwords += item.split()

pprint(liststopwords)

pat = re.compile(r"(?:@[\w_]+)|(?:\#+[\w_]+[\w\'_\-]*[\w_]+)|http[s]?://(?:[a-z]|[0-9]|[$-_@.&amp;+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+")

for t in collection.find():
    tweet_corrige = ""
    for i in (preprocess(t['tweet_complet'])):
        if re.search(pat,i) or i in liststopwords:
            continue
        i = i.replace("'s", "")
        tweet_corrige += i + " "
    collection.find_one_and_update(
    {"_id": t["_id"]}, 
    {"$set": {"tweet_corrige": tweet_corrige.lower()}})
    pprint(tweet_corrige)

