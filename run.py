__author__ = 'sam.royston'
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/graph/<name>")
def draw_graph(name):
    """
    get graph view from database range
    """
    file_name = name if len(name.split('.')) == 2 else name + '.gexf'
    return render_template('graph.html', file_name = file_name)

if __name__ == '__main__':
    app.run(debug=True)