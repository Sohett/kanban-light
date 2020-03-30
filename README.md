## Where are the frontend JS framework's trends taking us 🤯

Two years ago, as part of my developer's journey, I started to have a look to the JS front-end frameworks. And of course at a first glance, like everybody else, they blow my mind. Specifically Vue.js with its strict and neat separation of concerns.

Yet, not so fare after, I started to see some inconvenients in their usage:
- Seperated SPA from the backend means: maintaining two applications, two seperated deployment, two seperated repo, two seperated development pipelines, ...
- New features means: new store, new front, new back api routes, new serializers, new ...
- Auth through both app / security for both app /
- ...

## The solution: Vue.js within Rails 🧘

I knew there was a better way. Rails being one of the web framework with the most various implementations from the community, there probably was a solution out there. And as expected, there was an existing solution to use Vue.js front-end power within Rails and to serve client side javascript, through Webpacker. Thanks to Chris Oliver's amazing Rails screencast series, I had a first glance of how it could work.

This repo is the implementation & investigation into a real example of this solution. The purpose being to be able to use Vue.js for the whole frontend part of the application, serving multiple Vue apps depending on the route.

Enjoy 🚀
