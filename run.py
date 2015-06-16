__author__ = 'sam.royston'
from flask import Flask, request, render_template
from datastore import db

app = Flask(__name__)

@app.route("/graph/<name>")
def draw_graph(name):
    """
    get graph view from database range
    """
    render_template('graph.html')


if __name__ == '__main__':
    app.run()