!function(e){function a(r){if(l[r])return l[r].exports;var o=l[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,a),o.l=!0,o.exports}var l={};return a.m=e,a.c=l,a.i=function(e){return e},a.d=function(e,a,l){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:l})},a.n=function(e){var l=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(l,"a",l),l},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=0)}([function(e,a){angular.module("NHLApp").controller("NHLController",["$http","$scope","$filter","$uibModal","$window",function(e,a,l,r,o){a._Message={hasData:!0,messageType:"info",message:"NHL is currently in a very old state, thus not being worked on currently. Want NHL support? email support@dfscombine.com"},a._Positions=[],a._AllTeams=[],a._AllWeeks=[],a._AllPlayersMASTER=[],a._AllPlayers=[],a._AllReadPlayerIDs=[],a._AllStacks=[],a._CPlayerLocked=[],a._WPlayerLocked=[],a._DPlayerLocked=[],a._GPlayerLocked=[],a._CPlayerPool=[],a._WPlayerPool=[],a._DPlayerPool=[],a._GPlayerPool=[],a._AllDrafts=[],a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0,a.SelectedValidDrafts=!1,a.sortType="_FPPG",a.sortReverse=!0,a.sortReverseDraft=!1,a.SelectedPosition="",a.SelectedTeams=[],a.SelectedStackPositions=[],a.SelectedDraft=null,a.savedPastSettings=[],a.AVERAGE=parseFloat(-1),a.STDEVIATION=parseFloat(-1),a.TopRange=-1,a.BottomRange=-1,a._AllPlayers=l("team")(a._AllPlayers,a.SelectedTeams),a._AllPlayers=l("position")(a._AllPlayers,a.SelectedPosition);a.displayNewMessage=function(e,l){o.scrollTo(0,0),a._Message.message="",a._Message.hasData=!0,a._Message.messageType=e,a._Message.message=l},a.loadActual=function(e){var l="",r=new FileReader;r.onload=function(e){l=r.result;for(var o=l.split(/\r\n|\n/),t=(o[0].split(","),1);t<o.length;t++){for(var n=o[t].split(";"),s="",c="",i="",P=0,d=0,f=0;f<n.length;f++)switch(f){case 2:s=n[f].replace('"',"").replace('"',"").trim();break;case 3:var y=n[f].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim(),_=y.split(" ");c=_[0],i=2==_.length?_[1]:_[2];break;case 5:P=parseFloat(n[f].replace('"',"").replace('"',"").trim());break;case 6:d=parseInt(n[f].replace('"',"").replace('"',"").replace("$","").trim())}a._AllPlayers.forEach(function(e){e._Name.includes(c)&&e._Name.includes(i)&&e._Position==s&&(e._ActualFantasyPoints=P)})}a.displayNewMessage("info","Player Actual Results have been successfully loaded")},r.readAsText(e[0])},a.loadPlayers=function(e){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers();var l="",r=new FileReader;r.onload=function(e){l=r.result;for(var o=l.split(/\r\n|\n/),t=(o[0].split(","),1);t<o.length;t++){for(var n=o[t].split(","),s="",c="",i="",P="",d="",f="",y=0,_=0,u=!1,p="",h="",k=0;k<n.length;k++)switch(k){case 0:s=n[k].replace('"',"").replace('"',"").trim();break;case 1:c=n[k].replace('"',"").replace('"',"").trim();break;case 2:i=n[k].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim();break;case 4:P=n[k].replace('"',"").replace('"',"").replace("Jr.","").replace("Sr.","").trim();break;case 5:y=parseFloat(n[k].replace('"',"").replace('"',"").trim()),y=parseFloat(y.toFixed(2));break;case 7:_=parseInt(n[k].replace('"',"").replace('"',"").trim());break;case 8:h=n[k].replace('"',"").replace('"',"").trim();break;case 9:d=n[k].replace('"',"").replace('"',"").trim();break;case 10:f=n[k].replace('"',"").replace('"',"").trim();break;case 11:n[k].replace('"',"").replace('"',"").trim().length>0&&(u=n[k].replace('"',"").replace('"',"").trim(),"O"==u||"IR"==u?u="danger":(u="GTD")&&(u="warning"));break;case 12:p=n[k].replace('"',"").replace('"',"").trim()}var D=parseFloat((y/_).toFixed(5)),m={playerID:s,_Position:c,_Name:i+" "+P,_FPPG:y,_ActualFantasyPoints:-1,_Team:d,_Opponent:f,_Salary:_,_ProjectedPointsPerDollar:D,_playerInjured:u,_playerInjuryDetails:p,_Game:h,_PercentInDrafts:-1,_TimesInDrafts:0,_TimesInValidDrafts:0};a._AllPlayers.push(m),a._AllPlayersMASTER.push(m),0==a._AllTeams.length?a._AllTeams.push(m._Team):a._AllTeams.indexOf(m._Team)==-1&&a._AllTeams.push(m._Team)}a.displayNewMessage("info","Players have been successfully loaded")},r.readAsText(e[0])},a.parseFloat=function(e){return parseFloat(e)},a.clearAllPlayers=function(){a._AllPlayers=[],a._AllPlayersMASTER=[],a._AllTeams=[]},a.changeLineups=function(a){for(var l=new FormData,r=0;r<a.length;r++)l.append(a[r].name,a[r]);e.post("/api/NBA/changeLineups",l,{headers:{"Content-Type":void 0,transformRequest:angular.identity}}).then(function(e){},function(e){})},a.getPointsPerDollar=function(e){var a=0;return a=e._FPPG/e._Salary,a=a.toFixed(5),a=parseFloat(a)},a.resetMessage=function(){a._Message.hasData=!1,a._Message.messageType="info",a._Message.message=""},a.addTeam=function(e){SelectedTeams.indexOf(e)==-1&&SelectedTeams.push(e)},a.addRemoveTeam=function(e){var l=a.SelectedTeams.indexOf(e);l>-1?a.SelectedTeams.splice(l,1):a.SelectedTeams.push(e)},a.addRemoveWeek=function(e){var l=a.SelectedWeeks.indexOf(e);l>-1?a.SelectedWeeks.splice(l,1):a.SelectedWeeks.push(e)},a.setDraftSortTypeAndReverse=function(e){a.sortTypeDraft=e,a.sortReverseDraft=!a.sortReverseDraft},a.DownloadDraftCSV=function(){if(0==a._AllDraftData.length)return void a.displayNewMessage("danger","Error: Cannot downloaded drafts when none have been generated");var e="data:text/csv;charset=utf-8,",r=a._AllDraftData;r=l("checkValidOnly")(r,!0),r=l("orderBy")(r,a.sortTypeDraft,a.sortReverseDraft),e+="C,C,W,W,W,W,D,D,G\n",r.forEach(function(a){for(var l="",r=0;r<a.players.length;r++)0==r?l+=a.players[r].playerID:l=l+","+a.players[r].playerID;e=e+l+"\n"});var o=angular.element("<a/>");o.css({display:"none"}),angular.element(document.body).append(o);var t="";a._AllTeams.forEach(function(e){t=0==t.length?"NHL_"+e:t+"_"+e}),o.attr({href:encodeURI(e),target:"_blank",download:t+".csv"})[0].click(),o.remove()},a.lockAndUnLockPlayer=function(e){if(a.playerInPool(e))switch(e._Position){case"C":if(a._CPlayerLocked.indexOf(e)==-1){if(a._CPlayerLocked.length>=2)return void a.displayNewMessage("danger","Error: cannot lock more than 2 C's");a._CPlayerLocked.push(e)}else a._CPlayerLocked.splice(a._CPlayerLocked.indexOf(e),1);break;case"W":if(a._WPlayerLocked.indexOf(e)==-1){if(a._WPlayerLocked.length>=4)return void a.displayNewMessage("danger","Error: cannot lock more than 4 W's");a._WPlayerLocked.push(e)}else a._WPlayerLocked.splice(a._WPlayerLocked.indexOf(e),1);break;case"D":if(a._DPlayerLocked.indexOf(e)==-1){if(a._DPlayerLocked.length>=2)return void a.displayNewMessage("danger","Error: cannot lock more than 2 D's");a._DPlayerLocked.push(e)}else a._DPlayerLocked.splice(a._DPlayerLocked.indexOf(e),1);break;case"G":if(a._GPlayerLocked.indexOf(e)==-1){if(a._GPlayerLocked.length>=1)return void a.displayNewMessage("danger","Error: _SFPlayerLocked.length >= 2, cannot lock more than 1 G's");a._GPlayerLocked.push(e)}else a._GPlayerLocked.splice(a._GPlayerLocked.indexOf(e),1)}},a.unLockPlayer=function(e){switch(e._Position){case"C":a._CPlayerLocked.indexOf(e)>-1&&a._CPlayerLocked.splice(a._CPlayerLocked.indexOf(e),1);break;case"W":a._WPlayerLocked.indexOf(e)>-1&&a._WPlayerLocked.splice(a._WPlayerLocked.indexOf(e),1);break;case"D":a._DPlayerLocked.indexOf(e)>-1&&a._DPlayerLocked.splice(a._DPlayerLocked.indexOf(e),1);break;case"G":a._GPlayerLocked.indexOf(e)>-1&&a._GPlayerLocked.splice(a._GPlayerLocked.indexOf(e),1)}},a.removePlayerFromPool=function(e){switch(e._Position){case"C":a.unLockPlayer(e),a._CPlayerPool.splice(a._CPlayerPool.indexOf(e),1);break;case"W":a.unLockPlayer(e),a._WPlayerPool.splice(a._WPlayerPool.indexOf(e),1);break;case"D":a.unLockPlayer(e),a._DPlayerPool.splice(a._DPlayerPool.indexOf(e),1);break;case"G":a.unLockPlayer(e),a._GPlayerPool.splice(a._GPlayerPool.indexOf(e),1)}},a.addPlayerToPool=function(e){if(!a.playerInPool(e))switch(e._Position){case"C":a._CPlayerPool.push(e);break;case"W":a._WPlayerPool.push(e);break;case"D":a._DPlayerPool.push(e);break;case"G":a._GPlayerPool.push(e)}},a.playerInPool=function(e){switch(e._Position){case"C":if(a._CPlayerPool.indexOf(e)>-1)return!0;break;case"W":if(a._WPlayerPool.indexOf(e)>-1)return!0;break;case"D":if(a._DPlayerPool.indexOf(e)>-1)return!0;break;case"G":if(a._GPlayerPool.indexOf(e)>-1)return!0}return!1},a.clearPlayerPools=function(){a._PGPlayerPool=[],a._SGPlayerPool=[],a._SFPlayerPool=[],a._PFPlayerPool=[],a._CPlayerPool=[],a._PGPlayerLocked=[],a._SGPlayerLocked=[],a._SFPlayerLocked=[],a._PFPlayerLocked=[],a._CPlayerLocked=[]},a.averagePlayerPoolSalary=function(e){if(0==e.length)return 0;var a=0;return e.forEach(function(e){a+=e._Salary}),Math.round(a/e.length,0)},a.removeDraft=function(e){var l=a._AllDraftData.indexOf(e);a._AllDraftData.splice(l,1)},a.clearDrafts=function(){a._AllDrafts=[],a._AllDraftData=[],a.TotalPossibleDrafts=0,a.TotalValidDrafts=0,a._AllPlayers.forEach(function(e){e._TimesInDrafts=0,e._TimesInValidDrafts=0})},a.buildDrafts=function(){if(0==a._CPlayerPool.length||0==a._WPlayerPool.length||0==a._DPlayerPool.length||0==a._GPlayerPool.length)return void a.displayNewMessage("danger","Error: One or more player pools contain zero players");a.clearDrafts();var e=[];if(a._CPlayerLocked.length>0){var r=[];switch(a._CPlayerPool.forEach(function(e){a._CPlayerLocked.indexOf(e)==-1&&r.push(e)}),a._CPlayerLocked.length){case 0:e=a.getCombinations(a._CPlayerPool,2);break;case 1:e=a.getCombinations(r,1);break;case 2:e=a.getCombinations(a._CPlayerLocked,2);break;default:return void a.displayNewMessage("danger","Error: _CPlayerLocked.length > 2 || null, cannot create combinations")}}else e=a.getCombinations(a._CPlayerPool,2);var o=[];if(a._WPlayerLocked.length>0){var r=[];switch(a._WPlayerPool.forEach(function(e){a._WPlayerLocked.indexOf(e)==-1&&r.push(e)}),a._WPlayerLocked.length){case 0:o=a.getCombinations(a._WPlayerPool,4);break;case 1:o=a.getCombinations(r,3);break;case 2:o=a.getCombinations(r,2);break;case 3:o=a.getCombinations(r,1);break;case 4:o=a.getCombinations(a._WPlayerLocked,4);break;default:return void a.displayNewMessage("danger","Error: _WPlayerLocked.length > 4 || null, cannot create combinations")}}else o=a.getCombinations(a._WPlayerPool,4);var t=[];if(a._DPlayerLocked.length>0){var r=[];switch(a._DPlayerPool.forEach(function(e){a._DPlayerLocked.indexOf(e)==-1&&r.push(e)}),a._DPlayerLocked.length){case 0:t=a.getCombinations(a._DPlayerPool,2);break;case 1:t=a.getCombinations(r,1);break;case 2:t=a.getCombinations(a._DPlayerLocked,2);break;default:return void a.displayNewMessage("danger","Error: _SGPlayerLocked.length > 2 || null, cannot create combinations")}}else t=a.getCombinations(a._DPlayerPool,2);var n=[];n=a.getCombinations(a._GPlayerPool,1),e.forEach(function(e){var r=[];switch(a._CPlayerLocked.length){case 0:r.push(e[0]),r.push(e[1]);break;case 1:r.push(a._CPlayerLocked[0]),r.push(e[0]);break;case 2:r.push(a._CPlayerLocked[0]),r.push(a._CPlayerLocked[1])}o.forEach(function(e){switch(r=l("removePosition")(r,"W"),a._WPlayerLocked.length){case 0:r.push(e[0]),r.push(e[1]),r.push(e[2]),r.push(e[3]);break;case 1:r.push(a._WPlayerLocked[0]),r.push(e[0]),r.push(e[1]),r.push(e[2]);break;case 2:r.push(a._WPlayerLocked[0]),r.push(a._WPlayerLocked[1]),r.push(e[0]),r.push(e[1]);break;case 3:r.push(a._WPlayerLocked[0]),r.push(a._WPlayerLocked[1]),r.push(a._WPlayerLocked[2]),r.push(e[0]);break;case 4:r.push(a._WPlayerLocked[0]),r.push(a._WPlayerLocked[1]),r.push(a._WPlayerLocked[2]),r.push(a._WPlayerLocked[3])}t.forEach(function(e){switch(r=l("removePosition")(r,"D"),a._DPlayerLocked.length){case 0:r.push(e[0]),r.push(e[1]);break;case 1:r.push(a._DPlayerLocked[0]),r.push(e[0]);break;case 2:r.push(a._DPlayerLocked[0]),r.push(a._DPlayerLocked[1])}n.forEach(function(e){r=l("removePosition")(r,"G"),r.push(e[0]),a._AllDrafts.push(r)})})})}),a.TotalPossibleDrafts=a._AllDrafts.length,a._AllDrafts.forEach(function(e){var l={projection:parseFloat(a.getDraftProjection(e)),actual:parseFloat(a.getDraftActual(e)),validTeam:a.isDraftTeamValid(e),validSalary:a.isDraftSalaryValid(e),players:e,displayDetails:!1};a._AllDraftData.push(l),e.forEach(function(e){var l=a._AllPlayers.indexOf(e);a._AllPlayers[l]._TimesInDrafts+=1})});var s=l("checkValidOnly")(a._AllDraftData,!0);a.TotalValidDrafts=s.length,s.forEach(function(e){e.players.forEach(function(e){var l=a._AllPlayers.indexOf(e);a._AllPlayers[l]._TimesInValidDrafts+=1})}),a._AllPlayers.forEach(function(e){a.setPlayerPercentInDraft(e)})},a.switchValidDraftSelector=function(){a.SelectedValidDrafts=!a.SelectedValidDrafts,a.buildDrafts()},a.setPlayerPercentInDraft=function(e){a.SelectedValidDrafts?e._PercentInDrafts=(e._TimesInValidDrafts/a.TotalValidDrafts*100).toFixed(0):e._PercentInDrafts=(e._TimesInDrafts/a.TotalPossibleDrafts*100).toFixed(0)},a.removeCalcDrafts=function(e,r){var o=l("removeCalcDraft")(a._AllDraftData,parseFloat(e),parseFloat(r));a.AVERAGE=parseFloat(e),a.STDEVIATION=parseFloat(r),a._AllDraftData=o,a.TotalPossibleDrafts=a._AllDraftData.length;var t=l("checkValidOnly")(a._AllDraftData,!0);a.TotalValidDrafts=t.length,a._AllPlayers.forEach(function(e){e._TimesInDrafts=0,e._TimesInValidDrafts=0}),t.forEach(function(e){e.players.forEach(function(e){var l=a._AllPlayers.indexOf(e);a._AllPlayers[l]._TimesInValidDrafts+=1})}),a._AllPlayers.forEach(function(e){a.setPlayerPercentInDraft(e)})},a.getDraftProjection=function(e){var a=0;return e.forEach(function(e){a+=e._FPPG}),a=parseFloat(a),a.toFixed(2)},a.getDraftActual=function(e){var a=0;return e.forEach(function(e){a+=e._ActualFantasyPoints}),a=parseFloat(a),a.toFixed(2)},a.openCloseDraftDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalDraft.html",controller:"DraftModalController",size:"lg",resolve:{draft:function(){return e}}})},a.openClosePlayerDetails=function(e){r.open({templateUrl:"/js/AngularControllers/modalPlayer.html",controller:"PlayerModalController",size:"lg",resolve:{allPlayers:function(){return a._AllPlayersMASTER},selectedPlayer:function(){return e}}})},a.openSaveDialog=function(){a.savedPastSettings=[];var e={_AllPlayers:a._AllPlayers,_CPlayerLocked:a._CPlayerLocked,_WPlayerLocked:a._WPlayerLocked,_DPlayerLocked:a._DPlayerLocked,_GPlayerLocked:a._GPlayerLocked,_CPlayerPool:a._CPlayerPool,_WPlayerPool:a._WPlayerPool,_DPlayerPool:a._DPlayerPool,_GPlayerPool:a._GPlayerPool,AVERAGE:a.AVERAGE,STDEVIATION:a.STDEVIATION};r.open({templateUrl:"/js/AngularControllers/saveDialog.html",controller:"SaveModalController",size:"lg",resolve:{postObject:function(){return e}}})},a.loadSavedSettings=function(l){e.post("/NHL/loadSavedSettings",{id:l}).then(function(e){var l=JSON.parse(e.data.userSaveJSON);a.loadPlayersFromSave(l)},function(e){})},a.loadSavedSettingsDetails=function(){e.post("/NHL/loadSavedSettingsDetails",{endIndex:a.savedPastSettings.length}).then(function(e){var l=e.data;l.forEach(function(e){a.savedPastSettings.push(e)})},function(e){})},a.loadPlayerInPool=function(e,l){e.forEach(function(e){e._Name==l._Name&&e._Position==l._Position&&e._Team==l._Team&&a.addPlayerToPool(l)})},a.loadPlayerInLocked=function(e,l){e.forEach(function(e){e._Name==l._Name&&e._Position==l._Position&&e._Team==l._Team&&a.lockAndUnLockPlayer(l)})},a.loadPlayersFromSave=function(e){a.clearPlayerPools(),a.clearDrafts(),a.clearAllPlayers(),a._AllPlayers=e._AllPlayers,a._AllPlayersMASTER=e._AllPlayers,a.AVERAGE=parseFloat(e.AVERAGE),a.STDEVIATION=parseFloat(e.STDEVIATION),a._AllPlayers.forEach(function(l){0==a._AllTeams.length?a._AllTeams.push(l._Team):a._AllTeams.indexOf(l._Team)==-1&&a._AllTeams.push(l._Team),a.loadPlayerInPool(e._CPlayerPool,l),a.loadPlayerInPool(e._WPlayerPool,l),a.loadPlayerInPool(e._DPlayerPool,l),a.loadPlayerInPool(e._GPlayerPool,l),a.loadPlayerInLocked(e._CPlayerLocked,l),a.loadPlayerInLocked(e._WPlayerLocked,l),a.loadPlayerInLocked(e._DPlayerLocked,l),a.loadPlayerInLocked(e._GPlayerLocked,l)}),a.displayNewMessage("success","Previous save loaded successfully.")},a.isDraftSalaryValid=function(e){var a=55e3;return e.forEach(function(e){a-=e._Salary}),a>=0},a.isDraftTeamValid=function(e){var a={};e.forEach(function(e){a.hasOwnProperty(e._Team)?a[e._Team]=a[e._Team]+1:a[e._Team]=1});for(team in a){var l=a[team];if(l>4)return!1}return!0},a.getCombinations=function(e,a){for(var l=function(e,a,r,o){if(0==e)return void(r.length>0&&(o[o.length]=r));for(var t=0;t<a.length;t++)l(e-1,a.slice(t+1),r.concat([a[t]]),o)},r=[],o=a;o<e.length;o++)l(o,e,[],r);r.push(e);for(var t=0;t<r.length;t++)r[t].length>a&&r.splice(t);return r},a.clearAllPlayerFilters=function(){a.SelectedTeams=[],a.SelectedWeeks=[],a.SelectedWeeks.push(a._AllWeeks[0])}}])}]);