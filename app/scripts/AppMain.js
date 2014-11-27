/** @jsx React.DOM */
'use strict';
var $ = window.$ = window.jQuery = require('jquery');
var React = window.React = require('react');
require('d3');

var Router = require('react-router');
var {Route, DefaultRoute, Redirect} = Router;
var NavigationModel = require('./models/NavigationModel');

var routes = (
    <Route path="/" handler={require('./views/Layout')}>
        <DefaultRoute name={NavigationModel.baseName} handler={require('./views/OverviewView')} />
        <Route name="Result" path="/:name/:title" handler={require('./views/ResultView')} />
        <Route name="Summary" path="/Summary" handler={require('./views/SummaryView')} />
    </Route>
);


Router.run(routes, function (Handler) {
    React.render(<Handler />, document.body);
});
