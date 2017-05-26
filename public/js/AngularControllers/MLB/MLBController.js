!function(e){function a(r){if(l[r])return l[r].exports;var t=l[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,a),t.l=!0,t.exports}var l={};return a.m=e,a.c=l,a.i=function(e){return e},a.d=function(e,a,l){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:l})},a.n=function(e){var l=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(l,"a",l),l},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=0)}([function(e,a){angular.module("MLBApp").controller("MLBController",["$http","$scope","$filter","$uibModal","$window",function(e,a,l,r,t){var o=this;a.alerts=[{type:"info",msg:"Please Upload/Load Players...",number:1}],a._Positions=[],a._AllTeams=[],a._AllWeeks=[],a._AllPlayersMASTER=[],a._AllPlayers=[],a._AllReadPlayerIDs=[],a._AllStacks=[],a._PPlayerPool=[],a._CPlayerPool=[],a._1BPlayerPool=[],a._2BPlayerPool=[],a._3BPlayerPool=[],a._SSPlayerPool=[],a._OF1PlayerPool=[],a._OF2PlayerPool=[],a._OF3PlayerPool=[],a._AllDisplayedDraftData=[],a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0,a.SelectedValidDrafts=!0,a.sortTypeDraft="FPPG",a.sortType="_Salary",a.sortReverse=!0,a.sortReverseDraft=!0,a.SelectedPosition="P",a.SelectedTeam="All",a.SelectedStackPositions=[],a.SelectedDraft=null,a.totalPossibleDraftsToBeCreated=0,a.totalPossibleCurrentDraftsCount=0,a.tempDrafts=[],a.tempPlayerNamesList=[],a.AVERAGE=parseFloat(-1),a.STDEVIATION=parseFloat(-1),a.TopRange=-1,a.BottomRange=-1,o.TopLimit=150,o.TopRange=-1,o.BottomRange=-1,o.removeDups=!0,o.minTeamStack1=4,o.teamsForStack1=[],o.minTeamStack2=3,o.teamsForStack2=[],o.battersVSPitcher=0,a.savedPastSettings=[],a.currentRead=null,a._AllPlayers=l("team")(a._AllPlayers,a.SelectedTeam),a._AllPlayers=l("position")(a._AllPlayers,a.SelectedPosition),a.mainTabHeading="Players",a.DeleteConfirmationID=-1;a.displayNewMessage=function(e,l){t.scrollTo(0,0),a.addAlert(e,l)},a.addAlert=function(e,l){var r=1;a.alerts.length>100&&(a.alerts=[]),a.alerts.forEach(function(a){a.type==e&&a.msg==l&&r++}),l.indexOf("Unauthenticated")!==-1?a.alerts.push({type:e,msg:l,number:r,login:!0}):a.alerts.push({type:e,msg:l,number:r,login:!1})},a.closeAlert=function(e){a.alerts.splice(e,1)},a.loadProjectionsAsActual=function(e){var l=e.target.files[0],r="",t=new FileReader;t.onload=function(e){r=t.result;for(var l=r.split(/\r\n|\n/),o=0;o<l.length;o++){for(var n=l[o].split(","),s="",i="",P="",c=0,f=0,d="",u="",p=0;p<n.length;p++)switch(p){case 0:var y=n[p].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),_=y.split(" ");i=_[0],P=2==_.length?_[1]:_[2];break;case 1:f=parseInt(n[p].replace('"',"").replace('"',"").replace("$","").trim());break;case 2:d=n[p].replace('"',"").replace('"',"").trim();break;case 3:s=n[p].replace('"',"").replace('"',"").trim();break;case 4:u=n[p].replace('"',"").replace('"',"").trim();break;case 7:c=parseFloat(n[p].replace('"',"").replace('"',"").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(i)&&e._Name.includes(P)&&e._Position==s&&(e._ActualFantasyPoints=c)})}},a.$apply(function(){a.displayNewMessage("success","Player projections loaded as actual Success")}),t.readAsText(l)},a.loadActual=function(e){var l=e.target.files[0],r="",t=new FileReader;t.onload=function(e){r=t.result;for(var l=r.split(/\r\n|\n/),o=(l[0].split(","),1);o<l.length;o++){for(var n=l[o].split(","),s="",i="",P=0,c=0,f=0;f<n.length;f++)switch(f){case 0:var d=n[f].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),u=d.split(" ");s=u[0],i=2==u.length?u[1]:u[2];break;case 1:c=parseFloat(n[f].replace('"',"").replace('"',"").trim());break;case 2:P=parseFloat(n[f].replace('"',"").replace('"',"").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(s)&&e._Name.includes(i)&&(e._ActualFantasyPoints=P,e._FPPG=c,a.updatePlayerPtsPerDollar(e)),a._Positions.indexOf(e._Postion)===-1&&a._Positions.push(e._Position)})}a._Positions.sort(),a.$apply(function(){a.displayNewMessage("success","Player Actual Results have been successfully loaded")})},t.readAsText(l),angular.forEach(angular.element("input[type='file']"),function(e){angular.element(e).val(null)})},a.loadPlayers=function(l){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a.currentRead=null,a.mainTabHeading="Players";var r=new FormData;r.append("csvFile",l.target.files[0]),e.post("/MLB/loadFanDuelPlayers",r,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){e.data.forEach(function(e){e._Salary=parseFloat(e._Salary),e._FPPG=parseFloat(e._FPPG),e._FPPG=e._FPPG.toFixed(2),e._FPPG=parseFloat(e._FPPG);var l=parseFloat((e._FPPG/e._Salary).toFixed(5));e._ProjectedPointsPerDollar=l,"O"==e._playerInjured||"IR"===e._playerInjured||"NA"===e._playerInjured?e._playerInjured="danger":"DTD"==e._playerInjured&&(e._playerInjured="warning"),0==a._AllTeams.length?a._AllTeams.push(e._Team):a._AllTeams.indexOf(e._Team)==-1&&a._AllTeams.push(e._Team),"P"===e._Position&&"Yes"===e._ProbablePitcher?(a._AllPlayers.push(e),a._AllPlayersMASTER.push(e)):"P"!==e._Position&&(a._AllPlayers.push(e),a._AllPlayersMASTER.push(e))}),a._AllPlayers.length>0&&a.displayNewMessage("success","Players have been successfully loaded")},function(e){a.displayNewMessage("danger","Error: Players could not be loaded.")}),angular.forEach(angular.element("input[type='file']"),function(e){angular.element(e).val(null)})},a.selectTopActualPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length)for(var e=l("orderBy")(a._AllPlayers,"_ActualFantasyPoints",!0),r=l("position")(e,"P"),t=l("position")(e,"C"),o=l("position")(e,"1B"),n=l("position")(e,"2B"),s=l("position")(e,"3B"),i=(l("position")(e,"SS"),l("position")(e,"OF")),P=0;P<5;P++)P<3&&(a.addPlayerToPool(r[P],"P"),a.addPlayerToPool(t[P],"C"),a.addPlayerToPool(o[P],"1B"),a.addPlayerToPool(n[P],"2B"),a.addPlayerToPool(s[P],"3B"),a.addPlayerToPool(o[P],"SS"),a.addPlayerToPool(i[P],"OF1"),a.addPlayerToPool(i[P],"OF2"),a.addPlayerToPool(i[P],"OF3")),P>0&&(a.addPlayerToPool(i[P],"OF2"),a.addPlayerToPool(i[P],"OF3"))},a.setAndUnsetPosition=function(e){a.SelectedPosition===e||(a.SelectedPosition=e)},a.CSVReplace=function(e){var r=e.target.files[0],t="",o=new FileReader;o.onload=function(e){t=o.result;for(var r=t.split(/\r\n|\n/),n=(r[0].split(","),[]),s=1;s<r.length;s++){for(var i=r[s].split(","),P="",c="",f="",d=0;d<i.length;d++)switch(d){case 0:P=i[d].replace('"',"").replace('"',"").trim();break;case 1:c=i[d].replace('"',"").replace('"',"").trim();break;case 2:f=i[d].replace('"',"").replace('"',"").trim()}var u={entry_id:P,contest_id:c,contest_name:f};void 0!==P&&""!==P&&n.push(u)}if(a._AllDraftData.length==n.length){var p=0,y=a._AllDraftData;y=l("checkValidOnly")(y,!0),y=l("orderBy")(y,a.sortTypeDraft,a.sortReverseDraft);var _="data:text/csv;charset=utf-8,";_+="entry_id,contest_id,contest_name,P,C,1B,2B,3B,SS,OF,OF,OF\n";for(var D=0;D<n.length;D++){var h=n[D].contest_id.split("-");if(y[D].players[0].playerID.indexOf(h[0])!==-1){_=_+n[D].entry_id+","+n[D].contest_id+","+n[D].contest_name+",";for(var g="",d=0;d<y[D].players.length;d++)0==d?g+=y[D].players[d].playerID:g=g+","+y[D].players[d].playerID;_=_+g+"\n",p++}else a.$apply(function(){a.displayNewMessage("warning","WARNING: player ID does not contain contest ID, Are you sure you have the correct CSV Replace file?")})}if(p>0){var m=angular.element("<a/>");m.css({display:"none"}),angular.element(document.body).append(m);var F="";a._AllTeams.forEach(function(e){F=0==F.length?e:F+"_"+e}),m.attr({href:encodeURI(_),target:"_blank",download:"CSVReplace_"+F+".csv"})[0].click(),m.remove(),a.$apply(function(){a.displayNewMessage("success","Successfully replaced lineups in CSV")})}}else a.$apply(function(){a.displayNewMessage("danger","ERROR: # drafts: "+a._AllDraftData.length+" != "+n.length+". Both CSV File and Total Drafts must be equal.")})},o.readAsText(r),angular.forEach(angular.element("input[type='file']"),function(e){angular.element(e).val(null)})},a.updatePlayerPtsPerDollar=function(e){var l=a._AllPlayers.indexOf(e);l!==-1&&(a._AllPlayers[l]._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5),e._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5))},a.selectTopFPPGPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length){for(var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),t=l("position")(r,"P"),o=l("position")(r,"C"),n=l("position")(r,"1B"),s=l("position")(r,"2B"),i=l("position")(r,"3B"),P=l("position")(r,"SS"),c=l("position")(r,"OF"),f=0;f<t.length;f++)0!=f&&1!=f&&3!=f||a.addPlayerToPool(t[f],"P");for(var f=0;f<o.length;f++)0!=f&&1!=f&&2!=f||a.addPlayerToPool(o[f],"C");for(var f=0;f<n.length;f++)1!=f&&2!=f&&3!=f||a.addPlayerToPool(n[f],"1B");for(var f=0;f<s.length;f++)0!=f&&1!=f&&2!=f||a.addPlayerToPool(s[f],"2B");for(var f=0;f<i.length;f++)0!=f&&1!=f&&2!=f||a.addPlayerToPool(i[f],"3B");for(var f=0;f<P.length;f++)0!=f&&1!=f&&2!=f||a.addPlayerToPool(P[f],"SS");for(var f=0;f<c.length;f++)0!=f&&1!=f&&2!=f||a.addPlayerToPool(c[f],"OF1"),1!=f&&2!=f&&3!=f||a.addPlayerToPool(c[f],"OF2"),2!=f&&3!=f&&4!=f||a.addPlayerToPool(c[f],"OF3")}},a.parseFloat=function(e){return parseFloat(e)},a.clearAllPlayers=function(){a._AllPlayers=[],a._AllPlayersMASTER=[],a._AllTeams=[],a._Positions=[]},a.changeLineups=function(a){for(var l=new FormData,r=0;r<a.length;r++)l.append(a[r].name,a[r]);e.post("/api/MLB/changeLineups",l,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){},function(e){})},a.getPointsPerDollar=function(e){var a=0;return a=e._FPPG/e._Salary,a=a.toFixed(5),a=parseFloat(a)},a.resetMessage=function(){a._Message.hasData=!1,a._Message.messageType="info",a._Message.message=""},a.addRemoveTeam=function(e){a.SelectedTeam===e?a.SelectedTeam="All":a.SelectedTeam=e},a.addRemoveWeek=function(e){var l=a.SelectedWeeks.indexOf(e);l>-1?a.SelectedWeeks.splice(l,1):a.SelectedWeeks.push(e)},a.setDraftSortTypeAndReverse=function(e){if(a.sortTypeDraft=e,a.sortReverseDraft=!a.sortReverseDraft,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var r=0;r<150;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r]);else for(var r=0;r<a._AllDraftData.length;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r])},a.DownloadDraftCSV=function(){if(0==a._AllDraftData.length)return void a.displayNewMessage("danger","Error: Cannot downloaded drafts when none have been generated");var r="data:text/csv;charset=utf-8,",t=a._AllDraftData;t=l("checkValidOnly")(t,!0),t=l("orderBy")(t,a.sortTypeDraft,a.sortReverseDraft),r+="P,C,1B,2B,3B,SS,OF,OF,OF\n",t.forEach(function(e){for(var a="",l=0;l<e.players.length;l++)0==l?a+=e.players[l].playerID:a=a+","+e.players[l].playerID;r=r+a+"\n"}),e.post("/MLB/downloadDrafts",{downloadDrafts:t.length}).then(function(e){},function(e){return void 0!==e.data.error?void a.displayNewMessage("danger","Download Drafts - Failed, "+e.data.error):void a.displayNewMessage("danger","Download Drafts - Failed")});var o=angular.element("<a/>");o.css({display:"none"}),angular.element(document.body).append(o);var n="";a._AllTeams.forEach(function(e){n=0==n.length?e:n+"_"+e}),o.attr({href:encodeURI(r),target:"_blank",download:n+".csv"})[0].click(),o.remove()},a.removePlayerFromPool=function(e,l){if(a.playerInPool(e,l))switch(l){case"P":a._PPlayerPool.splice(a._PPlayerPool.indexOf(e),1);break;case"C":a._CPlayerPool.splice(a._CPlayerPool.indexOf(e),1);break;case"1B":a._1BPlayerPool.splice(a._1BPlayerPool.indexOf(e),1);break;case"2B":a._2BPlayerPool.splice(a._2BPlayerPool.indexOf(e),1);break;case"3B":a._3BPlayerPool.splice(a._3BPlayerPool.indexOf(e),1);break;case"SS":a._SSPlayerPool.splice(a._SSPlayerPool.indexOf(e),1);break;case"OF1":a._OF1PlayerPool.splice(a._OF1PlayerPool.indexOf(e),1);break;case"OF2":a._OF2PlayerPool.splice(a._OF2PlayerPool.indexOf(e),1);break;case"OF3":a._OF3PlayerPool.splice(a._OF3PlayerPool.indexOf(e),1)}},a.addPlayerToPool=function(e,l){if(""===a.SelectedPosition&&a.displayNewMessage("danger","Please select a position"),!a.playerInPool(e,l))switch(l){case"P":a._PPlayerPool.push(e);break;case"C":a._CPlayerPool.push(e);break;case"1B":a._1BPlayerPool.push(e);break;case"2B":a._2BPlayerPool.push(e);break;case"3B":a._3BPlayerPool.push(e);break;case"SS":a._SSPlayerPool.push(e);break;case"OF1":a._OF1PlayerPool.push(e);break;case"OF2":a._OF2PlayerPool.push(e);break;case"OF3":a._OF3PlayerPool.push(e)}},a.playerInPool=function(e,l){switch(l){case"P":if(a._PPlayerPool.indexOf(e)>-1)return!0;break;case"C":if(a._CPlayerPool.indexOf(e)>-1)return!0;break;case"1B":if(a._1BPlayerPool.indexOf(e)>-1)return!0;break;case"2B":if(a._2BPlayerPool.indexOf(e)>-1)return!0;break;case"3B":if(a._3BPlayerPool.indexOf(e)>-1)return!0;break;case"SS":if(a._SSPlayerPool.indexOf(e)>-1)return!0;break;case"OF1":if(a._OF1PlayerPool.indexOf(e)>-1)return!0;break;case"OF2":if(a._OF2PlayerPool.indexOf(e)>-1)return!0;break;case"OF3":if(a._OF3PlayerPool.indexOf(e)>-1)return!0}return!1},a.clearPlayerPools=function(){a._PPlayerPool=[],a._CPlayerPool=[],a._1BPlayerPool=[],a._2BPlayerPool=[],a._3BPlayerPool=[],a._SSPlayerPool=[],a._OF1PlayerPool=[],a._OF2PlayerPool=[],a._OF3PlayerPool=[]},a.averagePlayerPoolSalary=function(e){if(0==e.length)return 0;var a=0;return e.forEach(function(e){a+=e._Salary}),Math.round(a/e.length,0)},a.removeDraft=function(e){a._AllDisplayedDraftData.splice(a._AllDisplayedDraftData.indexOf(e),1);var l=a._AllDraftData.indexOf(e);a._AllDraftData.splice(l,1),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts},a.removeAllButTopN=function(){if(a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDraftData.length>o.TopLimit){for(var e=[],r=0;r<o.TopLimit;r++)e.push(a._AllDraftData[r]);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDisplayedDraftData=[];for(var t=0;t<o.TopLimit;t++)a._AllDisplayedDraftData.push(a._AllDraftData[t])}},a.clearDrafts=function(){a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0},a.setPlayerRanking=function(){var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeOut")(e),t=l("position")(r,"P"),o=l("position")(r,"C"),n=l("position")(r,"1B"),s=l("position")(r,"2B"),i=l("position")(r,"3B"),P=l("position")(r,"SS"),c=l("position")(r,"OF");a._AllPlayers.forEach(function(e){var a=[];e._Position.indexOf("P")!==-1&&a.push(t.indexOf(e)+1),e._Position.indexOf("C")!==-1&&a.push(o.indexOf(e)+1),e._Position.indexOf("1B")!==-1&&a.push(n.indexOf(e)+1),e._Position.indexOf("2B")!==-1&&a.push(s.indexOf(e)+1),e._Position.indexOf("3B")!==-1&&a.push(i.indexOf(e)+1),e._Position.indexOf("SS")!==-1&&a.push(P.indexOf(e)+1),e._Position.indexOf("OF")!==-1&&a.push(c.indexOf(e)+1);var l=0;a.forEach(function(e){l+=e}),e._Rank=parseInt(l/a.length)})},a.averageRank=function(e){var a=0;return e.forEach(function(e){a+=e._Rank}),a=parseFloat(a/e.length),a.toFixed(2)},a.addSalaryImpliedPts=function(){a._AllPlayers.forEach(function(e){e._FPPG=.004*e._Salary,e._FPPG=e._FPPG.toFixed(1),e._FPPG=parseFloat(e._FPPG),a.updatePlayerPtsPerDollar(e)})},a.buildDrafts=function(){if(0==a._PPlayerPool.length||0==a._CPlayerPool.length||0==a._1BPlayerPool.length||0==a._2BPlayerPool.length||0==a._3BPlayerPool.length||0==a._SSPlayerPool.length||0==a._OF1PlayerPool.length||0==a._OF2PlayerPool.length||0==a._OF3PlayerPool.length)return void a.displayNewMessage("danger","Error: One or more player pools contain zero players");if(a.setPlayerRanking(),a.totalPossibleDraftsToBeCreated=a._PPlayerPool.length*a._CPlayerPool.length*a._1BPlayerPool.length*a._2BPlayerPool.length*a._3BPlayerPool.length*a._SSPlayerPool.length*a._OF1PlayerPool.length*a._OF2PlayerPool.length*a._OF3PlayerPool.length,!(a.totalPossibleDraftsToBeCreated>15e3)||confirm("WARNING: Creating "+a.totalPossibleDraftsToBeCreated+" possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?")){a.clearDrafts();var r=[];if(a._PPlayerPool.forEach(function(e){var l={};l.P=e,a._CPlayerPool.forEach(function(e){l.C=e,a._1BPlayerPool.forEach(function(e){l["1B"]=e,a._2BPlayerPool.forEach(function(e){l["2B"]=e,a._3BPlayerPool.forEach(function(e){l["3B"]=e,a._SSPlayerPool.forEach(function(e){l.SS=e,a._OF1PlayerPool.forEach(function(e){l.OF1=e,a._OF2PlayerPool.forEach(function(e){l.OF2=e,a._OF3PlayerPool.forEach(function(e){l.OF3=e,a.totalPossibleCurrentDraftsCount++;var t=[];t.push(l.P),t.push(l.C),t.push(l["1B"]),t.push(l["2B"]),t.push(l["3B"]),t.push(l.SS),t.push(l.OF1),t.push(l.OF2),t.push(l.OF3);var n=[];if(n.push(l.P._Name),n.push(l.C._Name),n.push(l["1B"]._Name),n.push(l["2B"]._Name),n.push(l["3B"]._Name),n.push(l.SS._Name),n.push(l.OF1._Name),n.push(l.OF2._Name),n.push(l.OF3._Name),a.isDraftTeamValid(t)&&a.isDraftSalaryValid(t)&&!a.doesDraftHaveDupPlayers(t)&&a.validBattersVsPitcher(t)&&a.validTeamStacks(t)){var s={FPPG:parseFloat(a.getDraftFPPG(t)),Actual:parseFloat(a.getDraftActual(t)),validTeam:a.isDraftTeamValid(t),validSalary:a.isDraftSalaryValid(t),salaryLeft:parseInt(a.getDraftSalaryLeft(t)),players:t,playerNames:n,playersPositionData:angular.copy(l),displayDetails:!1,pointsPerDollar:parseFloat(a.averageValue(t)),averageRank:parseFloat(a.averageRank(t))};if(o.removeDups){var i=!1;if(r.length>0){for(var P=r.length-1;P>=0;P--){var c=0;if(n.indexOf(r[P][0])!==-1&&c++,n.indexOf(r[P][1])!==-1&&c++,n.indexOf(r[P][2])!==-1&&c++,n.indexOf(r[P][3])!==-1&&c++,n.indexOf(r[P][4])!==-1&&c++,n.indexOf(r[P][5])!==-1&&c++,n.indexOf(r[P][6])!==-1&&c++,n.indexOf(r[P][7])!==-1&&c++,n.indexOf(r[P][8])!==-1&&c++,9===c){i=!0;break}}i||(a._AllDraftData.push(s),r.push(n))}else a._AllDraftData.push(s),r.push(n)}else a._AllDraftData.push(s),r.push(n)}})})})})})})})})}),e.post("/MLB/buildDraft",{builtDrafts:a._AllDraftData.length}).then(function(e){},function(e){return void 0!==e.data.error?(a._AllDisplayedDraftData=[],a._AllDraftData=[],void a.displayNewMessage("danger","Build Failed, "+e.data.error)):void a.displayNewMessage("danger","Loading Single Saves - Failed "+e.data)}),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,!0),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var t=0;t<150;t++)a._AllDisplayedDraftData.push(a._AllDraftData[t]);else for(var t=0;t<a._AllDraftData.length;t++)a._AllDisplayedDraftData.push(a._AllDraftData[t])}},a.validTeamStacks=function(e){var a={};e.forEach(function(e){a.hasOwnProperty(e._Team)?a[e._Team]++:a[e._Team]=1});var l=!1,r="";for(var t in a)if(a[t]>=o.minTeamStack1&&o.teamsForStack1.indexOf(t)!==-1){l=!0,r=t;break}var n=!1;for(var t in a)if(a[t]>=o.minTeamStack2&&t!=r&&o.teamsForStack2.indexOf(t)!==-1){n=!0;break}return!(!n||!l)},a.validBattersVsPitcher=function(e){var a=0,l=e[0]._Opponent;return e.forEach(function(e){e._Team===l&&a++}),a<=o.battersVSPitcher},a.doesDraftHaveDupPlayers=function(e){var a=[],l=!1;return e.forEach(function(e){a.indexOf(e._Name)>-1?l=!0:a.push(e._Name)}),l},a.getDraftSalaryLeft=function(e){var a=35e3;return e.forEach(function(e){a-=e._Salary}),a=parseInt(a)},a.getPlayerPercentInPosition=function(e,l){if(a.TotalValidDrafts>0){var r=0;return a._AllDraftData.forEach(function(a){a.playersPositionData[l]._Name===e._Name&&r++}),(r/a.TotalValidDrafts*100).toFixed(0)}return 0},a.removeCalcDrafts=function(){var e=l("removeCalcDraft")(a._AllDraftData,parseFloat(o.TopRange),parseFloat(o.BottomRange),a.sortTypeDraft);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length;var r=l("checkValidOnly")(a._AllDraftData,!0);if(a.TotalValidDrafts=r.length,a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var t=0;t<150;t++)a._AllDisplayedDraftData.push(a._AllDraftData[t]);else for(var t=0;t<a._AllDraftData.length;t++)a._AllDisplayedDraftData.push(a._AllDraftData[t])},a.getDraftSalaryRemaining=function(e){var a=35e3;return e.players.forEach(function(e){a-=e._Salary}),a},a.getDraftFPPG=function(e){var a=0;return e.forEach(function(e){a+=e._FPPG}),a=parseFloat(a),a.toFixed(2)},a.getDraftActual=function(e){var a=0;return e.forEach(function(e){a+=e._ActualFantasyPoints}),a=parseFloat(a),a.toFixed(2)},a.openCloseDraftDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalDraft.html",controller:"DraftModalController",size:"lg",resolve:{draft:function(){return e}}})},a.openClosePlayerDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalPlayer.html",controller:"PlayerModalController",size:"lg",resolve:{allPlayers:function(){return a._AllPlayers},selectedPlayer:function(){return e}}})},a.openAdvanced=function(){var e=r.open({templateUrl:"/js/AngularControllers/modelAdvancedMLB.html",controller:"AdvancedControllerMLB",size:"lg",resolve:{minTeamStack1:function(){return o.minTeamStack1},minTeamStack2:function(){return o.minTeamStack2},battersVSPitcher:function(){return o.battersVSPitcher},allTeams:function(){return a._AllTeams},teamsForStack1:function(){return o.teamsForStack1},teamsForStack2:function(){return o.teamsForStack2}}});e.result.then(function(e){o.minTeamStack1=e.minTeamStack1,o.minTeamStack2=e.minTeamStack2,o.battersVSPitcher=e.battersVSPitcher,o.teamsForStack1=e.teamsForStack1,o.teamsForStack2=e.teamsForStack2},function(){})},a.isDraftSalaryValid=function(e){var a=35e3;return e.forEach(function(e){a-=e._Salary}),a>=0},a.averageValue=function(e){var a=0;return e.forEach(function(e){a=parseFloat(a)+parseFloat(e._ProjectedPointsPerDollar)}),a=parseFloat(a),(a/e.length).toFixed(5)},a.isDraftTeamValid=function(e){var a={};e.forEach(function(e){a.hasOwnProperty(e._Team)?a[e._Team]=a[e._Team]+1:a[e._Team]=1});for(team in a){var l=a[team];if(l>4)return!1}return!(Object.keys(a).length<3)},a.clearAllPlayerFilters=function(){a.SelectedTeam="All",a.SelectedWeeks=[]},a.openSaveDialog=function(){a.savedPastSettings=[];var e={_AllPlayers:a._AllPlayers,_PPlayerPool:a._PPlayerPool,_CPlayerPool:a._CPlayerPool,_1BPlayerPool:a._1BPlayerPool,_2BPlayerPool:a._2BPlayerPool,_3BPlayerPool:a._3BPlayerPool,_SSPlayerPool:a._SSPlayerPool,_OF1PlayerPool:a._OF1PlayerPool,_OF2PlayerPool:a._OF2PlayerPool,_OF3PlayerPool:a._OF3PlayerPool,TopRange:o.TopRange,BottomRange:o.BottomRange,TopLimit:o.TopLimit,battersVSPitcher:o.battersVSPitcher},l=r.open({templateUrl:"/js/AngularControllers/saveDialog.html",controller:"SaveModalController",size:"lg",backdrop:"static",resolve:{postObject:function(){return e},currentRead:function(){return a.currentRead},site:function(){return"FanDuel"}}});l.result.then(function(e){a.currentRead=e.readData,a.loadPlayersFromSave(e.postObject),a.mainTabHeading="Players - "+e.title},function(){})},a.read=function(l){e.post("/MLB/read",{id:l}).then(function(e){a.currentRead=e.data,a.loadPlayersFromSave(JSON.parse(a.currentRead.userSaveJSON)),a.mainTabHeading="Players - "+a.currentRead.title},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading Single Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading Single Saves - Failed")})},a.loadHistory=function(){e.post("/MLB/loadHistory",{endIndex:a.savedPastSettings.length}).then(function(e){var l=e.data;l.forEach(function(e){a.savedPastSettings.push(e)})},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading More Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading More Saves - Failed")})},a.setDeleteConfirmation=function(e){a.DeleteConfirmationID=e},a.unsetDeleteConfirmation=function(){a.DeleteConfirmationID=-1},a.showDeleteConfirmation=function(e){return a.DeleteConfirmationID==e},a["delete"]=function(l){e.post("/MLB/delete",{id:l}).then(function(e){for(var r=-1,t=0;t<a.savedPastSettings.length;t++)if(a.savedPastSettings[t].id==l){r=t;break}a.savedPastSettings.splice(r,1),a.displayNewMessage("success","Deleting #"+l+" - Success")},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Deleting - Failed, "+e.data.error):a.displayNewMessage("danger","Deleting - Failed")})},a.updateTitle=function(l,r){e.post("/MLB/updateTitle",{id:l,title:r}).then(function(e){a.displayNewMessage("success","Title Update - Success, Saved: "+r)},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Title Update - Failed,"+e.data.error):void 0!==e.data.title?a.displayNewMessage("danger","Title Update - Failed, "+e.data.title):a.displayNewMessage("danger","Title Update - Failed")})},a.loadPlayerInPool=function(e,l,r){e.forEach(function(e){e._Name==l._Name&&e._Position==l._Position&&e._Team==l._Team&&a.addPlayerToPool(l,r)})},a.loadPlayersFromSave=function(e){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a._AllPlayers=e._AllPlayers,a._AllPlayersMASTER=e._AllPlayers,o.TopRange=parseFloat(e.TopRange),o.BottomRange=parseFloat(e.BottomRange),o.TopLimit=parseInt(e.TopLimit),a._AllPlayers.forEach(function(l){0==a._AllTeams.length?a._AllTeams.push(l._Team):a._AllTeams.indexOf(l._Team)==-1&&a._AllTeams.push(l._Team),a.loadPlayerInPool(e._PPlayerPool,l,"P"),a.loadPlayerInPool(e._CPlayerPool,l,"C"),a.loadPlayerInPool(e._1BPlayerPool,l,"1B"),a.loadPlayerInPool(e._2BPlayerPool,l,"2B"),a.loadPlayerInPool(e._3BPlayerPool,l,"3B"),a.loadPlayerInPool(e._SSPlayerPool,l,"SS"),a.loadPlayerInPool(e._OF1PlayerPool,l,"OF1"),a.loadPlayerInPool(e._OF2PlayerPool,l,"OF2"),a.loadPlayerInPool(e._OF3PlayerPool,l,"OF3")}),a.displayNewMessage("success","Previous save loaded successfully.")}}])}]);