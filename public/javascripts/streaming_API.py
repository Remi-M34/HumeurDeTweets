#!/usr/bin/env python3
#-*- coding: utf-8 -*-
from __future__ import print_function
import tweepy
import json
import pymongo
from pymongo import MongoClient
import sys,os,re,string

MONGO_HOST= 'mongodb://humeurdetweets:3BCbQNP5stAwDZLw@cluster0-shard-00-00-grg0y.mongodb.net:27017,cluster0-shard-00-01-grg0y.mongodb.net:27017,cluster0-shard-00-02-grg0y.mongodb.net:27017/twitterdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
client = pymongo.MongoClient(MONGO_HOST)
db = client.twitterdb

dico = []
print("Récupération en cours....")
for i in db.keywords.find():
    dico.append(i['keyword'])



WORDS = dico

CONSUMER_KEY = "LpIh8UFClODKCCPOk7oOaiP2z"
CONSUMER_SECRET = "VFiecZf2rfDNYhY4m1QsCEIWhy3fC5Idz6ji0wLiwzQ7HhFsYg"
ACCESS_TOKEN = "709518086978850817-E9kFUKqUrVSzyhZVHYKPDSCRFTkzOyr"
ACCESS_TOKEN_SECRET = "W7HoG7UC1m87wEmlFdBcJ9WWvrzgNvnB6YFYClgE35jGC"

class StreamListener(tweepy.StreamListener):    
    #This is a class provided by tweepy to access the Twitter Streaming API. 

    counter = 0
    num_tweets_to_grab = 100
        
        
    def on_connect(self):
        # Called initially to connect to the Streaming API
        print("You are now connected to the streaming API.")
 
    def on_error(self, status_code):
        # On error - if an error occurs, display the error / status code
        print('An Error has occured: ' + repr(status_code))
        return False
 
    def on_data(self, data):
        #This is the meat of the script...it connects to your mongoDB and stores the tweet
        try:
            client = MongoClient(MONGO_HOST)
            
            # Use twitterdb database. If it doesn't exist, it will be created.
            db = client.twitterdb
    
            # Decode the JSON from Twitter
            datajson = json.loads(data)
            
            # On precise que le tweet n'a pas encore été analysé
            datajson["analyse"] = False
            
            #grab the 'created_at' data from the Tweet to use for display
            created_at = datajson['created_at']

            del datajson['contributors']
            del datajson['in_reply_to_status_id']
            del datajson['reply_count']
            del datajson['favorite_count']
            del datajson['retweet_count']
            del datajson['favorited']
            del datajson['in_reply_to_user_id_str']
            del datajson['place']
            del datajson['in_reply_to_status_id_str']
            del datajson['filter_level']
            del datajson['coordinates']

            user = datajson['user']
            name = user['name']
            lang = datajson['lang']
            text = datajson['text']
            if re.match(r"RT",text):
                return
 
            self.counter += 1
            if self.counter > self.num_tweets_to_grab:
                return False
                
            #print out a message to the screen that we have collected a tweet
            print("Tweet de  " + format(name.encode('utf-8'),'>25') + "\tposté le   " + str(created_at) + "\ten " + str(lang.upper()) + "\tenregistré")
            # print(text + "\n")
            #insert the data into the mongoDB into a collection called twitter_search
            #if twitter_search doesn't exist, it will be created.
            datajson['tweet_corrige'] = " "
            datajson['utilisateurs'] = {}
            datajson['signalements'] = 0
            datajson['evaluations'] = 0

            if datajson['truncated'] == False:
                datajson['tweet_complet'] = datajson['text']
            else:
                datajson["tweet_complet"] = datajson['extended_tweet']['full_text']
            db.twitter_search.insert(datajson)

        except Exception as e:
           print(e)




auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
#Set up the listener. The 'wait_on_rate_limit=True' is needed to help with Twitter API rate limiting.
listener = StreamListener(api=tweepy.API(wait_on_rate_limit=True)) 
streamer = tweepy.Stream(auth=auth, listener=listener)
print("Tracking" + str(WORDS))
streamer.filter(track=WORDS)