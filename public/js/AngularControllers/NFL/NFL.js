!function(n){function r(e){if(t[e])return t[e].exports;var u=t[e]={i:e,l:!1,exports:{}};return n[e].call(u.exports,u,u.exports,r),u.l=!0,u.exports}var t={};return r.m=n,r.c=t,r.i=function(n){return n},r.d=function(n,r,t){Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:t})},r.n=function(n){var t=n&&n.__esModule?function(){return n["default"]}:function(){return n};return r.d(t,"a",t),t},r.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},r.p="",r(r.s=0)}([function(n,r){"use strict";var t=angular.module("NFLApp",["ui.bootstrap"]);t.filter("positionDK",function(){return function(n,r){var t=[];return"UTIL"===r?n:(n.forEach(function(n){""==r||void 0==r?t.push(n):n._Position.indexOf(r)!==-1&&t.push(n)}),t)}}),t.filter("removeDupDrafts",function(){return function(n){n.foreach(function(n){n.players.forEach(function(n){n.Pos})})}}),t.filter("position",function(){return function(n,r){var t=[];return""===r||null===r||void 0===r?n:(n.forEach(function(n){""==r||void 0==r?t.push(n):r.indexOf(n._Position)!==-1&&t.push(n)}),t)}}),t.filter("removeInjured",function(){return function(n){var r=[];return n.forEach(function(n){"danger"!=n._playerInjured&&"warning"!=n._playerInjured&&r.push(n)}),r}}),t.filter("removeOut",function(){return function(n){var r=[];return n.forEach(function(n){"danger"!=n._playerInjured&&r.push(n)}),r}}),t.filter("team",function(){return function(n,r){var t=[];return"All"===r||void 0===r||""===r||null===r?n:(n.forEach(function(n){r===n._Team&&t.push(n)}),t)}}),t.filter("weeks",function(){return function(n,r){var t=[];return n.forEach(function(n){0!=r.length&&void 0!=r||t.push(n),r.indexOf(n._WeekNum)>-1&&t.push(n)}),t}}),t.filter("sort",function(){return function(n){var r=function(n,r){return n._FPPG<r._FPPG?-1:n._FPPG>r._FPPG?1:0};return n.sort(r),n.reverse(),n}}),t.filter("sumProjection",function(){return function(n){var r=0;return n.forEach(function(n){r+=n._FPPG}),r.toFixed(2)}}),t.filter("sumActual",function(){return function(n){var r=0;return n.forEach(function(n){r+=n._ActualFantasyPoints}),r.toFixed(2)}}),t.filter("playersInPosition",function(){return function(n,r){var t=0;return n.forEach(function(n){n._Position==r&&t++}),t}}),t.filter("removePosition",function(){return function(n,r){var t=[];return n.forEach(function(n){n._Position!=r&&t.push(n)}),t}}),t.filter("checkValidOnly",function(){return function(n,r){var t=[];return n.forEach(function(n){r?n.validTeam&&n.validSalary&&t.push(n):t.push(n)}),t}}),t.filter("randomize",function(){return function(n){for(var r,t,e=n.length;0!==e;)t=Math.floor(Math.random()*e),e-=1,r=n[e],n[e]=n[t],n[t]=r;return n}}),t.filter("removeCalcDraft",function(){return function(n,r,t,e){var u=parseFloat(r),o=parseFloat(t),i=[];return n.forEach(function(n){"FPPG"===e?u>=n.FPPG&&n.FPPG>=o&&i.push(n):"Actual"===e?u>=n.Actual&&n.Actual>=o&&i.push(n):"salaryLeft"===e?u>=n.salaryLeft&&n.salaryLeft>=o&&i.push(n):"pointsPerDollar"===e?u>=n.pointsPerDollar&&n.pointsPerDollar>=o&&i.push(n):"averageRank"===e&&u>=n.averageRank&&n.averageRank>=o&&i.push(n)}),i}}),t.directive("customOnChange",function(){return{restrict:"A",link:function(n,r,t){var e=n.$eval(t.customOnChange);r.bind("change",e)}}}),t.directive("setHeight",["$window",function(n){return{link:function(r,t,e){t.css("height",n.innerHeight-200+"px")}}}]),t.directive("setHeightDrafts",["$window",function(n){return{link:function(r,t,e){t.css("height",(n.innerHeight-200)/2+"px")}}}])}]);