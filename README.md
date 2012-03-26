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

# Config.json

We configure Quill with [config.json](https://github.com/theycallmeswift/quill/blob/master/config.json).

    {
      "development": true,
      "theme": "bootstrap",
      "name": "Quill",
      "description": "Blogging for Hackers.",
      "blogroll": [
        {
          "title": "Download Quill",
          "url": "https://github.com/theycallmeswift/quill",
          "description": "Get the quill server"
        },
        {
          "title": "Official Docs",
          "url": "https://github.com/theycallmeswift/quill",
          "description": "The official documentation"
        },
        {
          "title": "Follow us on Twitter",
          "url": "http://twitter.com/justquillin",
          "description": "Follow @justquillin on Twitter"
        }
      ]
    }

Here it is line by line:

## Development Flag

    "development": true,                   

You won't care about this unless you're helping to build Quill (please do!). 
      
## Theme

    "theme": "barebones",

What directory the theme is stored in.  ```/themes/[config.theme]/index.html```. Every variable from config.json is passed to the theme. Look at the next section to see how the blog name and description appear.

There are four example themes in this repository, included the theme found at http://justquillin.com.

## Name and Description

The name of the blog and a short blub about it.

    "name": "Quill",
    "description": "Blogging for Hackers.",

In the ***barebones theme*** we render the name and description in an hgroup: 

    <hgroup>
    	{{#if config.name}}
    		<h1 id="blog-title">{{ config.name }}}</h1>
    	{{/if}}
    	{{#if config.description}}
    		<h2 id="blog-description">{{ config.description }}}<h2>
    	{{/if}}
    </hgroup>
      
## Blogroll

The blogroll is an array of objects. These links are also rendered in the template.

    "blogroll": [
        {
          "title": "Download Quill",
          "url": "https://github.com/theycallmeswift/quill",
          "description": "Get the quill server"
        },
        {
          "title": "Official Docs",
          "url": "https://github.com/theycallmeswift/quill",
          "description": "The official documentation"
        },
        {
          "title": "Follow us on Twitter",
          "url": "http://twitter.com/justquillin",
          "description": "Follow @justquillin on Twitter"
        }
    ]
    
Here's an example of how the ***barebones theme*** renders the blogroll:


    {{ #each config.blogroll }}
    	<li><a href="{{ url }}" title="{{ description }}">{{ title }}</a></li>
    {{ /each }}
    
    
# Blog Posts

Blog posts are transformed from markdown into templates. Blog posts start as markdown files in /posts and then get passed to our template (as specified in the config).

These markdown posts are just like the blogroll found in config. Here's an example of how they're styled in the ***barebones theme***:

    {{#posts}}
    	<li>
    		<h3 class="title">{{{ title }}} <small>{{{ timestamp }}}</small></h3>
    		{{{ body }}}
    	</li>
    {{/posts}}
    
The ```{{{ body }}}``` variable outputs compiled markdown. This markdown is wrapped in a ```<div/>``` with a class of ```_post``` and a unique ```id```.

    <div class="_post" id="1332691107">[compiled markdown (html)]</div>

Remember that newlines in markdown get ```p``` wrappers.

# Realtime!

It wouldn't be node if it wasn't realtime. The crowd-pleaser for the hackny hackathon, we integrated a realtime notification system for new blog posts.

This is added as a bonus variable for templates. Include it at the end of your template, right before the ```</body>``` tag.

    {{{ realtime }}}

When you publish a new blog post (by deploying the server), all of the connected clients will be notified in realtime. The notification is appended to the body of the document [with javascript](https://github.com/theycallmeswift/quill/blob/master/quill/scaffolding/realtime.js).

This code gets added to the page whenever a new post is made. It will not exist on the page before this. To test, you can copy and paste the following before the ```</body>``` tag.

    <a href="javascript:location.reload(true)" id="new-post-notice">A new post has been made! <br /><small>Click here to see it.</small></a>

# Assets

Throw all your static assets (like images or javascript) into the ```/assets``` folder within the template directory. You can reference these files in your template like this:

    <img src="/assets/favicon.png" />

# Bonus Structure.css

If you want an easy way to render markdown, check out *structure.css*, bundled into the four provided themes within the ```/assets``` directory. Based off the [rawr framwork](http://getrawr.com).