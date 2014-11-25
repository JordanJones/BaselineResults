'use strict';

var Cortex = require('cortexjs');

module.exports = new Cortex([
    {route: 'Overview', name: 'Overview', title: 'Overview'},
    {route: 'Result', name: 'WebApiSqlClient', title: 'WebApi SqlClient'},
    {route: 'Result', name: 'ODataEntityFramework', title: 'OData Entity Framework (DB First)'},
    {route: 'Result', name: 'ODataEntityFrameworkCodeFirst', title: 'OData Entity Framework (Code First)'},
    {route: 'Result', name: 'ODataLinq2Db', title: 'OData Linq2Db'},
    {route: 'Result', name: 'WebApiEntityFramework', title: 'WebApi Entity Framework (DB First)'},
    {route: 'Result', name: 'WebApiEntityFrameworkCodeFirst', title: 'WebApi Entity Framework (Code First)'},
    {route: 'Result', name: 'WebApiLinq2Db', title: 'WebApi Linq2Db'},
    {route: 'Summary', name: 'Summary', title: 'Summary'}
]);
