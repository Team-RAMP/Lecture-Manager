from flask import Flask, render_template, abort
import jinja2
import os

project_root = os.path.dirname(__file__)
static_folder = os.path.join(project_root, 'assets')
template_path = os.path.join(project_root, 'templates')
app = Flask(__name__, template_folder=template_path, static_folder=static_folder, static_url_path='/')

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

@app.route('/forgot-password')
def forgot_password():
  return render_template('forgot-password.html')

@app.route('/charts')
def load_charts_page():
  return render_template('charts.html')

@app.route('/cards')
def load_cards_page():
  return render_template('cards.html')

@app.route('/buttons')
def load_buttons_page():
  return render_template('buttons.html')

@app.route('/tables')
def load_tables_page():
  return render_template('tables.html')

@app.route('/blank')
def load_blank_page():
  return render_template('blank.html')

@app.route('/mark-attendance')
def load_mark_page():
  return render_template('mark-attendance.html')

@app.route('/timetables')
def load_timetables_page():
  return render_template('timetables.html')

@app.route('/notes')
def load_notes_page():
  return render_template('notes.html')

@app.route('/utilities-<name>')
def load_utilities_page(name):
  try:
    return render_template(f'utilities-{name}.html')
  except jinja2.exceptions.TemplateNotFound:
    return abort(404)

@app.errorhandler(404)
def not_found_handler(e):
  return render_template('404.html'), 404

if __name__ == '__main__':
  app.run()
