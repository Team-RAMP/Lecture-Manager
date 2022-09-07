from flask import Flask, render_template
import os

project_root = os.path.dirname(__file__)
static_folder = os.path.join(project_root, 'assets')
template_path = os.path.join(project_root, 'templates')
app = Flask(__name__, template_folder=template_path, static_folder=static_folder)

@app.route('/')
def landing_page():
  return render_template('index.html')

@app.route('/app')
def main_app():
  return render_template('dashboard.html')

@app.route('/login')
def user_login():
  return render_template('login.html')

@app.route('/register')
def user_registration():
  return render_template('register.html')

if __name__ == '__main__':
  app.run()