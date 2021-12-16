import sys
sys.path.insert(0, "lib")

from flask import (
    Flask, send_from_directory
)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "123456"
    app.config['UPLOAD_FOLDER'] = "blog/static/upload/"
    app.config['CUSTOM_STATIC_PATH'] = "blog/cdn/"
    
    # Custom static data
    @app.route('/cdn/<path:filename>')
    def custom_static(filename):
        return send_from_directory(app.config['CUSTOM_STATIC_PATH'], filename)
    
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/hi', methods=(('GET',)))
    def hi():
        return 'hi'

    from . import ocr
    app.register_blueprint(ocr.bp)
    
    return app