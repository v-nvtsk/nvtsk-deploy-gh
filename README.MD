# Deploy to github-pages
[![NPM](https://nodei.co/npm/nvtsk-deploy-gh.png)](https://www.npmjs.com/package/nvtsk-deploy-gh)

[![Node.js Package](https://github.com/v-nvtsk/otus-jsbasic-dz50-nodejs/actions/workflows/npm-deploy.yml/badge.svg)](https://github.com/v-nvtsk/otus-jsbasic-dz50-nodejs/actions/workflows/npm-deploy.yml)
![NPM Version](https://img.shields.io/npm/v/nvtsk-deploy-gh)
![GitHub repo size](https://img.shields.io/github/repo-size/v-nvtsk/otus-jsbasic-dz50-nodejs)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/nvtsk-deploy-gh)

[![Lint and Test](https://github.com/v-nvtsk/otus-jsbasic-dz50-nodejs/actions/workflows/lint-test.yaml/badge.svg)](https://github.com/v-nvtsk/otus-jsbasic-dz50-nodejs/actions/workflows/lint-test.yaml)
![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2Fv-nvtsk%2Ff9b687636482339cabd6a8c4b369f3eb%2Fraw%2F772fcddd8351230f0f3c307f37baf87361a66fc3%2Fotus-jsbasic-final-react-junit-tests.json)

---

> cli application for deploy to github-pages

## Usage

Allows to declare build command to build project and require directory name where built project will be.
If build is not need it will just use directory with ready build.

Run with dialog:

```sh
npx nvtsk-deploy-gh
```

![alt text](images/dialog.gif)

Run with command-line arguments

```sh
npx nvtsk-deploy-gh --build "npm run build" --dir dist
```

## npm package settings

`package.json`

```json
  "name": "nvtsk-deploy-gh",
  "version": "1.0.2",
  "main": "./dist/index.js",
  "bin": {
    "nvtsk-deploy-gh": "dist/index.js"
  },
  "types": "./dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/v-nvtsk/otus-jsbasic-dz50-nodejs.git"
  },
```

Deploy to npmjs with github-action workflow. 
Distributive entry-point file with bundle is prepended with a line with shebang which runs js file in node.js
```sh
#!/usr/bin/env -S node

/*! For license information please see index.js.LICENSE.txt */
(()=>{var e,t,r,n,i={36776:(e,t,r)=>{"use strict";var n=r(2203).Stream,i=r(88179);function o(e,t,r){var o=i(e||function(e){this.
...
```


## Used algorithm

_`./dist` is used here as an example path_

1. Make sure you are on the branch that contains the "dist/" directory you want to publish, or on the branch that is able to build:

2. Stash the contents of the "dist/" directory:

```sh
git add dist
git stash push --keep-index
```

3. If the gh-pages branch does not exist, create it:

```sh
git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "Initializing gh-pages branch"
git push -u origin gh-pages
```

1. Check out the gh-pages branch

```sh
git checkout gh-pages
```

5. Apply the stash that contains your "dist/" directory (this will restore the "dist/" directory):

```sh
git stash pop
```

6. Stage "dist/" directory and move the contents of the "dist/" directory to the root of the repository:

```sh
git add dist
git mv -f dist/* .
git reset HEAD -- dist
```

7. Add all the new files to the gh-pages branch, commit, and push to GitHub;

```sh
git commit -m "deploy"
git push origin gh-pages
```

## GIF made with `asciinema`

### Installation - asciinema docs

[asciinema docs](https://docs.asciinema.org/)

```sh
install asciinema

```

asciinema creates cast files from terminal.
agg is instrument to create gifs from cast files.

Visit [latest release](https://github.com/asciinema/agg/releases/latest) page, and download a binary appropriate for your system.

For 64-bit x86 system choose a file with `x86_64` in the name. For ARMv8 (64-bit, e.g. Apple Silicon) choose a file with `aarch64`. For ARMv7 (32-bit, e.g. Raspberry Pi) choose a file with `arm`.

Make it executable and put it somewhere in `$PATH`:

````sh
chmod a+x agg
sudo mv agg /usr/local/bin```
````

start rec to your_script_name.cast cast-file

```sh
asciinema rec ./your_script_name.cast
```

convert cast-file to gif your_gif_file.gif

```sh
agg ./your_script_name.cast ./your_gif_file.gif
```
