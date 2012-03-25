# Quill

Quill is a simple blog engine inspired by
[Jekyll](https://github.com/mojombo/jekyll). Quill runs on
[node](http://nodejs.org/) and has
an easy command line interface. Themeing is as simple as editing a single html page.

## Installing & Deployment

You can install Quill using the npm package manager.  Just type:

    npm install quill -g

Now, we have access to the quill command.  We can start a new blog by typing:

    quill new my_new_blog

This will create a new folder in the specified path where our blog will live.
Lets start by making a post.

    cd my_new_blog
    quill post "My First Post"

This will create a post file in the `posts/` directory which is prefixed by the
current timestamp.  All post files are written in
[Markdown](http://daringfireball.net/projects/markdown/syntax) and will
compile to static HTML.

To deploy the site we are going to use 
[Nodejitsu](http://nodejitsu.com/).  Instructions on setting up their
commandline tool Jitsu can be found
[here](https://github.com/nodejitsu/jitsu).  Once you have jitsu set up it is
as simple as typing:

    jitsu deploy

### Local development

If you want to edit your themes locally, you can run the quill server by
typing:

    npm install
    node quill

Now you can navigate to `http://localhost:8000` and see your blog while you
edit it.  __Note__: You have to restart the server when you make changes to
see them.
