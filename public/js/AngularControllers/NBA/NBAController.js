!function(e){function a(r){if(l[r])return l[r].exports;var o=l[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,a),o.l=!0,o.exports}var l={};return a.m=e,a.c=l,a.i=function(e){return e},a.d=function(e,a,l){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:l})},a.n=function(e){var l=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(l,"a",l),l},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=0)}([function(e,a){angular.module("NBAApp").controller("NBAController",["$http","$scope","$filter","$uibModal","$window",function(e,a,l,r,o){var t=this;a.alerts=[{type:"info",msg:"Please Upload/Load Players...",number:1}],a._Positions=[],a._AllTeams=[],a._AllWeeks=[],a._AllPlayersMASTER=[],a._AllPlayers=[],a._AllReadPlayerIDs=[],a._AllStacks=[],a._PG1PlayerPool=[],a._PG2PlayerPool=[],a._SG1PlayerPool=[],a._SG2PlayerPool=[],a._SF1PlayerPool=[],a._SF2PlayerPool=[],a._PF1PlayerPool=[],a._PF2PlayerPool=[],a._CPlayerPool=[],a._AllDisplayedDraftData=[],a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0,a.SelectedValidDrafts=!0,a.sortTypeDraft="FPPG",a.sortType="_Salary",a.sortReverse=!0,a.sortReverseDraft=!0,a.SelectedPosition="PG1",a.SelectedTeam="All",a.SelectedStackPositions=[],a.SelectedDraft=null,a.totalPossibleDraftsToBeCreated=0,a.totalPossibleCurrentDraftsCount=0,a.tempDrafts=[],a.tempPlayerNamesList=[],a.AVERAGE=parseFloat(-1),a.STDEVIATION=parseFloat(-1),a.TopRange=-1,a.BottomRange=-1,t.TopLimit=150,t.TopRange=-1,t.BottomRange=-1,t.removeDups=!0,a.savedPastSettings=[],a.currentRead=null,a._AllPlayers=l("team")(a._AllPlayers,a.SelectedTeam),a._AllPlayers=l("position")(a._AllPlayers,a.SelectedPosition),a.mainTabHeading="Players",a.DeleteConfirmationID=-1;a.displayNewMessage=function(e,l){o.scrollTo(0,0),a.addAlert(e,l)},a.addAlert=function(e,l){var r=1;a.alerts.length>100&&(a.alerts=[]),a.alerts.forEach(function(a){a.type==e&&a.msg==l&&r++}),l.indexOf("Unauthenticated")!==-1?a.alerts.push({type:e,msg:l,number:r,login:!0}):a.alerts.push({type:e,msg:l,number:r,login:!1})},a.closeAlert=function(e){a.alerts.splice(e,1)},a.loadProjectionsAsActual=function(e){var l=e.target.files[0],r="",o=new FileReader;o.onload=function(e){r=o.result;for(var l=r.split(/\r\n|\n/),t=0;t<l.length;t++){for(var n=l[t].split(","),P="",s="",i="",f=0,d=0,c="",y="",u=0;u<n.length;u++)switch(u){case 0:var p=n[u].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),_=p.split(" ");s=_[0],i=2==_.length?_[1]:_[2];break;case 1:d=parseInt(n[u].replace('"',"").replace('"',"").replace("$","").trim());break;case 2:c=n[u].replace('"',"").replace('"',"").trim();break;case 3:P=n[u].replace('"',"").replace('"',"").trim();break;case 4:y=n[u].replace('"',"").replace('"',"").trim();break;case 7:f=parseFloat(n[u].replace('"',"").replace('"',"").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(s)&&e._Name.includes(i)&&e._Position==P&&(e._ActualFantasyPoints=f)})}},a.$apply(function(){a.displayNewMessage("success","Player projections loaded as actual Success")}),o.readAsText(l)},a.loadActual=function(e){var l=e.target.files[0],r="",o=new FileReader;o.onload=function(e){r=o.result;for(var l=r.split(/\r\n|\n/),t=(l[0].split(","),1);t<l.length;t++){for(var n=l[t].split(";"),P="",s="",i="",f=0,d=0,c=0;c<n.length;c++)switch(c){case 2:P=n[c].replace('"',"").replace('"',"").trim();break;case 3:var y=n[c].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),u=y.split(" ");s=u[0],i=2==u.length?u[1]:u[2];break;case 5:f=parseFloat(n[c].replace('"',"").replace('"',"").trim());break;case 6:d=parseInt(n[c].replace('"',"").replace('"',"").replace("$","").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(s)&&e._Name.includes(i)&&e._Position==P&&(e._ActualFantasyPoints=f),a._Positions.indexOf(e._Postion)===-1&&a._Positions.push(e._Position)})}a._Positions.sort(),a.$apply(function(){a.displayNewMessage("success","Player Actual Results have been successfully loaded")})},o.readAsText(l)},a.loadPlayers=function(l){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a.currentRead=null,a.mainTabHeading="Players";var r=new FormData;r.append("csvFile",l.target.files[0]),e.post("/NBA/loadFanDuelPlayers",r,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){e.data.forEach(function(e){e._Salary=parseFloat(e._Salary),e._FPPG=parseFloat(e._FPPG),e._FPPG=e._FPPG.toFixed(2),e._FPPG=parseFloat(e._FPPG);var l=parseFloat((e._FPPG/e._Salary).toFixed(5));e._ProjectedPointsPerDollar=l,"O"==e._playerInjured?e._playerInjured="danger":"GTD"==e._playerInjured&&(e._playerInjured="warning"),0==a._AllTeams.length?a._AllTeams.push(e._Team):a._AllTeams.indexOf(e._Team)==-1&&a._AllTeams.push(e._Team),a._AllPlayers.push(e),a._AllPlayersMASTER.push(e)}),a._AllPlayers.length>0&&a.displayNewMessage("success","Players have been successfully loaded")},function(e){a.displayNewMessage("danger","Error: Players could not be loaded.")})},a.selectTopActualPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length)for(var e=l("orderBy")(a._AllPlayers,"_ActualFantasyPoints",!0),r=l("position")(e,"PG"),o=l("position")(e,"SG"),t=l("position")(e,"SF"),n=l("position")(e,"PF"),P=l("position")(e,"C"),s=0;s<5;s++)s<3&&(a.addPlayerToPool(r[s],"PG1"),a.addPlayerToPool(o[s],"SG1"),a.addPlayerToPool(t[s],"SF1"),a.addPlayerToPool(n[s],"PF1"),a.addPlayerToPool(P[s],"C")),s>0&&(a.addPlayerToPool(r[s],"PG2"),a.addPlayerToPool(o[s],"SG2"),a.addPlayerToPool(t[s],"SF2"),a.addPlayerToPool(n[s],"PF2"))},a.teamRemovalFormularHelpers=function(e,a){var l=[],r=[];return 0!=a.length&&(l.push(a[0]._Team),r.push(a[0])),e.forEach(function(e){if(l.indexOf(e._Team)!=-1){var a=l.indexOf(e._Team),o=r[a];o._Salary<e._Salary?r[a]=e:o._Salary===e._Salary&&o._FPPG<e._FPPG&&(r[a]=e)}else l.indexOf(e._Team)==-1&&(l.push(e._Team),r.push(e))}),r},a.setAndUnsetPosition=function(e){a.SelectedPosition===e||(a.SelectedPosition=e)},a.updatePlayerPtsPerDollar=function(e){var l=a._AllPlayers.indexOf(e);l!==-1&&(a._AllPlayers[l]._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5),e._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5))},a.addSalaryImpliedPts=function(){a._AllPlayers.forEach(function(e){e._FPPG=.004*e._Salary,e._FPPG=e._FPPG.toFixed(1),e._FPPG=parseFloat(e._FPPG),a.updatePlayerPtsPerDollar(e)})},a.selectTopFPPGPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length){for(var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),o=l("position")(r,"PG"),t=l("position")(r,"SG"),n=l("position")(r,"SF"),P=l("position")(r,"PF"),s=l("position")(r,"C"),i=0;i<o.length;i++)0!=i&&1!=i||a.addPlayerToPool(o[i],"PG1"),1!=i&&2!=i&&3!=i||a.addPlayerToPool(o[i],"PG2");for(var i=0;i<t.length;i++)0!=i&&1!=i||a.addPlayerToPool(t[i],"SG1"),1!=i&&2!=i&&3!=i&&4!=i||a.addPlayerToPool(t[i],"SG2");for(var i=0;i<n.length;i++)0==i&&a.addPlayerToPool(n[i],"SF1"),1!=i&&2!=i&&3!=i||a.addPlayerToPool(n[i],"SF2");for(var i=0;i<P.length;i++)0!=i&&1!=i||a.addPlayerToPool(P[i],"PF1"),1!=i&&2!=i&&3!=i&&4!=i||a.addPlayerToPool(P[i],"PF2");a.addPlayerToPool(s[0],"C"),a.addPlayerToPool(s[1],"C")}},a.selectTopSpecialPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length){for(var r=l("orderBy")(a._AllPlayers,"_FPPG",!0),o=l("removeInjured")(r),t=l("position")(o,"PG"),n=l("position")(o,"SG"),P=l("position")(o,"SF"),s=l("position")(o,"PF"),i=l("position")(o,"C"),f=[],d=0;d<t.length;d++)t[d]._FPPG>15&&f.push(t[d]._FPPG);e.post("/NBA/specialLineup",{postObject:JSON.stringify(f)}).then(function(e){var l=[],r=[];e.data[0].forEach(function(e){l.push(e[0])}),e.data[1].forEach(function(e){r.push(e[0])}),l=l.sort(function(e,a){return a-e}),r=r.sort(function(e,a){return a-e});for(var o=0,n=0;n<l.length;n++)o+=l[n];for(var P=o/l.length,s=0,n=0;n<r.length;n++)s+=r[n];var i=s/r.length;if(P>i)if(l.length>=4){for(var n=0;n<l.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===l[n]&&a.addPlayerToPool(t[f],"PG1");for(var n=0;n<l.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===l[n]&&a.addPlayerToPool(t[f],"PG2")}else{for(var n=0;n<l.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===l[n]&&a.addPlayerToPool(t[f],"PG1");for(var n=0;n<r.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===r[n]&&a.addPlayerToPool(t[f],"PG2");for(var n=1;n<l.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===l[n]&&a.addPlayerToPool(t[f],"PG2")}else if(r.length>=4){for(var n=0;n<r.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===r[n]&&a.addPlayerToPool(t[f],"PG1");for(var n=0;n<r.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===r[n]&&a.addPlayerToPool(t[f],"PG2")}else{for(var n=0;n<r.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===r[n]&&a.addPlayerToPool(t[f],"PG1");for(var n=0;n<l.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===l[n]&&a.addPlayerToPool(t[f],"PG2");for(var n=1;n<r.length;n++)for(var f=0;f<t.length;f++)t[f]._FPPG===r[n]&&a.addPlayerToPool(t[f],"PG2")}},function(e){});for(var c=[],d=0;d<n.length;d++)n[d]._FPPG>15&&c.push(n[d]._FPPG);e.post("/NBA/specialLineup",{postObject:JSON.stringify(c)}).then(function(e){var l=[],r=[];e.data[0].forEach(function(e){l.push(e[0])}),e.data[1].forEach(function(e){r.push(e[0])}),l=l.sort(function(e,a){return a-e}),r=r.sort(function(e,a){return a-e});for(var o=0,t=0;t<l.length;t++)o+=l[t];for(var P=o/l.length,s=0,t=0;t<r.length;t++)s+=r[t];var i=s/r.length;if(P>i)if(l.length>=4){for(var t=0;t<l.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===l[t]&&a.addPlayerToPool(n[f],"SG1");for(var t=0;t<l.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===l[t]&&a.addPlayerToPool(n[f],"SG2")}else{for(var t=0;t<l.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===l[t]&&a.addPlayerToPool(n[f],"SG1");for(var t=0;t<r.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===r[t]&&a.addPlayerToPool(n[f],"SG2");for(var t=1;t<l.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===l[t]&&a.addPlayerToPool(n[f],"SG2")}else if(r.length>=4){for(var t=0;t<r.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===r[t]&&a.addPlayerToPool(n[f],"SG1");for(var t=0;t<r.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===r[t]&&a.addPlayerToPool(n[f],"SG2")}else{for(var t=0;t<r.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===r[t]&&a.addPlayerToPool(n[f],"SG1");for(var t=0;t<l.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===l[t]&&a.addPlayerToPool(n[f],"SG2");for(var t=1;t<r.length;t++)for(var f=0;f<n.length;f++)n[f]._FPPG===r[t]&&a.addPlayerToPool(n[f],"SG2")}},function(e){});for(var y=[],d=0;d<P.length;d++)P[d]._FPPG>15&&y.push(P[d]._FPPG);e.post("/NBA/specialLineup",{postObject:JSON.stringify(y)}).then(function(e){var l=[],r=[];e.data[0].forEach(function(e){l.push(e[0])}),e.data[1].forEach(function(e){r.push(e[0])}),l=l.sort(function(e,a){return a-e}),r=r.sort(function(e,a){return a-e});for(var o=0,t=0;t<l.length;t++)o+=l[t];for(var n=o/l.length,s=0,t=0;t<r.length;t++)s+=r[t];var i=s/r.length;if(n>i)if(l.length>=4){for(var t=0;t<l.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===l[t]&&a.addPlayerToPool(P[f],"SF1");for(var t=0;t<l.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===l[t]&&a.addPlayerToPool(P[f],"SF2")}else{for(var t=0;t<l.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===l[t]&&a.addPlayerToPool(P[f],"SF1");for(var t=0;t<r.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===r[t]&&a.addPlayerToPool(P[f],"SF2");for(var t=1;t<l.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===l[t]&&a.addPlayerToPool(P[f],"SF2")}else if(r.length>=4){for(var t=0;t<r.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===r[t]&&a.addPlayerToPool(P[f],"SF1");for(var t=0;t<r.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===r[t]&&a.addPlayerToPool(P[f],"SF2")}else{for(var t=0;t<r.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===r[t]&&a.addPlayerToPool(P[f],"SF1");for(var t=0;t<l.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===l[t]&&a.addPlayerToPool(P[f],"SF2");for(var t=1;t<r.length;t++)for(var f=0;f<P.length;f++)P[f]._FPPG===r[t]&&a.addPlayerToPool(P[f],"SF2")}},function(e){});for(var u=[],d=0;d<s.length;d++)s[d]._FPPG>15&&u.push(s[d]._FPPG);e.post("/NBA/specialLineup",{postObject:JSON.stringify(u)}).then(function(e){var l=[],r=[];e.data[0].forEach(function(e){l.push(e[0])}),e.data[1].forEach(function(e){r.push(e[0])}),l=l.sort(function(e,a){return a-e}),r=r.sort(function(e,a){return a-e});for(var o=0,t=0;t<l.length;t++)o+=l[t];for(var n=o/l.length,P=0,t=0;t<r.length;t++)P+=r[t];var i=P/r.length;if(n>i)if(l.length>=4){for(var t=0;t<l.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===l[t]&&a.addPlayerToPool(s[f],"PF1");for(var t=0;t<l.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===l[t]&&a.addPlayerToPool(s[f],"PF2")}else{for(var t=0;t<l.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===l[t]&&a.addPlayerToPool(s[f],"PF1");for(var t=0;t<r.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===r[t]&&a.addPlayerToPool(s[f],"PF2");for(var t=1;t<l.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===l[t]&&a.addPlayerToPool(s[f],"PF2")}else if(r.length>=4){for(var t=0;t<r.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===r[t]&&a.addPlayerToPool(s[f],"PF1");for(var t=0;t<r.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===r[t]&&a.addPlayerToPool(s[f],"PF2")}else{for(var t=0;t<r.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===r[t]&&a.addPlayerToPool(s[f],"PF1");for(var t=0;t<l.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===l[t]&&a.addPlayerToPool(s[f],"PF2");for(var t=1;t<r.length;t++)for(var f=0;f<s.length;f++)s[f]._FPPG===r[t]&&a.addPlayerToPool(s[f],"PF2")}},function(e){}),a.addPlayerToPool(i[0],"C"),a.addPlayerToPool(i[1],"C")}},a.parseFloat=function(e){return parseFloat(e)},a.clearAllPlayers=function(){a._AllPlayers=[],a._AllPlayersMASTER=[],a._AllTeams=[],a._Positions=[]},a.changeLineups=function(a){for(var l=new FormData,r=0;r<a.length;r++)l.append(a[r].name,a[r]);e.post("/api/NBA/changeLineups",l,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){},function(e){})},a.getPointsPerDollar=function(e){var a=0;return a=e._FPPG/e._Salary,a=a.toFixed(5),a=parseFloat(a)},a.resetMessage=function(){a._Message.hasData=!1,a._Message.messageType="info",a._Message.message=""},a.addRemoveTeam=function(e){a.SelectedTeam===e?a.SelectedTeam="All":a.SelectedTeam=e},a.addRemoveWeek=function(e){var l=a.SelectedWeeks.indexOf(e);l>-1?a.SelectedWeeks.splice(l,1):a.SelectedWeeks.push(e)},a.setDraftSortTypeAndReverse=function(e){if(a.sortTypeDraft=e,a.sortReverseDraft=!a.sortReverseDraft,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var r=0;r<150;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r]);else for(var r=0;r<a._AllDraftData.length;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r])},a.CSVReplace=function(e){var r=e.target.files[0],o="",t=new FileReader;t.onload=function(e){o=t.result;for(var r=o.split(/\r\n|\n/),n=(r[0].split(","),[]),P=1;P<r.length;P++){for(var s=r[P].split(","),i="",f="",d="",c=0;c<s.length;c++)switch(c){case 0:i=s[c].replace('"',"").replace('"',"").trim();break;case 1:f=s[c].replace('"',"").replace('"',"").trim();break;case 2:d=s[c].replace('"',"").replace('"',"").trim()}var y={entry_id:i,contest_id:f,contest_name:d};void 0!==i&&""!==i&&n.push(y)}if(a._AllDraftData.length<=n.length){var u=0,p=a._AllDraftData;p=l("checkValidOnly")(p,!0),p=l("orderBy")(p,a.sortTypeDraft,a.sortReverseDraft);var _="data:text/csv;charset=utf-8,";_+="entry_id,contest_id,contest_name,PG,PG,SG,SG,SF,SF,PF,PF,C\n";for(var h=0;h<n.length;h++){var g=n[h].contest_id.split("-");if(p[h].players[0].playerID.indexOf(g[0])!==-1){_=_+n[h].entry_id+","+n[h].contest_id+","+n[h].contest_name+",";for(var F="",c=0;c<p[h].players.length;c++)0==c?F+=p[h].players[c].playerID:F=F+","+p[h].players[c].playerID;_=_+F+"\n",u++}else a.$apply(function(){a.displayNewMessage("warning","WARNING: player ID does not contain contest ID, Are you sure you have the correct CSV Replace file?")})}if(u>0){var v=angular.element("<a/>");v.css({display:"none"}),angular.element(document.body).append(v);var D="";a._AllTeams.forEach(function(e){D=0==D.length?e:D+"_"+e}),v.attr({href:encodeURI(_),target:"_blank",download:"CSVReplace_"+D+".csv"})[0].click(),v.remove(),a.$apply(function(){a.displayNewMessage("success","Successfully replaced lineups in CSV")})}}else a.$apply(function(){a.displayNewMessage("warning","WARNING: # drafts: "+a._AllDraftData.length+" is larger then the expected csvFile: "+n.length)})},t.readAsText(r)},a.DownloadDraftCSV=function(){if(0==a._AllDraftData.length)return void a.displayNewMessage("danger","Error: Cannot downloaded drafts when none have been generated");var r="data:text/csv;charset=utf-8,",o=a._AllDraftData;o=l("checkValidOnly")(o,!0),o=l("orderBy")(o,a.sortTypeDraft,a.sortReverseDraft),r+="PG,PG,SG,SG,SF,SF,PF,PF,C\n",o.forEach(function(e){for(var a="",l=0;l<e.players.length;l++)0==l?a+=e.players[l].playerID:a=a+","+e.players[l].playerID;r=r+a+"\n"}),e.post("/NBA/downloadDrafts",{downloadDrafts:o.length}).then(function(e){},function(e){return void 0!==e.data.error?void a.displayNewMessage("danger","Download Drafts - Failed, "+e.data.error):void a.displayNewMessage("danger","Download Drafts - Failed")});var t=angular.element("<a/>");t.css({display:"none"}),angular.element(document.body).append(t);var n="";a._AllTeams.forEach(function(e){n=0==n.length?e:n+"_"+e}),t.attr({href:encodeURI(r),target:"_blank",download:n+".csv"})[0].click(),t.remove()},a.removePlayerFromPool=function(e,l){if(a.playerInPool(e,l))switch(l){case"PG1":a._PG1PlayerPool.splice(a._PG1PlayerPool.indexOf(e),1);break;case"PG2":a._PG2PlayerPool.splice(a._PG2PlayerPool.indexOf(e),1);break;case"SG1":a._SG1PlayerPool.splice(a._SG1PlayerPool.indexOf(e),1);break;case"SG2":a._SG2PlayerPool.splice(a._SG2PlayerPool.indexOf(e),1);break;case"SF1":a._SF1PlayerPool.splice(a._SF1PlayerPool.indexOf(e),1);break;case"SF2":a._SF2PlayerPool.splice(a._SF2PlayerPool.indexOf(e),1);break;case"PF1":a._PF1PlayerPool.splice(a._PF1PlayerPool.indexOf(e),1);break;case"PF2":a._PF2PlayerPool.splice(a._PF2PlayerPool.indexOf(e),1);break;case"C":a._CPlayerPool.splice(a._CPlayerPool.indexOf(e),1)}},a.addPlayerToPool=function(e,l){if(""===a.SelectedPosition&&a.displayNewMessage("danger","Please select a position"),!a.playerInPool(e,l))switch(l){case"PG1":a._PG1PlayerPool.push(e);break;case"PG2":a._PG2PlayerPool.push(e);break;case"SG1":a._SG1PlayerPool.push(e);break;case"SG2":a._SG2PlayerPool.push(e);break;case"SF1":a._SF1PlayerPool.push(e);break;case"SF2":a._SF2PlayerPool.push(e);break;case"PF1":a._PF1PlayerPool.push(e);break;case"PF2":a._PF2PlayerPool.push(e);break;case"C":a._CPlayerPool.push(e)}},a.playerInPool=function(e,l){switch(l){case"PG1":if(a._PG1PlayerPool.indexOf(e)>-1)return!0;break;case"PG2":if(a._PG2PlayerPool.indexOf(e)>-1)return!0;break;case"SG1":if(a._SG1PlayerPool.indexOf(e)>-1)return!0;break;case"SG2":if(a._SG2PlayerPool.indexOf(e)>-1)return!0;break;case"SF1":if(a._SF1PlayerPool.indexOf(e)>-1)return!0;break;case"SF2":if(a._SF2PlayerPool.indexOf(e)>-1)return!0;break;case"PF1":if(a._PF1PlayerPool.indexOf(e)>-1)return!0;break;case"PF2":if(a._PF2PlayerPool.indexOf(e)>-1)return!0;break;case"C":if(a._CPlayerPool.indexOf(e)>-1)return!0}return!1},a.clearPlayerPools=function(){a._PG1PlayerPool=[],a._PG2PlayerPool=[],a._SG1PlayerPool=[],a._SG2PlayerPool=[],a._SF1PlayerPool=[],a._SF2PlayerPool=[],a._PF1PlayerPool=[],a._PF2PlayerPool=[],a._CPlayerPool=[]},a.averagePlayerPoolSalary=function(e){if(0==e.length)return 0;var a=0;return e.forEach(function(e){a+=e._Salary}),Math.round(a/e.length,0)},a.removeDraft=function(e){a._AllDisplayedDraftData.splice(a._AllDisplayedDraftData.indexOf(e),1);var l=a._AllDraftData.indexOf(e);a._AllDraftData.splice(l,1),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts},a.removeAllButTopN=function(){if(a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDraftData.length>t.TopLimit){for(var e=[],r=0;r<t.TopLimit;r++)e.push(a._AllDraftData[r]);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDisplayedDraftData=[];for(var o=0;o<t.TopLimit;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])}},a.clearDrafts=function(){a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0},a.setPlayerRanking=function(){var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),o=l("position")(r,"PG"),t=l("position")(r,"SG"),n=l("position")(r,"SF"),P=l("position")(r,"PF"),s=l("position")(r,"C"),i=l("removeOut")(e),f=l("position")(i,"PG"),d=l("position")(i,"SG"),c=l("position")(i,"SF"),y=l("position")(i,"PF"),u=l("position")(i,"C");a._AllPlayers.forEach(function(e){var a=99;if(e._playerInjured)switch(e._Position){case"PG":a=f.indexOf(e)+1;break;case"SG":a=d.indexOf(e)+1;break;case"SF":a=c.indexOf(e)+1;break;case"PF":a=y.indexOf(e)+1;break;case"C":a=u.indexOf(e)+1}else switch(e._Position){case"PG":a=o.indexOf(e)+1;break;case"SG":a=t.indexOf(e)+1;break;case"SF":a=n.indexOf(e)+1;break;case"PF":a=P.indexOf(e)+1;break;case"C":a=s.indexOf(e)+1}e._Rank=a})},a.averageRank=function(e){var a=0;return e.forEach(function(e){a+=e._Rank}),a=parseFloat(a/e.length),a.toFixed(2)},a.buildDrafts=function(){if(0==a._PG1PlayerPool.length||0==a._PG2PlayerPool.length||0==a._SG1PlayerPool.length||0==a._SG2PlayerPool.length||0==a._SF1PlayerPool.length||0==a._SF2PlayerPool.length||0==a._PF1PlayerPool.length||0==a._PF2PlayerPool.length||0==a._CPlayerPool.length)return void a.displayNewMessage("danger","Error: One or more player pools contain zero players");if(a.setPlayerRanking(),a.totalPossibleDraftsToBeCreated=a._PG1PlayerPool.length*a._PG2PlayerPool.length*a._SG1PlayerPool.length*a._SG2PlayerPool.length*a._SF1PlayerPool.length*a._SF2PlayerPool.length*a._PF1PlayerPool.length*a._PF2PlayerPool.length*a._CPlayerPool.length,!(a.totalPossibleDraftsToBeCreated>15e3)||confirm("Creating "+a.totalPossibleDraftsToBeCreated+" possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?")){a.clearDrafts();var r=[];if(a._PG1PlayerPool.forEach(function(e){var l={};l.PG1=e,a._PG2PlayerPool.forEach(function(e){l.PG2=e,a._SG1PlayerPool.forEach(function(e){l.SG1=e,a._SG2PlayerPool.forEach(function(e){l.SG2=e,a._SF1PlayerPool.forEach(function(e){l.SF1=e,a._SF2PlayerPool.forEach(function(e){l.SF2=e,a._PF1PlayerPool.forEach(function(e){l.PF1=e,a._PF2PlayerPool.forEach(function(e){l.PF2=e,a._CPlayerPool.forEach(function(e){a.totalPossibleCurrentDraftsCount++,l.C=e;var o=[];o.push(l.PG1),o.push(l.PG2),o.push(l.SG1),o.push(l.SG2),o.push(l.SF1),o.push(l.SF2),o.push(l.PF1),o.push(l.PF2),o.push(l.C);var n={};if(n.PG=[],n.SG=[],n.SF=[],n.PF=[],n.C=[],o.forEach(function(e){n[e._Position].push(e)}),a.isDraftTeamValid(o)&&a.isDraftSalaryValid(o)&&!a.doesDraftHaveDupPlayers(o)){var P={FPPG:parseFloat(a.getDraftFPPG(o)),Actual:parseFloat(a.getDraftActual(o)),validTeam:a.isDraftTeamValid(o),validSalary:a.isDraftSalaryValid(o),salaryLeft:parseInt(a.getDraftSalaryLeft(o)),players:o,playerNames:n,playersPositionData:angular.copy(l),displayDetails:!1,pointsPerDollar:parseFloat(a.averageValue(o)),averageRank:parseFloat(a.averageRank(o))};if(t.removeDups){var s=!1;if(r.length>0){for(var i=r.length-1;i>=0;i--){var f=0;if(n.PG.indexOf(r[i].PG[0])!==-1&&f++,n.PG.indexOf(r[i].PG[1])!==-1&&f++,n.SG.indexOf(r[i].SG[0])!==-1&&f++,n.SG.indexOf(r[i].SG[1])!==-1&&f++,n.SF.indexOf(r[i].SF[0])!==-1&&f++,n.SF.indexOf(r[i].SF[1])!==-1&&f++,n.PF.indexOf(r[i].PF[0])!==-1&&f++,n.PF.indexOf(r[i].PF[1])!==-1&&f++,n.C.indexOf(r[i].C[0])!==-1&&f++,9===f){s=!0;break}}s||(a._AllDraftData.push(P),r.push(n))}else a._AllDraftData.push(P),r.push(n)}else a._AllDraftData.push(P),r.push(n)}})})})})})})})})}),e.post("/NBA/buildDraft",{builtDrafts:a._AllDraftData.length}).then(function(e){},function(e){return void 0!==e.data.error?(a._AllDisplayedDraftData=[],a._AllDraftData=[],void a.displayNewMessage("danger","Build Failed, "+e.data.error)):void a.displayNewMessage("danger","Loading Single Saves - Failed "+e.data)}),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,!0),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var o=0;o<150;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o]);else for(var o=0;o<a._AllDraftData.length;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])}},a.doesDraftHaveDupPlayers=function(e){var a=[],l=!1;return e.forEach(function(e){a.indexOf(e._Name)>-1?l=!0:a.push(e._Name)}),l},a.getDraftSalaryLeft=function(e){var a=6e4;return e.forEach(function(e){a-=e._Salary}),a=parseInt(a)},a.getPlayerPercentInPosition=function(e,l){if(a.TotalValidDrafts>0){var r=0;return a._AllDraftData.forEach(function(a){a.playersPositionData[l]._Name===e._Name&&r++}),(r/a.TotalValidDrafts*100).toFixed(0)}return 0},a.topRuleBased=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length){for(var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),o=l("position")(r,"PG"),t=l("position")(r,"SG"),n=l("position")(r,"SF"),P=l("position")(r,"PF"),s=l("position")(r,"C"),i=l("orderBy")(a._AllPlayers,"_ProjectedPointsPerDollar",!0),f=l("removeInjured")(i),d=(l("position")(f,"PG"),l("position")(f,"SG"),l("position")(f,"SF"),l("position")(f,"PF"),l("position")(f,"C"),0);d<o.length;d++)0!=d&&1!=d||a.addPlayerToPool(o[d],"PG1"),1!=d&&2!=d&&3!=d&&4!=d||a.addPlayerToPool(o[d],"PG2");for(var d=0;d<t.length;d++)0!=d&&1!=d||a.addPlayerToPool(t[d],"SG1"),1!=d&&2!=d&&3!=d&&4!=d&&5!=d||a.addPlayerToPool(t[d],"SG2");for(var d=0;d<n.length;d++)0!=d&&1!=d||a.addPlayerToPool(n[d],"SF1"),1!=d&&2!=d&&3!=d||a.addPlayerToPool(n[d],"SF2");for(var d=0;d<P.length;d++)0!=d&&1!=d||a.addPlayerToPool(P[d],"PF1"),1!=d&&2!=d&&3!=d&&4!=d&&5!=d||a.addPlayerToPool(P[d],"PF2");s[0]._FPPG>s[1]._FPPG+13?a.addPlayerToPool(s[0],"C"):(a.addPlayerToPool(s[0],"C"),a.addPlayerToPool(s[1],"C"))}},a.removeCalcDrafts=function(){var e=l("removeCalcDraft")(a._AllDraftData,parseFloat(t.TopRange),parseFloat(t.BottomRange),a.sortTypeDraft);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length;var r=l("checkValidOnly")(a._AllDraftData,!0);if(a.TotalValidDrafts=r.length,a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var o=0;o<150;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o]);else for(var o=0;o<a._AllDraftData.length;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])},a.getDraftSalaryRemaining=function(e){var a=6e4;return e.players.forEach(function(e){a-=e._Salary}),a},a.getDraftFPPG=function(e){var a=0;return e.forEach(function(e){a+=e._FPPG}),a=parseFloat(a),a.toFixed(2)},a.getDraftActual=function(e){var a=0;return e.forEach(function(e){a+=e._ActualFantasyPoints}),a=parseFloat(a),a.toFixed(2)},a.openCloseDraftDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalDraft.html",controller:"DraftModalController",size:"lg",resolve:{draft:function(){return e}}})},a.openClosePlayerDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalPlayer.html",controller:"PlayerModalController",size:"lg",resolve:{allPlayers:function(){return a._AllPlayers},selectedPlayer:function(){return e}}})},a.isDraftSalaryValid=function(e){var a=6e4;return e.forEach(function(e){a-=e._Salary}),a>=0},a.averageValue=function(e){var a=0;return e.forEach(function(e){a=parseFloat(a)+parseFloat(e._ProjectedPointsPerDollar)}),a=parseFloat(a),(a/e.length).toFixed(5)},a.isDraftTeamValid=function(e){var a={};e.forEach(function(e){a.hasOwnProperty(e._Team)?a[e._Team]=a[e._Team]+1:a[e._Team]=1});for(team in a){var l=a[team];if(l>4)return!1}return!0},a.clearAllPlayerFilters=function(){a.SelectedTeam="All",a.SelectedWeeks=[]},a.openSaveDialog=function(){a.savedPastSettings=[];var e={_AllPlayers:a._AllPlayers,_PG1PlayerPool:a._PG1PlayerPool,_PG2PlayerPool:a._PG2PlayerPool,_SG1PlayerPool:a._SG1PlayerPool,_SG2PlayerPool:a._SG2PlayerPool,_SF1PlayerPool:a._SF1PlayerPool,_SF2PlayerPool:a._SF2PlayerPool,_PF1PlayerPool:a._PF1PlayerPool,_PF2PlayerPool:a._PF2PlayerPool,_CPlayerPool:a._CPlayerPool,TopRange:t.TopRange,BottomRange:t.BottomRange,TopLimit:t.TopLimit},l=r.open({templateUrl:"/js/AngularControllers/saveDialog.html",controller:"SaveModalController",size:"lg",backdrop:"static",resolve:{postObject:function(){return e},currentRead:function(){return a.currentRead},site:function(){return"FanDuel"}}});l.result.then(function(e){a.currentRead=e.readData,a.loadPlayersFromSave(e.postObject),a.mainTabHeading="Players - "+e.title},function(){})},a.read=function(l){e.post("/NBA/read",{id:l}).then(function(e){a.currentRead=e.data,a.loadPlayersFromSave(JSON.parse(a.currentRead.userSaveJSON)),a.mainTabHeading="Players - "+a.currentRead.title},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading Single Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading Single Saves - Failed")})},a.loadHistory=function(){e.post("/NBA/loadHistory",{endIndex:a.savedPastSettings.length}).then(function(e){var l=e.data;l.forEach(function(e){a.savedPastSettings.push(e)})},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading More Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading More Saves - Failed")})},a.setDeleteConfirmation=function(e){a.DeleteConfirmationID=e},a.unsetDeleteConfirmation=function(){a.DeleteConfirmationID=-1},a.showDeleteConfirmation=function(e){return a.DeleteConfirmationID==e},a["delete"]=function(l){e.post("/NBA/delete",{id:l}).then(function(e){for(var r=-1,o=0;o<a.savedPastSettings.length;o++)if(a.savedPastSettings[o].id==l){r=o;break}a.savedPastSettings.splice(r,1),a.displayNewMessage("success","Deleting #"+l+" - Success")},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Deleting - Failed, "+e.data.error):a.displayNewMessage("danger","Deleting - Failed")})},a.updateTitle=function(l,r){e.post("/NBA/updateTitle",{id:l,title:r}).then(function(e){a.displayNewMessage("success","Title Update - Success, Saved: "+r)},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Title Update - Failed,"+e.data.error):void 0!==e.data.title?a.displayNewMessage("danger","Title Update - Failed, "+e.data.title):a.displayNewMessage("danger","Title Update - Failed")})},a.loadPlayerInPool=function(e,l,r){e.forEach(function(e){e._Name==l._Name&&e._Position==l._Position&&e._Team==l._Team&&a.addPlayerToPool(l,r)})},a.loadPlayersFromSave=function(e){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a._AllPlayers=e._AllPlayers,a._AllPlayersMASTER=e._AllPlayers,t.TopRange=parseFloat(e.TopRange),t.BottomRange=parseFloat(e.BottomRange),t.TopLimit=parseInt(e.TopLimit),a._AllPlayers.forEach(function(l){0==a._AllTeams.length?a._AllTeams.push(l._Team):a._AllTeams.indexOf(l._Team)==-1&&a._AllTeams.push(l._Team),a.loadPlayerInPool(e._PG1PlayerPool,l,"PG1"),a.loadPlayerInPool(e._PG2PlayerPool,l,"PG2"),a.loadPlayerInPool(e._SG1PlayerPool,l,"SG1"),a.loadPlayerInPool(e._SG2PlayerPool,l,"SG2"),a.loadPlayerInPool(e._SF1PlayerPool,l,"SF1"),a.loadPlayerInPool(e._SF2PlayerPool,l,"SF2"),a.loadPlayerInPool(e._PF1PlayerPool,l,"PF1"),a.loadPlayerInPool(e._PF2PlayerPool,l,"PF2"),a.loadPlayerInPool(e._CPlayerPool,l,"C")}),a.displayNewMessage("success","Previous save loaded successfully.")}}])}]);