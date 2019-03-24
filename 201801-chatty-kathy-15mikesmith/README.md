# Chatty Kathy -- <Replace with your name>

Name: Michael Smith
Pitt ID: 4028362

## Installation

1. Instructions to get your code up and running.
Download all code, all HTML files should be in templates folder and all JS files should be in the static folder.
Assume there is NO Database is created yet.
You will need the following python packages from flask import json, session, SQLAlchemy, Flask, render_template, redirect, url_for, request

## Running the App

1. Instructions to run your application.

I am assuming that the flask app is NOT being tested with multiple user sessions in the SAME browser.
 Since the app automatically assume the same session and modifications to one affect the other.
 I tested using different different browsers(Chrome,Firefox) for the two different users.
 That way the session object wouldn't be shared overwritten by one user

 To run the application, run the chat.py file
