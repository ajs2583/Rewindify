import os
from datetime import date
from flask import Flask, render_template
from backend.app.routes import api as api_blueprint


def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.register_blueprint(api_blueprint)

    @app.context_processor
    def inject_globals():
        return {'client_id': os.getenv('CLIENT_ID')}

    @app.route('/')
    def home():
        return render_template('home.html', max_date=date.today().isoformat())

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/contact')
    def contact():
        return render_template('contact.html')

    @app.route('/privacy-policy')
    def privacy_policy():
        return render_template('privacy_policy.html')

    return app


if __name__ == '__main__':
    create_app().run(debug=True)
