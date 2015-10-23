# buylocal.thetyee.ca

> 2015 Buy Local contest site

### Objectives

* Migrate the [work started in 2014](https://github.com/TheTyee/buylocal)
* Abandon the need for Node and Mongo
* Build on The Tyee [static app template](https://github.com/TheTyee/static-app-template)
* Move toward a generic "Tyee Contests" template that can be re-skinned and re-deployed consistently and quickly
* And resulting in a contest site for Buy Local for 2015 that requires little-to-no maintainance during and after the contest

### Proposed plan

#### Server-rendered static pages via Jekyll

Jekyll will handle:

* Generic site elements (header, footer, includes)
* Asset pipeline (JS, JST, LESS/CSS, etc.)

#### Client-rendered "cards" (contest submissions)

A small JavaScript "app" (might be too small to be considerd such, but hey!) will query for submissions and display them as "cards." The user will be able to sort the cards, as well as page through results.

In the past, we've done this with [Backbone](http://backbonejs.org/), for an example see the [Transit Vote](https://github.com/TheTyee/transit-vote.thetyee.ca) site. That might be more than necessary here, and yet it provides a consistent approach to working with collections of data that helps to meet our objective of consistency.

#### Micro-service or proxy to Wufoo

Submission data, stored in Wufoo, will be accessible to the JavaScript app via a simple passthrough-proxy (we'll want to check the latency on this, and if pagination is avaialble), or via a micro-service as [we've done in the past](https://github.com/phillipadsmith/widgets.thetyee.ca) that queries and returns data from PostgreSQL.

**Decision**: Going to use a micro service and Wufoo webhooks to send data into the service because filtering is an issues, as well as pagination.

Next action:
- [X] Sally will develop a quick MVP that queries Wufoo directly, and report back on speeed, paging, filtering, etc.
- [ ] Phillip will deploy a micro service that provides access to stored Wufoo entries, with filters and pagination
- [ ] Phillip will bootstrap the Backbone app connected to the micro service


#### Experiment: Content pulled in via DocTop & TableTop

For the moment, there is a Google Drive folder called "Tyee - Contests - Buy Local 2015" that has a document for each "page," and a sheet for anything else (Prizes, Partners, Promos, etc.). 

This is where the business team will be working on the contest's content. It's possible that we can bypass the step of "loading" this content into Jekyll using [Tabletop.js](https://github.com/jsoma/tabletop) and [Doctop.js](https://github.com/times/doctop) or simillar libraries that read from Drive (either on the client, or when the site is generated) -- so we should give that a try if there's enough time.
