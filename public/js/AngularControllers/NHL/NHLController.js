!function(e){function a(r){if(l[r])return l[r].exports;var o=l[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,a),o.l=!0,o.exports}var l={};return a.m=e,a.c=l,a.i=function(e){return e},a.d=function(e,a,l){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:l})},a.n=function(e){var l=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(l,"a",l),l},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=0)}([function(e,a){angular.module("NHLApp").controller("NHLController",["$http","$scope","$filter","$uibModal","$window",function(e,a,l,r,o){var t=this;a.alerts=[{type:"info",msg:"Please Upload/Load Players...",number:1}],a._Positions=[],a._AllTeams=[],a._AllWeeks=[],a._AllPlayersMASTER=[],a._AllPlayers=[],a._AllReadPlayerIDs=[],a._AllStacks=[],a._C1PlayerPool=[],a._C2PlayerPool=[],a._W1PlayerPool=[],a._W2PlayerPool=[],a._W3PlayerPool=[],a._W4PlayerPool=[],a._D1PlayerPool=[],a._D2PlayerPool=[],a._GPlayerPool=[],a._AllDisplayedDraftData=[],a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0,a.SelectedValidDrafts=!0,a.sortTypeDraft="FPPG",a.sortType="_Salary",a.sortReverse=!0,a.sortReverseDraft=!0,a.SelectedPosition="C1",a.SelectedTeam="All",a.SelectedStackPositions=[],a.SelectedDraft=null,a.totalPossibleDraftsToBeCreated=0,a.totalPossibleCurrentDraftsCount=0,a.tempDrafts=[],a.tempPlayerNamesList=[],a.AVERAGE=parseFloat(-1),a.STDEVIATION=parseFloat(-1),a.TopRange=-1,a.BottomRange=-1,t.TopLimit=150,t.TopRange=-1,t.BottomRange=-1,t.removeDups=!0,a.savedPastSettings=[],a.currentRead=null,a._AllPlayers=l("team")(a._AllPlayers,a.SelectedTeam),a._AllPlayers=l("position")(a._AllPlayers,a.SelectedPosition),a.mainTabHeading="Players",a.DeleteConfirmationID=-1;a.displayNewMessage=function(e,l){o.scrollTo(0,0),a.addAlert(e,l)},a.addAlert=function(e,l){var r=1;a.alerts.length>100&&(a.alerts=[]),a.alerts.forEach(function(a){a.type==e&&a.msg==l&&r++}),l.indexOf("Unauthenticated")!==-1?a.alerts.push({type:e,msg:l,number:r,login:!0}):a.alerts.push({type:e,msg:l,number:r,login:!1})},a.closeAlert=function(e){a.alerts.splice(e,1)},a.loadProjectionsAsActual=function(e){var l=e.target.files[0],r="",o=new FileReader;o.onload=function(e){r=o.result;for(var l=r.split(/\r\n|\n/),t=0;t<l.length;t++){for(var n=l[t].split(","),s="",i="",P="",d=0,f=0,c="",y="",u=0;u<n.length;u++)switch(u){case 0:var p=n[u].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),D=p.split(" ");i=D[0],P=2==D.length?D[1]:D[2];break;case 1:f=parseInt(n[u].replace('"',"").replace('"',"").replace("$","").trim());break;case 2:c=n[u].replace('"',"").replace('"',"").trim();break;case 3:s=n[u].replace('"',"").replace('"',"").trim();break;case 4:y=n[u].replace('"',"").replace('"',"").trim();break;case 7:d=parseFloat(n[u].replace('"',"").replace('"',"").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(i)&&e._Name.includes(P)&&e._Position==s&&(e._ActualFantasyPoints=d)})}},a.$apply(function(){a.displayNewMessage("success","Player projections loaded as actual Success")}),o.readAsText(l)},a.loadActual=function(e){var l=e.target.files[0],r="",o=new FileReader;o.onload=function(e){r=o.result;for(var l=r.split(/\r\n|\n/),t=(l[0].split(","),1);t<l.length;t++){for(var n=l[t].split(";"),s="",i="",P="",d=0,f=0,c=0;c<n.length;c++)switch(c){case 2:s=n[c].replace('"',"").replace('"',"").trim();break;case 3:var y=n[c].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),u=y.split(" ");i=u[0],P=2==u.length?u[1]:u[2];break;case 5:d=parseFloat(n[c].replace('"',"").replace('"',"").trim());break;case 6:f=parseInt(n[c].replace('"',"").replace('"',"").replace("$","").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(i)&&e._Name.includes(P)&&e._Position==s&&(e._ActualFantasyPoints=d),a._Positions.indexOf(e._Postion)===-1&&a._Positions.push(e._Position)})}a._Positions.sort(),a.$apply(function(){a.displayNewMessage("success","Player Actual Results have been successfully loaded")})},o.readAsText(l)},a.loadPlayers=function(l){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a.currentRead=null,a.mainTabHeading="Players";var r=new FormData;r.append("csvFile",l.target.files[0]),e.post("/NHL/loadFanDuelPlayers",r,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){e.data.forEach(function(e){e._Salary=parseFloat(e._Salary),e._FPPG=parseFloat(e._FPPG),e._FPPG=e._FPPG.toFixed(2),e._FPPG=parseFloat(e._FPPG);var l=parseFloat((e._FPPG/e._Salary).toFixed(5));e._ProjectedPointsPerDollar=l,"O"==e._playerInjured||"IR"===e._playerInjured?e._playerInjured="danger":"DTD"==e._playerInjured&&(e._playerInjured="warning"),0==a._AllTeams.length?a._AllTeams.push(e._Team):a._AllTeams.indexOf(e._Team)==-1&&a._AllTeams.push(e._Team),a._AllPlayers.push(e),a._AllPlayersMASTER.push(e)}),a._AllPlayers.length>0&&a.displayNewMessage("success","Players have been successfully loaded")},function(e){a.displayNewMessage("danger","Error: Players could not be loaded.")})},a.selectTopActualPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length)for(var e=l("orderBy")(a._AllPlayers,"_ActualFantasyPoints",!0),r=l("position")(e,"C"),o=l("position")(e,"W"),t=l("position")(e,"D"),n=l("position")(e,"G"),s=0;s<5;s++)s<3&&(a.addPlayerToPool(r[s],"C1"),a.addPlayerToPool(o[s],"W1"),a.addPlayerToPool(t[s],"D1"),a.addPlayerToPool(n[s],"G")),s>0&&(a.addPlayerToPool(r[s],"C2"),a.addPlayerToPool(o[s],"W2"),a.addPlayerToPool(o[s],"W3"),a.addPlayerToPool(o[s],"W4"),a.addPlayerToPool(t[s],"D2"),a.addPlayerToPool(n[s],"G"))},a.setAndUnsetPosition=function(e){a.SelectedPosition===e||(a.SelectedPosition=e)},a.updatePlayerPtsPerDollar=function(e){var l=a._AllPlayers.indexOf(e);l!==-1&&(a._AllPlayers[l]._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5),e._ProjectedPointsPerDollar=parseFloat(e._FPPG/e._Salary).toFixed(5))},a.selectTopFPPGPlayers=function(){if(a.clearPlayerPools(),0!==a._AllPlayers.length){for(var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),o=l("position")(r,"C"),t=l("position")(r,"W"),n=l("position")(r,"D"),s=l("position")(r,"G"),i=0;i<o.length;i++)0!=i&&1!=i||a.addPlayerToPool(o[i],"C1"),1!=i&&2!=i&&3!=i||a.addPlayerToPool(o[i],"C2");for(var i=0;i<t.length;i++)0!=i&&1!=i&&2!=i||a.addPlayerToPool(t[i],"W1"),1!=i&&2!=i&&3!=i&&4!=i||a.addPlayerToPool(t[i],"W2"),2!=i&&3!=i&&4!=i&&5!=i||a.addPlayerToPool(t[i],"W3"),3!=i&&4!=i&&5!=i&&6!=i||a.addPlayerToPool(t[i],"W4");for(var i=0;i<n.length;i++)0!=i&&1!=i||a.addPlayerToPool(n[i],"D1"),1!=i&&2!=i&&3!=i||a.addPlayerToPool(n[i],"D2");for(var i=0;i<s.length;i++)0!=i&&1!=i&&2!=i||a.addPlayerToPool(s[i],"G")}},a.parseFloat=function(e){return parseFloat(e)},a.clearAllPlayers=function(){a._AllPlayers=[],a._AllPlayersMASTER=[],a._AllTeams=[],a._Positions=[]},a.changeLineups=function(a){for(var l=new FormData,r=0;r<a.length;r++)l.append(a[r].name,a[r]);e.post("/api/NHL/changeLineups",l,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){},function(e){})},a.getPointsPerDollar=function(e){var a=0;return a=e._FPPG/e._Salary,a=a.toFixed(5),a=parseFloat(a)},a.resetMessage=function(){a._Message.hasData=!1,a._Message.messageType="info",a._Message.message=""},a.addRemoveTeam=function(e){a.SelectedTeam===e?a.SelectedTeam="All":a.SelectedTeam=e},a.addRemoveWeek=function(e){var l=a.SelectedWeeks.indexOf(e);l>-1?a.SelectedWeeks.splice(l,1):a.SelectedWeeks.push(e)},a.setDraftSortTypeAndReverse=function(e){if(a.sortTypeDraft=e,a.sortReverseDraft=!a.sortReverseDraft,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var r=0;r<150;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r]);else for(var r=0;r<a._AllDraftData.length;r++)a._AllDisplayedDraftData.push(a._AllDraftData[r])},a.DownloadDraftCSV=function(){if(0==a._AllDraftData.length)return void a.displayNewMessage("danger","Error: Cannot downloaded drafts when none have been generated");var r="data:text/csv;charset=utf-8,",o=a._AllDraftData;o=l("checkValidOnly")(o,!0),o=l("orderBy")(o,a.sortTypeDraft,a.sortReverseDraft),r+="C,C,W,W,W,W,D,D,G\n",o.forEach(function(e){for(var a="",l=0;l<e.players.length;l++)0==l?a+=e.players[l].playerID:a=a+","+e.players[l].playerID;r=r+a+"\n"}),e.post("/NHL/downloadDrafts",{downloadDrafts:o.length}).then(function(e){},function(e){return void 0!==e.data.error?void a.displayNewMessage("danger","Download Drafts - Failed, "+e.data.error):void a.displayNewMessage("danger","Download Drafts - Failed")});var t=angular.element("<a/>");t.css({display:"none"}),angular.element(document.body).append(t);var n="";a._AllTeams.forEach(function(e){n=0==n.length?e:n+"_"+e}),t.attr({href:encodeURI(r),target:"_blank",download:n+".csv"})[0].click(),t.remove()},a.removePlayerFromPool=function(e,l){if(a.playerInPool(e,l))switch(l){case"C1":a._C1PlayerPool.splice(a._C1PlayerPool.indexOf(e),1);break;case"C2":a._C2PlayerPool.splice(a._C2PlayerPool.indexOf(e),1);break;case"W1":a._W1PlayerPool.splice(a._W1PlayerPool.indexOf(e),1);break;case"W2":a._W2PlayerPool.splice(a._W2PlayerPool.indexOf(e),1);break;case"W3":a._W3PlayerPool.splice(a._W3PlayerPool.indexOf(e),1);break;case"W4":a._W4PlayerPool.splice(a._W4PlayerPool.indexOf(e),1);break;case"D1":a._D1PlayerPool.splice(a._D1PlayerPool.indexOf(e),1);break;case"D2":a._D2PlayerPool.splice(a._D2PlayerPool.indexOf(e),1);break;case"G":a._GPlayerPool.splice(a._GPlayerPool.indexOf(e),1)}},a.addPlayerToPool=function(e,l){if(""===a.SelectedPosition&&a.displayNewMessage("danger","Please select a position"),!a.playerInPool(e,l))switch(l){case"C1":a._C1PlayerPool.push(e);break;case"C2":a._C2PlayerPool.push(e);break;case"W1":a._W1PlayerPool.push(e);break;case"W2":a._W2PlayerPool.push(e);break;case"W3":a._W3PlayerPool.push(e);break;case"W4":a._W4PlayerPool.push(e);break;case"D1":a._D1PlayerPool.push(e);break;case"D2":a._D2PlayerPool.push(e);break;case"G":a._GPlayerPool.push(e)}},a.playerInPool=function(e,l){switch(l){case"C1":if(a._C1PlayerPool.indexOf(e)>-1)return!0;break;case"C2":if(a._C2PlayerPool.indexOf(e)>-1)return!0;break;case"W1":if(a._W1PlayerPool.indexOf(e)>-1)return!0;break;case"W2":if(a._W2PlayerPool.indexOf(e)>-1)return!0;break;case"W3":if(a._W3PlayerPool.indexOf(e)>-1)return!0;break;case"W4":if(a._W4PlayerPool.indexOf(e)>-1)return!0;break;case"D1":if(a._D1PlayerPool.indexOf(e)>-1)return!0;break;case"D2":if(a._D2PlayerPool.indexOf(e)>-1)return!0;break;case"G":if(a._GPlayerPool.indexOf(e)>-1)return!0}return!1},a.clearPlayerPools=function(){a._C1PlayerPool=[],a._C2PlayerPool=[],a._W1PlayerPool=[],a._W2PlayerPool=[],a._W3PlayerPool=[],a._W4PlayerPool=[],a._D1PlayerPool=[],a._D2PlayerPool=[],a._GPlayerPool=[]},a.averagePlayerPoolSalary=function(e){if(0==e.length)return 0;var a=0;return e.forEach(function(e){a+=e._Salary}),Math.round(a/e.length,0)},a.removeDraft=function(e){a._AllDisplayedDraftData.splice(a._AllDisplayedDraftData.indexOf(e),1);var l=a._AllDraftData.indexOf(e);a._AllDraftData.splice(l,1),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts},a.removeAllButTopN=function(){if(a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,a.sortReverseDraft),a._AllDraftData.length>t.TopLimit){for(var e=[],r=0;r<t.TopLimit;r++)e.push(a._AllDraftData[r]);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDisplayedDraftData=[];for(var o=0;o<t.TopLimit;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])}},a.clearDrafts=function(){a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0},a.setPlayerRanking=function(){var e=l("orderBy")(a._AllPlayers,"_FPPG",!0),r=l("removeInjured")(e),o=l("position")(r,"C"),t=l("position")(r,"W"),n=l("position")(r,"D"),s=l("position")(r,"G"),i=l("removeOut")(e),P=l("position")(i,"C"),d=l("position")(i,"W"),f=l("position")(i,"D"),c=l("position")(i,"G");a._AllPlayers.forEach(function(e){var a=99;if(e._playerInjured)switch(e._Position){case"C":a=P.indexOf(e)+1;break;case"W":a=d.indexOf(e)+1;break;case"D":a=f.indexOf(e)+1;break;case"G":a=c.indexOf(e)+1}else switch(e._Position){case"C":a=o.indexOf(e)+1;break;case"W":a=t.indexOf(e)+1;break;case"D":a=n.indexOf(e)+1;break;case"G":a=s.indexOf(e)+1}e._Rank=a})},a.averageRank=function(e){var a=0;return e.forEach(function(e){a+=e._Rank}),a=parseFloat(a/e.length),a.toFixed(2)},a.buildDrafts=function(){if(0==a._C1PlayerPool.length||0==a._C2PlayerPool.length||0==a._W1PlayerPool.length||0==a._W2PlayerPool.length||0==a._W3PlayerPool.length||0==a._W4PlayerPool.length||0==a._D1PlayerPool.length||0==a._D2PlayerPool.length||0==a._GPlayerPool.length)return void a.displayNewMessage("danger","Error: One or more player pools contain zero players");if(a.setPlayerRanking(),a.totalPossibleDraftsToBeCreated=a._C1PlayerPool.length*a._C2PlayerPool.length*a._W1PlayerPool.length*a._W2PlayerPool.length*a._W3PlayerPool.length*a._W4PlayerPool.length*a._D1PlayerPool.length*a._D2PlayerPool.length*a._GPlayerPool.length,!(a.totalPossibleDraftsToBeCreated>15e3)||confirm("Creating "+a.totalPossibleDraftsToBeCreated+" possible drafts can take longer than expected. It can crash your session if loaded with to much memory, save your data. Are you sure you want to create?")){a.clearDrafts();var r=[];if(a._C1PlayerPool.forEach(function(e){var l={};l.C1=e,a._C2PlayerPool.forEach(function(e){l.C2=e,a._W1PlayerPool.forEach(function(e){l.W1=e,a._W2PlayerPool.forEach(function(e){l.W2=e,a._W3PlayerPool.forEach(function(e){l.W3=e,a._W4PlayerPool.forEach(function(e){l.W4=e,a._D1PlayerPool.forEach(function(e){l.D1=e,a._D2PlayerPool.forEach(function(e){l.D2=e,a._GPlayerPool.forEach(function(e){a.totalPossibleCurrentDraftsCount++,l.G=e;var o=[];o.push(l.C1),o.push(l.C2),o.push(l.W1),o.push(l.W2),o.push(l.W3),o.push(l.W4),o.push(l.D1),o.push(l.D2),o.push(l.G);var n={};if(n.C=[],n.W=[],n.D=[],n.G=[],o.forEach(function(e){n[e._Position].push(e)}),a.isDraftTeamValid(o)&&a.isDraftSalaryValid(o)&&!a.doesDraftHaveDupPlayers(o)){var s={FPPG:parseFloat(a.getDraftFPPG(o)),Actual:parseFloat(a.getDraftActual(o)),validTeam:a.isDraftTeamValid(o),validSalary:a.isDraftSalaryValid(o),salaryLeft:parseInt(a.getDraftSalaryLeft(o)),players:o,playerNames:n,playersPositionData:angular.copy(l),displayDetails:!1,pointsPerDollar:parseFloat(a.averageValue(o)),averageRank:parseFloat(a.averageRank(o))};if(t.removeDups){var i=!1;if(r.length>0){for(var P=r.length-1;P>=0;P--){var d=0;if(n.C.indexOf(r[P].C[0])!==-1&&d++,n.C.indexOf(r[P].C[1])!==-1&&d++,n.W.indexOf(r[P].W[0])!==-1&&d++,n.W.indexOf(r[P].W[1])!==-1&&d++,n.W.indexOf(r[P].W[2])!==-1&&d++,n.W.indexOf(r[P].W[3])!==-1&&d++,n.D.indexOf(r[P].D[0])!==-1&&d++,n.D.indexOf(r[P].D[1])!==-1&&d++,n.G.indexOf(r[P].G[0])!==-1&&d++,9===d){i=!0;break}}i||(a._AllDraftData.push(s),r.push(n))}else a._AllDraftData.push(s),r.push(n)}else a._AllDraftData.push(s),r.push(n)}})})})})})})})})}),e.post("/NHL/buildDraft",{builtDrafts:a._AllDraftData.length}).then(function(e){},function(e){return void 0!==e.data.error?(a._AllDisplayedDraftData=[],a._AllDraftData=[],void a.displayNewMessage("danger","Build Failed, "+e.data.error)):void a.displayNewMessage("danger","Loading Single Saves - Failed "+e.data)}),a.TotalPossibleDrafts=a._AllDraftData.length,a.TotalValidDrafts=a.TotalPossibleDrafts,a._AllDraftData=l("orderBy")(a._AllDraftData,a.sortTypeDraft,!0),a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var o=0;o<150;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o]);else for(var o=0;o<a._AllDraftData.length;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])}},a.doesDraftHaveDupPlayers=function(e){var a=[],l=!1;return e.forEach(function(e){a.indexOf(e._Name)>-1?l=!0:a.push(e._Name)}),l},a.getDraftSalaryLeft=function(e){var a=55e3;return e.forEach(function(e){a-=e._Salary}),a=parseInt(a)},a.getPlayerPercentInPosition=function(e,l){if(a.TotalValidDrafts>0){var r=0;return a._AllDraftData.forEach(function(a){a.playersPositionData[l]._Name===e._Name&&r++}),(r/a.TotalValidDrafts*100).toFixed(0)}return 0},a.removeCalcDrafts=function(){var e=l("removeCalcDraft")(a._AllDraftData,parseFloat(t.TopRange),parseFloat(t.BottomRange),a.sortTypeDraft);a._AllDraftData=e,a.TotalPossibleDrafts=a._AllDraftData.length;var r=l("checkValidOnly")(a._AllDraftData,!0);if(a.TotalValidDrafts=r.length,a._AllDisplayedDraftData=[],a._AllDraftData.length>150)for(var o=0;o<150;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o]);else for(var o=0;o<a._AllDraftData.length;o++)a._AllDisplayedDraftData.push(a._AllDraftData[o])},a.getDraftSalaryRemaining=function(e){var a=55e3;return e.players.forEach(function(e){a-=e._Salary}),a},a.getDraftFPPG=function(e){var a=0;return e.forEach(function(e){a+=e._FPPG}),a=parseFloat(a),a.toFixed(2)},a.getDraftActual=function(e){var a=0;return e.forEach(function(e){a+=e._ActualFantasyPoints}),a=parseFloat(a),a.toFixed(2)},a.openCloseDraftDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalDraft.html",controller:"DraftModalController",size:"lg",resolve:{draft:function(){return e}}})},a.openClosePlayerDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalPlayer.html",controller:"PlayerModalController",size:"lg",resolve:{allPlayers:function(){return a._AllPlayers},selectedPlayer:function(){return e}}})},a.isDraftSalaryValid=function(e){var a=55e3;return e.forEach(function(e){a-=e._Salary}),a>=0},a.averageValue=function(e){var a=0;return e.forEach(function(e){a=parseFloat(a)+parseFloat(e._ProjectedPointsPerDollar)}),a=parseFloat(a),(a/e.length).toFixed(5)},a.isDraftTeamValid=function(e){var a={};e.forEach(function(e){a.hasOwnProperty(e._Team)?a[e._Team]=a[e._Team]+1:a[e._Team]=1});for(team in a){var l=a[team];if(l>4)return!1}return!0},a.clearAllPlayerFilters=function(){a.SelectedTeam="All",a.SelectedWeeks=[]},a.openSaveDialog=function(){a.savedPastSettings=[];var e={_AllPlayers:a._AllPlayers,_C1PlayerPool:a._C1PlayerPool,_C2PlayerPool:a._C2PlayerPool,_W1PlayerPool:a._W1PlayerPool,_W2PlayerPool:a._W2PlayerPool,_W3PlayerPool:a._W3PlayerPool,_W4PlayerPool:a._W4PlayerPool,_D1PlayerPool:a._D1PlayerPool,_D2PlayerPool:a._D2PlayerPool,_GPlayerPool:a._GPlayerPool,TopRange:t.TopRange,BottomRange:t.BottomRange,TopLimit:t.TopLimit},l=r.open({templateUrl:"/js/AngularControllers/saveDialog.html",controller:"SaveModalController",size:"lg",backdrop:"static",resolve:{postObject:function(){return e},currentRead:function(){return a.currentRead},site:function(){return"FanDuel"}}});l.result.then(function(e){a.currentRead=e.readData,a.loadPlayersFromSave(e.postObject),a.mainTabHeading="Players - "+e.title},function(){})},a.read=function(l){e.post("/NHL/read",{id:l}).then(function(e){a.currentRead=e.data,a.loadPlayersFromSave(JSON.parse(a.currentRead.userSaveJSON)),a.mainTabHeading="Players - "+a.currentRead.title},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading Single Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading Single Saves - Failed")})},a.loadHistory=function(){e.post("/NHL/loadHistory",{endIndex:a.savedPastSettings.length}).then(function(e){var l=e.data;l.forEach(function(e){a.savedPastSettings.push(e)})},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Loading More Saves - Failed, "+e.data.error):a.displayNewMessage("danger","Loading More Saves - Failed")})},a.setDeleteConfirmation=function(e){a.DeleteConfirmationID=e},a.unsetDeleteConfirmation=function(){a.DeleteConfirmationID=-1},a.showDeleteConfirmation=function(e){return a.DeleteConfirmationID==e},a["delete"]=function(l){e.post("/NHL/delete",{id:l}).then(function(e){for(var r=-1,o=0;o<a.savedPastSettings.length;o++)if(a.savedPastSettings[o].id==l){r=o;break}a.savedPastSettings.splice(r,1),a.displayNewMessage("success","Deleting #"+l+" - Success")},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Deleting - Failed, "+e.data.error):a.displayNewMessage("danger","Deleting - Failed")})},a.updateTitle=function(l,r){e.post("/NHL/updateTitle",{id:l,title:r}).then(function(e){a.displayNewMessage("success","Title Update - Success, Saved: "+r)},function(e){void 0!==e.data.error?a.displayNewMessage("danger","Title Update - Failed,"+e.data.error):void 0!==e.data.title?a.displayNewMessage("danger","Title Update - Failed, "+e.data.title):a.displayNewMessage("danger","Title Update - Failed")})},a.loadPlayerInPool=function(e,l,r){e.forEach(function(e){e._Name==l._Name&&e._Position==l._Position&&e._Team==l._Team&&a.addPlayerToPool(l,r)})},a.loadPlayersFromSave=function(e){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a.clearAllPlayerFilters(),a._AllPlayers=e._AllPlayers,a._AllPlayersMASTER=e._AllPlayers,t.TopRange=parseFloat(e.TopRange),t.BottomRange=parseFloat(e.BottomRange),t.TopLimit=parseInt(e.TopLimit),a._AllPlayers.forEach(function(l){0==a._AllTeams.length?a._AllTeams.push(l._Team):a._AllTeams.indexOf(l._Team)==-1&&a._AllTeams.push(l._Team),a.loadPlayerInPool(e._C1PlayerPool,l,"C1"),a.loadPlayerInPool(e._C2PlayerPool,l,"C2"),a.loadPlayerInPool(e._W1PlayerPool,l,"W1"),a.loadPlayerInPool(e._W2PlayerPool,l,"W2"),a.loadPlayerInPool(e._W3PlayerPool,l,"W3"),a.loadPlayerInPool(e._W4PlayerPool,l,"W4"),a.loadPlayerInPool(e._D1PlayerPool,l,"D1"),a.loadPlayerInPool(e._D2PlayerPool,l,"D2"),a.loadPlayerInPool(e._GPlayerPool,l,"G")}),a.displayNewMessage("success","Previous save loaded successfully.")}}])}]);