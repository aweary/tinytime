uglify:
	./node_modules/.bin/uglifyjs dist/tinytime.js -cm toplevel -o dist/tinytime.min.js -p relative --source-map dist/tinytime.js.map
	./node_modules/.bin/uglifyjs dist/tinytime.umd.js -cm toplevel -o dist/tinytime.umd.min.js -p relative --source-map dist/tinytime.umd.js.map