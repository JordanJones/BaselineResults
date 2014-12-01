!function e(t,s,a){function r(i,o){if(!s[i]){if(!t[i]){var l="function"==typeof require&&require;if(!o&&l)return l(i,!0);if(n)return n(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var u=s[i]={exports:{}};t[i][0].call(u.exports,function(e){var s=t[i][1][e];return r(s?s:e)},u,u.exports,e,t,s,a)}return s[i].exports}for(var n="function"==typeof require&&require,i=0;i<a.length;i++)r(a[i]);return r}({"./app/scripts/AppMain.js":[function(e){"use strict";var t=(window.$=window.jQuery=e("jquery"),window.React=e("react"));e("d3");var s=e("react-router"),a=s,r=a.Route,n=a.DefaultRoute,i=(a.Redirect,e("./models/NavigationModel")),o=t.createElement(r,{path:"/",handler:e("./views/Layout")},t.createElement(n,{name:i.baseName,handler:e("./views/OverviewView")}),t.createElement(r,{name:"Result",path:"/:name/:title",handler:e("./views/ResultView")}),t.createElement(r,{name:"Summary",path:"/Summary",handler:e("./views/SummaryView")}));s.run(o,function(e){t.render(t.createElement(e,null),document.body)})},{"./models/NavigationModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js","./views/Layout":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\Layout.js","./views/OverviewView":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\OverviewView.js","./views/ResultView":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\ResultView.js","./views/SummaryView":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\SummaryView.js",d3:"d3",jquery:"jquery",react:"react","react-router":"react-router"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\CategoryNav.js":[function(e,t){"use strict";var s=e("react"),a=e("react-router"),r=a,n=(r.Route,r.Link);t.exports=s.createClass({displayName:"exports",getInitialState:function(){return{isActive:this.props.defaultIsActive}},getDefaultProps:function(){return{isActive:!1}},componentWillReceiveProps:function(e){this.state.isActive!=e.defaultIsActive&&this.setState({isActive:e.defaultIsActive})},buildClassName:function(){var e="nav-item-"+this.props.params.name;return this.state.isActive&&(e+=" active"),e},render:function(){return s.createElement("li",{className:this.buildClassName(),role:"presentation"},s.createElement(n,{to:this.props.route,params:this.props.params},this.props.title))}})},{react:"react","react-router":"react-router"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\NavigationBar.js":[function(e,t){"use strict";var s=e("react"),a=e("react-router"),r=a.Link,n=e("../components/CategoryNav"),i=e("../models/NavigationModel");e("jasny-bootstrap"),t.exports=s.createClass({displayName:"exports",mixins:[a.State],renderItem:function(e,t){var a={name:e.name,title:e.title},r=e.route,i=this.isActive(r,"Result"===r?a:null,null);return s.createElement(n,{key:t,defaultIsActive:i,params:a,route:r,title:a.title})},render:function(){return s.createElement("div",{className:"clearfix"},s.createElement("nav",{id:"app-nav",className:"navmenu navmenu-inverse navmenu-fixed-left offcanvas-sm",role:"navigation"},s.createElement(r,{to:i.baseName,className:"navmenu-brand visible-md visible-lg"},"Baseline Results"),s.createElement("ul",{className:"nav navmenu-nav"},this.props.categories.map(this.renderItem))),s.createElement("div",{className:"navbar navbar-inverse navbar-fixed-top hidden-md hidden-lg"},s.createElement("button",{type:"button",className:"navbar-toggle","data-toggle":"offcanvas","data-target":"#app-nav"},s.createElement("span",{className:"sr-only"},"Toggle navigation"),s.createElement("span",{className:"icon-bar"}),s.createElement("span",{className:"icon-bar"}),s.createElement("span",{className:"icon-bar"})),s.createElement(r,{to:i.baseName,className:"navbar-brand"},"Baseline Results")))}})},{"../components/CategoryNav":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\CategoryNav.js","../models/NavigationModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js","jasny-bootstrap":"jasny-bootstrap",react:"react","react-router":"react-router"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\PerformanceResult.js":[function(e,t){"use strict";var s=e("react");t.exports=s.createClass({displayName:"exports",getDefaultProps:function(){return{data:{requests:0}}},render:function(){return s.createElement("div",{className:"well well-sm"},s.createElement("h1",{className:"text-center"},this.props.data.requests," ",s.createElement("small",null,"requests per second")))}})},{react:"react"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\ResourceUsageChart.js":[function(e,t){"use strict";function s(e,t,s,a,r){return r.relativeTime(t||1,!!s,e,a)}function a(e,t,a){var r=i.duration(e).abs(),n=l(r.as("s")),c=l(r.as("m")),u=l(r.as("h")),p=l(r.as("d")),m=l(r.as("M")),d=l(r.as("y")),h=n<o.s&&["s",n]||1===c&&["m"]||c<o.m&&["mm",c]||1===u&&["h"]||u<o.h&&["hh",u]||1===p&&["d"]||p<o.d&&["dd",p]||1===m&&["M"]||m<o.M&&["MM",m]||1===d&&["y"]||["yy",d];return h[2]=t,h[3]=+e>0,h[4]=a,s.apply({},h)}var r=e("react"),n=e("c3"),i=e("moment");t.exports=r.createClass({displayName:"exports",propTypes:{xLabel:r.PropTypes.string.isRequired,yLabel:r.PropTypes.string.isRequired,chartId:r.PropTypes.string.isRequired,data:r.PropTypes.object.isRequired},getInitialState:function(){return{chart:null}},componentWillReceiveProps:function(e){null!=this.state.chart&&this.state.chart.destroy&&this.state.chart.destroy(),this._renderGraphic(e)},componentWillUnmount:function(){null!=this.state.chart&&this.state.chart.destroy&&this.state.chart.destroy()},render:function(){var e=this.props.chartId+"-panel";return r.createElement("div",{id:e,className:"panel panel-default"},this.props.children,r.createElement("div",{className:"panel-body"},r.createElement("div",{id:this.props.chartId})))},_renderGraphic:function(e){var t=n.generate({axis:{x:{label:e.xLabel,show:!0,tick:{fit:!1,format:function(e){return i.duration(e,"seconds").humanize(!1)}}},y:{label:e.yLabel}},bindto:"#"+e.chartId,data:{json:e.data.values,keys:{x:"instance",value:["iis","sql"]},names:{iis:"IIS",sql:"SQL"},type:"line"},grid:{x:{lines:!1,show:!1}},point:{show:!1,r:1},subchart:{show:!1},tooltip:{show:!0},zoom:{enabled:!1}});this.setState({chart:t})}});var o={s:59,m:59,h:22,d:26,M:11},l=Math.round;i.duration.fn.humanize=function(e){var t=a(this,!e,this.localeData());return e&&(t=this.localeData().pastFuture(+this,t)),this.localeData().postformat(t)}},{c3:"c3",moment:"moment",react:"react"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\ResourceUsageHeader.js":[function(e,t){"use strict";var s=e("react");t.exports=s.createClass({displayName:"exports",propTypes:{text:s.PropTypes.string.isRequired,iis:s.PropTypes.string.isRequired,sql:s.PropTypes.string.isRequired},render:function(){return s.createElement("div",{className:"panel-heading"},this.props.text," - Average IIS: ",s.createElement("strong",null,this.props.iis),", Average SQL Server: ",s.createElement("strong",null,this.props.sql))}})},{react:"react"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\SummarySection.js":[function(e,t){"use strict";var s=e("react"),a=e("when"),r=(e("d3"),e("c3")),n=e("../models/ColorModel");t.exports=s.createClass({displayName:"exports",propTypes:{sectionId:s.PropTypes.string.isRequired,heading:s.PropTypes.string.isRequired,items:s.PropTypes.array.isRequired,itemLoader:s.PropTypes.func.isRequired,stateLoader:s.PropTypes.func.isRequired},getInitialState:function(){return{chart:[]}},componentWillMount:function(){this.loadState(this.props.items,this.props.itemLoader,this.props.stateLoader)},componentWillReceiveProps:function(e){null!=this.state.chart&&this.state.chart.destroy&&this.state.chart.destroy(),this.loadState(e.items||this.props.items,e.itemLoader||this.props.itemLoader,e.stateLoader||this.props.stateLoader)},componentWillUnmount:function(){null!=this.state.chart&&this.state.chart.destroy&&this.state.chart.destroy()},loadState:function(e,t,s){a.all(this.each(e||[],t)).then(function(){return s()}).then(this.renderChart.bind(this,e))},each:function(e,t){return(e||[]).map(function(e){return t(e.name,e.title)})},render:function(){var e=this.props.sectionId,t=e+"-panel";return s.createElement("div",{id:t,className:"summary-section"},s.createElement("h3",{className:"sectionHeading"},this.props.heading),s.createElement("div",{className:"panel-body"},s.createElement("div",{id:e})))},renderChart:function(e,t){var s=e.map(function(e){return t[e.name]}.bind(this)),a=s.length,i=0,o=r.generate({bindto:"#"+this.props.sectionId,data:{json:s,type:"bar",labels:!0,keys:{x:"title",value:["value"]},color:function(){var e=i++,t=e%a;return n[t]}},axis:{x:{type:"category",height:40},y:{show:!1,padding:{bottom:0}}},tooltip:{show:!1},legend:{show:!1}});this.setState({chart:o})}})},{"../models/ColorModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ColorModel.js",c3:"c3",d3:"d3",react:"react",when:"when"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ColorModel.js":[function(e,t){"use strict";t.exports=["#999","#999","#bd0026","#999","#999","#999","#66a61e"]},{}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js":[function(e,t){"use strict";t.exports={baseName:"Overview",routes:[{route:"Overview",name:"Overview",title:"Overview"},{route:"Summary",name:"Summary",title:"Summary"},{route:"Result",name:"WebApiSqlClient",title:"WebApi SqlClient"},{route:"Result",name:"ODataEntityFramework",title:"OData EF (DB First)"},{route:"Result",name:"ODataEntityFrameworkCodeFirst",title:"OData EF (Code First)"},{route:"Result",name:"ODataLinq2Db",title:"OData Linq2Db"},{route:"Result",name:"WebApiEntityFramework",title:"WebApi EF (DB First)"},{route:"Result",name:"WebApiEntityFrameworkCodeFirst",title:"WebApi EF (Code First)"},{route:"Result",name:"WebApiLinq2Db",title:"WebApi Linq2Db"}],getResultRoutes:function(){return this.routes.filter(function(e){return"Result"===e.route})}}},{}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ResultModel.js":[function(e,t){"use strict";var s=e("jquery"),a=e("when"),r=e("numeral");t.exports=function(){function e(e,t){return{name:e,title:t,cpu:{label:e,values:[]},mem:{label:e,values:[]},summary:{requests:0,latency:0,iis:{avgCpu:"",avgMem:""},sql:{avgCpu:"",avgMem:""}},raw:null,isProcessed:!1}}var t={state:e("Unknown"),cache:new Map,getState:function(){return this.state},getAsyncState:function(e,t){return a.promise(i.bind(this,e,t)).then(l.bind(this)).then(o.bind(this)).then(n.bind(this))},preload:function(e){e=e||[],0!=e.length&&a.settle(e.map(function(e){return this.getAsyncState(e.name,e.title)}.bind(this))).then(function(){}.bind(this))},getRequestsPerSecondData:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:t.summary.requests}}),e},getAverageLatencies:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:t.summary.latency}}),e},getAverageIisCpuUsage:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:parseFloat(t.summary.iis.avgCpu)}}),e},getAverageIisMemUsage:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:parseFloat(t.summary.iis.avgMem)}}),e},getAverageSqlCpuUsage:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:parseFloat(t.summary.sql.avgCpu)}}),e},getAverageSqlMemUsage:function(){var e={};return this.cache.forEach(function(t,s){e[s]={name:s,title:t.title,value:parseFloat(t.summary.sql.avgMem)}}),e}},n=function(e){return null!=e&&(this.state=e),this.getState()},i=function(t,a,r){if(this.cache.has(t))r(this.cache.get(t));else{var n=e(t,a),i="data/"+t+"/Results.json?bust="+(new Date).getTime();s.get(i,function(e){null!=e&&(n.raw=e),r(n)}).fail(function(){r(n)})}},o=function(e){return null!=e&&null!=e.raw&&e.isProcessed&&!this.cache.has(e.name)&&this.cache.set(e.name,e),e},l=function(e){if(null!=e.raw&&!e.isProcessed&&Array.isArray(e.raw.perf.values)){var t=e.raw.perf.values,s=e.cpu.values||[],a=e.mem.values||[];t.forEach(u.bind(this,s,a)),e.cpu.values=s,e.mem.values=a,e.summary=c(e.raw),e.isProcessed=!0}return e},c=function(e){return{requests:parseFloat(r(e.http.reqs).format("0.00")),latency:parseFloat(r(e.http.latency.avg).format("0.00")),iis:{avgCpu:r(e.perf.avgCpu.iis/100).format("0.00%"),avgMem:r(e.perf.avgMem.iis).format("0.000 b")},sql:{avgCpu:r(e.perf.avgCpu.sql/100).format("0.00%"),avgMem:r(e.perf.avgMem.sql).format("0.000 b")}}},u=function(e,t,s){var a=p(s);e.push({instance:a.id,iis:a.iisCpu,sql:a.sqlCpu}),t.push({instance:a.id,iis:a.iisMem,sql:a.sqlMem})},p=function(e){return{id:e.id,iisCpu:parseFloat(r(e.iisCpu).format("0.0")),sqlCpu:parseFloat(r(e.sqlCpu).format("0.0")),iisMem:parseFloat(r(e.iisMem).format("0.000b")),sqlMem:parseFloat(r(e.sqlMem).format("0.000b"))}};return t}()},{jquery:"jquery",numeral:"numeral",when:"when"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\Layout.js":[function(e,t){"use strict";var s=e("jquery"),a=e("react"),r=e("react-router"),n=r,i=n.RouteHandler,o=n.Navigation,l=e("../models/NavigationModel"),c=e("../components/NavigationBar");t.exports=a.createClass({displayName:"exports",mixins:[o],componentDidMount:function(){s(document.body).on("click","#project-link",this.routeToApp)},componentWillUnmount:function(){s(document.body).off("click","#project-link")},routeToApp:function(){this.transitionTo(l.baseName)},render:function(){return a.createElement("div",{id:"app-host"},a.createElement(c,{categories:l.routes}),a.createElement("div",{className:"container-fluid"},a.createElement(i,null)))}})},{"../components/NavigationBar":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\NavigationBar.js","../models/NavigationModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js",jquery:"jquery",react:"react","react-router":"react-router"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\OverviewView.js":[function(e,t){"use strict";var s=e("react"),a=e("../models/ResultModel"),r=e("../models/NavigationModel");t.exports=s.createClass({displayName:"exports",getInitialState:function(){return{preloaded:!1}},componentWillMount:function(){this.state.preloaded!==!0&&(a.preload(r.getResultRoutes()),this.setState({preloaded:!0}))},render:function(){return s.createElement("div",{className:"summary-container"},s.createElement("div",{className:"page-header"},s.createElement("h1",null,"Overview")))}})},{"../models/NavigationModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js","../models/ResultModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ResultModel.js",react:"react"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\ResultDataView.js":[function(e,t){"use strict";var s=e("react"),a=e("../components/ResourceUsageChart"),r=e("../components/ResourceUsageHeader"),n=e("../components/PerformanceResult"),i=e("../models/ResultModel");t.exports=s.createClass({displayName:"exports",propTypes:{title:s.PropTypes.string.isRequired,name:s.PropTypes.string.isRequired},getInitialState:function(){return i.getState()},componentWillMount:function(){this.setStateWithName(this.props.name,this.props.title)},componentWillReceiveProps:function(e){this.setStateWithName(e.name,e.title)},setStateWithName:function(e,t){i.getAsyncState(e,t).then(this.setState.bind(this))},render:function(){var e=this.props.name+"-cpuChart",t=this.props.name+"-memChart";return s.createElement("div",null,s.createElement("div",{className:"page-header"},s.createElement("h1",null,this.props.title)),s.createElement(n,{data:this.state.summary}),s.createElement(a,{chartId:e,data:this.state.cpu,yLabel:"Percent",xLabel:"Time"},s.createElement(r,{text:"Cpu %",iis:this.state.summary.iis.avgCpu,sql:this.state.summary.sql.avgCpu})),s.createElement(a,{heading:"Memory Graph",chartId:t,data:this.state.mem,yLabel:"MB",xLabel:"Time"},s.createElement(r,{text:"Memory Usage",iis:this.state.summary.iis.avgMem,sql:this.state.summary.sql.avgMem})))}})},{"../components/PerformanceResult":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\PerformanceResult.js","../components/ResourceUsageChart":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\ResourceUsageChart.js","../components/ResourceUsageHeader":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\ResourceUsageHeader.js","../models/ResultModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ResultModel.js",react:"react"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\ResultView.js":[function(e,t){"use strict";var s=e("react"),a=e("react-router"),r=e("./ResultDataView");t.exports=s.createClass({displayName:"exports",mixins:[a.State],render:function(){var e=this.getParams();return s.createElement(r,{title:e.title,name:e.name})}})},{"./ResultDataView":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\ResultDataView.js",react:"react","react-router":"react-router"}],"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\views\\SummaryView.js":[function(e,t){"use strict";var s=e("react"),a=e("../components/SummarySection"),r=e("../models/NavigationModel"),n=e("../models/ResultModel");t.exports=s.createClass({displayName:"exports",render:function(){var e=r.getResultRoutes(),t=n.getAsyncState.bind(n);return s.createElement("div",{className:"summary-container"},s.createElement(a,{sectionId:"sum-1",heading:"Requests per second",items:e,itemLoader:t,stateLoader:n.getRequestsPerSecondData.bind(n)}),s.createElement(a,{sectionId:"sum-2",heading:"Average Latency (milliseconds)",items:e,itemLoader:t,stateLoader:n.getAverageLatencies.bind(n)}),s.createElement(a,{sectionId:"sum-3",heading:"Average IIS Cpu Usage %",items:e,itemLoader:t,stateLoader:n.getAverageIisCpuUsage.bind(n)}),s.createElement(a,{sectionId:"sum-5",heading:"Average SQL Server Cpu Usage %",items:e,itemLoader:t,stateLoader:n.getAverageSqlCpuUsage.bind(n)}),s.createElement(a,{sectionId:"sum-4",heading:"Average IIS Memory Usage (MB)",items:e,itemLoader:t,stateLoader:n.getAverageIisMemUsage.bind(n)}),s.createElement(a,{sectionId:"sum-6",heading:"Average SQL Server Memory Usage (MB)",items:e,itemLoader:t,stateLoader:n.getAverageSqlMemUsage.bind(n)}))}})},{"../components/SummarySection":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\components\\SummarySection.js","../models/NavigationModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\NavigationModel.js","../models/ResultModel":"c:\\Users\\JordanS\\Projects\\Dell\\BaselineResults\\app\\scripts\\models\\ResultModel.js",react:"react"}]},{},["./app/scripts/AppMain.js"]);