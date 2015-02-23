/* global require, module, console */
/* jshint quotmark:false */

'use strict';

var fs  = require('fs');
var EOL = require('os').EOL;

var mergeTrees = require('broccoli-merge-trees');
var concatFilesWithSourcemaps = require('broccoli-sourcemap-concat');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');
var unwatchedTree = require('broccoli-unwatched-tree');
var assetRev = require('broccoli-asset-rev');
var replace = require('broccoli-string-replace');
var uglifyJavaScript = require('broccoli-uglify-js');
var cleanCSS = require('broccoli-clean-css');
var env = require('broccoli-env').getEnv();
var Funnel = require('broccoli-funnel');

var LIVERELOAD_PORT = 35729;

var isProduction = env === 'production';

var vendorScripts = [
  'jquery/dist/jquery.js'
];

var vendorStyles = [
  'normalize.css/normalize.css'
];

var options = {};

function init() {
  console.log('Environment = ' + env);
  options.trees = {
    bower: unwatchedTree('bower_components'),
    vendor: fs.existsSync('vendor') ? unwatchedTree('vendor') : null
  };
}

function concatFiles(tree, options) {
  options.sourceMapsForExtensions = isProduction ? [] : ['js'];
  return concatFilesWithSourcemaps(tree, options);
}

function index() {
  // inject live-reload script in `index.html` (non-production environment only)
  tree = injectLiveReload('app', {
    files: ['index.html']
  });

  // take `index.html` and place it at the root
  tree = new Funnel(tree, {
    files: ['index.html']
  });

  return tree;
}

function injectLiveReload(inputTree, options) {
  var liveReloadScript =
    "(function() { " +
    "var src = (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + LIVERELOAD_PORT + "/livereload.js?snipver=1'; " +
    "var script = document.createElement('script'); " +
    "script.type = 'text/javascript'; " +
    "script.src = src; " +
    "document.getElementsByTagName('head')[0].appendChild(script); " +
    "}());";

  var tree = replace(inputTree, {
    files: options.files,
    pattern: {
      match: new RegExp('\\s*<!-- \\[livereload\\] -->'),
      replacement: isProduction ? '' : '<script type="text/javascript">' + liveReloadScript + '</script>'
    }
  });

  return tree;
}

function javascript() {
  var vendor = concatFiles(mergeTrees([options.trees.bower, options.trees.vendor]), {
    inputFiles: vendorScripts,
    outputFile: '/js/vendor.js',
    separator: EOL + ';'
  });
  var app = concatFiles('app', {
    inputFiles: ['**/*.js'],
    outputFile: '/js/app.js'
  });
  var tree = mergeTrees([vendor, app]);
  if (isProduction) {
    tree = uglifyJavaScript(tree);
  }
  return tree;
}

function styles() {
  var vendor = concatFiles(mergeTrees([options.trees.bower, options.trees.vendor]), {
    inputFiles: vendorStyles,
    outputFile: '/css/vendor.css',
    separator: EOL + ';'
  });
  if (isProduction) {
    vendor = cleanCSS(vendor);
  }
  var sassOptions = isProduction ? { outputStyle: 'compressed' } : {};
  var app = compileSass(['app/styles'], 'app.scss', 'css/app.css', sassOptions);
  app = autoprefixer(app);
  return mergeTrees([vendor, app]);
}

function publicTree() {
  var tree = fs.existsSync('public') ? 'public' : null;
  tree = mergeTrees([tree], {
    overwrite: true
  });

  return tree;
}

init();

var tree = mergeTrees([
  index(),
  javascript(),
  styles(),
  publicTree()
]);

// fingerprint assets for production only
if (isProduction) {
  tree = assetRev(tree, {
    extensions: ['js', 'css', 'png', 'jpg', 'gif'],
    exclude: ['fonts', 'apple-touch-icon.png', 'tile.png', 'tile-wide.png'],
    replaceExtensions: ['html', 'js', 'css']
  });
}

module.exports = tree;
