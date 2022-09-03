from flask import Flask

app = Flask(__name__)

@app.route('/')
def landing_page():
  return 'Landing page example'

@app.route('/app')
def main_app():
  return 'Lecture Manager App'

if __name__ == '__main__':
  app.run()