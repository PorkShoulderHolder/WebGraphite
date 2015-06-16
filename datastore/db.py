"""Handles communication with s3 database containing gexf (xml) documents

S3 paths should be of the form ../<name>_<unix_time> according to a user specified name and the unix time
corresponding to when the model was harvested.
"""

__author__ = 'sam.royston'


import yaml
from boto.s3.connection import S3Connection
from boto.s3.key import Key

with open('credentials.yaml') as f:
    config = yaml.load(f)

    _AWS_ACCESS = config["accessKeyId"]
    _AWS_SECRET = config["secretKey"]
    _S3_BUCKET = config["bucketName"]
    print 'connecting to ' + _S3_BUCKET
    conn = S3Connection(_AWS_ACCESS, _AWS_SECRET)
    bucket = conn.get_bucket(_S3_BUCKET)

def key_gen(name,date=""):
    if date is "":
        return "{0}_all"
    else: return "{0}_{1}" , name, date

def add_graph(name, date, xml_string):
    k = Key(bucket)
    k.key = key_gen(name, date)
    k.set_contents_from_string(xml_string)

def get_graph_for_name(name):
    k = Key(bucket)
    k.key = key_gen(name)
    xml_string = k.get_contents_as_string()

def get_timeshift_for_name(name):
    pass