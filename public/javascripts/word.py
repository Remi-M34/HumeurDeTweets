#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
import pymongo
from pymongo import MongoClient
import sys,os,re,string
import pandas as pd  
from wordcloud import WordCloud
import matplotlib.pyplot as plt

MONGO_HOST= 'mongodb://humeurdetweets:3BCbQNP5stAwDZLw@cluster0-shard-00-00-grg0y.mongodb.net:27017,cluster0-shard-00-01-grg0y.mongodb.net:27017,cluster0-shard-00-02-grg0y.mongodb.net:27017/twitterdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
client = pymongo.MongoClient(MONGO_HOST)


db = client.twitterdb

dico = []
nb = 0
print("Analyse en cours....")
for i in db.tweets_positifs.find():
    if (i['tweet_corrige'] != " "):
        dico.append(i['tweet_corrige'])
        nb = nb+1
for i in db.tweets_negatifs.find():
    if (i['tweet_corrige'] != " "):
        dico.append(i['tweet_corrige'])
        nb = nb+1
for i in db.tweets_neutres.find():
    if (i['tweet_corrige'] != " "):
        dico.append(i['tweet_corrige'])
        nb = nb+1
for i in db.twitter_search.find():
    if (i['tweet_corrige'] != " "):
        dico.append(i['tweet_corrige'])
        nb = nb+1

if (nb > 1):
    dico = pd.Series(dico).str.cat(sep=' ')
    wordcloud = WordCloud(width=885, height=270,max_font_size=200).generate(dico)
    image = open("public/images/cloud.png","w")
    wordcloud.to_file(image)
    print("Image enregistree sous  cloud.jpg")
    image.close()