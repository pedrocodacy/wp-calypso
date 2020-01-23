# Full Site Editing

This app contains:

* `full-site-editing-plugin` - this is a master Plugin containing:
  - `blog-posts-block` Plugin
  - `full-site-editing` Plugin
  - `posts-list-block` Plugin
  - `starter-page-templates` Plugin
  - `blog-posts-block` Plugin

## Local Development Environment
We are using the `@wordpress/scripts` package for the most convenient development experience. For the local setup, we'll initialize a docker instance for running WordPress.

### 1: Getting a WordPress copy

Before doing this, make sure you have Docker installed and running. :)

By default, the env command will download a version of WordPress directly to the
plugin location on your machine. In our case, this is `apps/full-site-editing/wordpress`. This works great, and you can run this command to setup the Docker instance with that method:

```sh
# run from wp-calypso root. lerna version of `npm run env connect`
npx lerna run env --scope='@automattic/full-site-editing' --stream -- install
```

At this point, you should be able to access WordPress at `localhost:9999`. The username is `admin` and the password is `password`.

## Tests
Automated tests are an important part of our deploy process, making sure that everything is working smoothly before deplpoyment.

### phpunit
Assuming you have setup your local WordPress copy using the env install script (see above), you can run phpunit tests with the following command:

```sh
# Runs phpunit in the WordPress Docker install
npx lerna run env --scope='@automattic/full-site-editing' --stream -- test-php
```

Each submodule of the FSE plugin (i.e. FSE, global styles, SPT) should have a phpunit directory like so: `full-site-editing/phpunit`. If you're creating tests for a submodule that doesn't have them yet, create that directory, and then add a new test suite to `full-site-editing-plulgin/phpunit.xml.dist` with this format:

```xml
	<testsuites>
	...
		<testsuite name="Submodule Name">
			<directory suffix="-test.php">./submodule-directory/phpunit/</directory>
		</testsuite>
	...
  </testsuites>
```

Then, create test files in that directory with this filename: `class-your-class-name-test.php`. The test class itself should look like `Your_Class_Name_Test` (to fit WordPress style standards).

If you need to test other functionality, you may need to modify the bootstrap file, which can be found in `full-site-editing-plulgin/bin/phpunit-bootstrap.php`

## File Architecture

```
/full-site-editing-plugin
  /dist
    full-site-editing-plugin.css
    full-site-editing-plugin.asset.php
    full-site-editing-plugin.js
    full-site-editing-plugin.rtl.css
  class-a8c-rest-template-controller.php
  class-full-site-editing.php
  index.js
  index.scss

/posts-list-block
  /blocks
    /posts-list
      block.json
      index.js
      style.scss
  /dist
    a8c-posts-list.css
    a8c-posts-list.asset.php
    a8c-posts-list.js
    a8c-posts-list.rtl.css
  /templates
    no-posts.php
    post-item.php
    posts-list.php
  class-posts-list-block.php
  index.js
  utils.php
```

## Build System

Note: these scripts must be run from the Calypso _root_ directory.

- `npx lerna run dev --scope='@automattic/full-site-editing'`<br>
Compiles the plugins and watches for changes.

- `npx lerna run build --scope='@automattic/full-site-editing'`<br>
Compiles and minifies the plugins for production.

Both these scripts will also move all source and PHP files into `/dist` in their respective folders.

The entry point is:

- __Plugin__: `/full-site-editing-plugin/{{plugin-directory}}/index.js`

The output is:

- __Plugin__: `/full-site-editing-plugin/{{plugin-directory}}/dist`

### Building Individual _Plugins_

You can also build one of the Plugins separately by appending the plugin slug onto the `build` portion of the command. eg: 

```
// Builds the `posts-list-block` Plugin only
npx lerna run build:posts-list-block --scope='@automattic/full-site-editing'`
```

## Local Development

Build (or `run dev`) and symlink the plugin into a local WordPress install.

E.g.

```
npx lerna run build --scope='@automattic/full-site-editing'

ln -s ~/Dev/wp-calypso/apps/full-site-editing/full-site-editing-plugin/ ~/Dev/wordpress/wp-content/plugins/full-site-editing-plugin
```

Note that if you are using Docker symlinks will not work. Instead you will need to mount the Plugin as a volume.
