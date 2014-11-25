/** @jsx React.DOM */


var Router = require('react-router');
var {Route, DefaultRoute, Redirect} = Router;

module.exports = (
    <Route handler={require('./routes/app')}>
        <DefaultRoute name="Overview" handler={require('./routes/overview')} />
        <Route name="Result" path="/:name/:title" handler={require('./routes/result')} />
        <Route name="Summary" path="/Summary" handler={require('./routes/summary')} />
    </Route>
);
