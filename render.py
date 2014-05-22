#!/usr/bin/env python

import json
import shutil
import os
import re
import argparse

pwd = os.path.abspath(os.path.dirname(__file__))


def render(template_name, template_dict):
    with open(pwd + '/templates/' + template_name) as template:
        tmpl = template.read()
        for key, val in template_dict.items():
            tmpl = re.sub('{{\s+?%s\s+?}}' % key, val, tmpl)
    return tmpl


def copy_and_overwrite(from_path, to_path):
    if os.path.exists(to_path):
        shutil.rmtree(to_path)
    shutil.copytree(from_path, to_path)


def main(config=None):
    """
    Reads config.json and generates a build directory with
    a deployable copy of a responsive table based on your
    Google Drive spreadsheet.
    """
    try:
        if config:
            config_file = pwd + '/configs/' + config + '.json'
        else:
            config_file = 'config.json'

        with open(config_file, 'r') as f:
            config = json.loads(f.read())

            copy_and_overwrite(pwd + '/assets/', pwd + '/build/')

            rendered = render('index.html', {
                    'ua_code': config['ua_code'],
                    'title': config['title'],
                    'key': config['key'],
                    'columns': json.dumps(config['columns']),
                })

            if not os.path.exists(pwd + '/build'):
                os.makedirs(pwd + '/build')

            with open(pwd + '/build/index.html', 'w+') as index:
                index.write(rendered)
    except IOError:
        print "Missing config.json! Please copy config.example.json to " \
        "config.json and fill in the appropriate values for your spreadsheet."
        exit(1)

    print "Done!"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Reads config.json and generates a build directory with'
            'a deployable copy of a responsive table based on your'
            'Google Drive spreadsheet.')

    parser.add_argument(
        '-c', '--config', dest='config', type=str,
        help='Specify the slug of a config file stored in the configs directory (e.g. ./render.py -c discounts)')

    parser.set_defaults(**{ 'config': None })
    args = parser.parse_args()
    main(config=args.config)
