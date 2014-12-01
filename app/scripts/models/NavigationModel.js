'use strict';

module.exports = {
    baseName: 'Overview',
    routes: [
        {route: 'Overview', name: 'Overview', title: 'Overview'},
        {route: 'Result', name: 'WebApiSqlClient', title: 'WebApi SqlClient'},
        {route: 'Result', name: 'ODataEntityFramework', title: 'OData EF (DB First)'},
        {route: 'Result', name: 'ODataEntityFrameworkCodeFirst', title: 'OData EF (Code First)'},
        {route: 'Result', name: 'ODataLinq2Db', title: 'OData Linq2Db'},
        {route: 'Result', name: 'WebApiEntityFramework', title: 'WebApi EF (DB First)'},
        {route: 'Result', name: 'WebApiEntityFrameworkCodeFirst', title: 'WebApi EF (Code First)'},
        {route: 'Result', name: 'WebApiLinq2Db', title: 'WebApi Linq2Db'},
        {route: 'Summary', name: 'Summary', title: 'Summary'}
    ],

    getResultRoutes: function () {
        return this.routes.filter(x => x.route === 'Result');
    }
};
