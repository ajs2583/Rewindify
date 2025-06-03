from flask import Blueprint, render_template
import os
from datetime import date

web = Blueprint('web', __name__)

@web.context_processor
def inject_globals():
    return {
        'current_date': date.today().isoformat(),
        'spotify_client_id': os.getenv('CLIENT_ID', '')
    }

@web.route('/')
@web.route('/home')
def home():
    return render_template('home.html')

@web.route('/about')
def about():
    return render_template('about.html')

@web.route('/contact')
def contact():
    return render_template('contact.html')

@web.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy_policy.html')
