from __future__ import print_function
import tweepy
import json
from pymongo import MongoClient
import sys,os,re,string
from pprint import pprint
from sklearn.feature_extraction.text import CountVectorizer
import requests
import pandas as pd  
import csv
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import sys
reload(sys)
sys.setdefaultencoding('utf8')

image = open("cloud.jpg","w")

image.close()
