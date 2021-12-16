mkdir -p dist/lib
mkdir -p dist/src
cp node_modules/todomvc-common/base.css dist/lib/
cp node_modules/todomvc-app-css/index.css dist/lib/
cp node_modules/todomvc-common/base.js dist/lib/
cp node_modules/react/dist/react-with-addons.js dist/lib/
cp node_modules/classnames/index.js dist/lib/classnames.js
cp node_modules/react/dist/JSXTransformer.js dist/lib/
cp node_modules/director/build/director.js dist/lib/
cp node_modules/orbit-db/dist/orbitdb.min.js dist/lib/
cp node_modules/ipfs/dist/index.min.js dist/lib/ipfs.min.js
cp -R src/ dist/src
cp index.dist.html dist/index.html
