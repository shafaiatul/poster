## Introduction

	Generate poster image for Facebook.

## Installation

	npm install
	bower install

## Development

	broccoli serve --host 0.0.0.0 --port 8080 --live-reload-port 35729

Now, browse to the following URL:

	http://localhost:8080/

## Deploy

	rm -rf dist && BROCCOLI_ENV=production broccoli build dist
