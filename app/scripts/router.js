/** @jsx React.DOM */


var Config = require('./config/config');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

module.exports = (
    <Routes location={Config.router.location}>
        <Route name="app" path="/" handler={require('./routes/app')}>
            <Route name="result" path="/result/:resultName" handler={require('./routes/result')} />
            <Route name="summary" path="/summary" handler={require('./routes/summary')} />
            <DefaultRoute name="overview" handler={require('./routes/overview')} />
        </Route>
    </Routes>
);
