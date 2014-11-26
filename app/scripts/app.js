/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, Redirect} = Router;
var NavigationModel = require('./models/NavigationModel');

var routes = (
    <Route name={NavigationModel.baseName} path="/" handler={require('./views/Layout')}>
        <DefaultRoute name="Overview" handler={require('./views/OverviewView')} />
        <Route name="Result" path="/:name/:title" handler={require('./views/ResultView')} />
        <Route name="Summary" path="/Summary" handler={require('./views/SummaryView')} />
    </Route>
);


Router.run(routes, function (Handler) {
    React.render(<Handler />, document.body);
    //React.render(<Handler />, document.getElementById('app-host'));
});
