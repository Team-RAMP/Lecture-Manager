import os
from main import app, static_folder
from pathlib import Path

# Move to static folder of the app
os.chdir(static_folder)

# Create/overwrite file endpoints containing all the endpoints of the website
# - Our entire website is designed to be static in nature
with open("endpoints", "w+") as file:
    for route in app.url_map.iter_rules():
        if '<' not in str(route): file.write(f"{route}\n")
    for apath in Path('.').rglob('*'):
        if not os.path.isfile(apath): continue

        path_str = str(os.path.relpath(apath)).replace('\\', '/')
        if not path_str.startswith('.'):
            file.write(f"/{path_str}\n")