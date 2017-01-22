angular.module('NBAApp').controller('NBAController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nba = this;

    $scope.alerts = [
      { type: 'info', msg: 'Please Upload/Load Players...', number: 1 }
    ];

    $scope._Positions = [];
    $scope._AllTeams = [];
    $scope._AllWeeks = [];
    $scope._AllPlayersMASTER = [];
    $scope._AllPlayers = [];
    $scope._AllReadPlayerIDs = [];
    $scope._AllStacks = [];

    $scope._PGPlayerLocked = [];
    $scope._SGPlayerLocked = [];
    $scope._SFPlayerLocked = [];
    $scope._PFPlayerLocked = [];
    $scope._CPlayerLocked = [];

    $scope._PGPlayerPool = [];
    $scope._SGPlayerPool = [];
    $scope._SFPlayerPool = [];
    $scope._PFPlayerPool = [];
    $scope._CPlayerPool = [];

    $scope._AllDisplayedDraftData = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = true;
    $scope.sortTypeDraft = 'projection';

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = true;
    $scope.SelectedPosition = '';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;



    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);
    $scope.TopRange = -1;
    $scope.BottomRange = -1;

    nba.ERRORRATE = 0.00157;
    nba.TopLimit = 150;
    //database
    $scope.savedPastSettings = [];
    $scope.currentRead = null;

    //$scope._AllPlayers = positionFilter($scope._AllPlayers, $scope.SelectedPosition);

    $scope._AllPlayers = $filter('team')($scope._AllPlayers, $scope.SelectedTeams);
    $scope._AllPlayers = $filter('position')($scope._AllPlayers, $scope.SelectedPosition);
    //$http.post("/api/NFL/getAllWeeks").then(function successCallback(response) {
    //    $scope._AllWeeks = [];//clear out
    //    response.data.forEach(function (element) {
    //        $scope._AllWeeks.push(element);
    //    });
    //    console.log("weeks: ", $scope._AllWeeks);
    //}, function errorCallBack(response) {

    //});

    $scope.mainTabHeading = "Players";
    $scope.DeleteConfirmationID = -1;

    var compareNumbers = function(a, b) {
        return b-a;
    }


    $scope.displayNewMessage = function (messageType, messageContent) {
      $window.scrollTo(0, 0);
      $scope.addAlert(messageType, messageContent);
    }
    $scope.addAlert = function(type, message) {
      var sameNumberOfAlerts = 1;
      if($scope.alerts.length > 100) {
        $scope.alerts = [];
      }
      $scope.alerts.forEach(function(alert) {
        if(alert.type == type && alert.msg == message) {
          sameNumberOfAlerts++;
        }
      });
      if(message.indexOf('Unauthenticated') !== -1) {
        $scope.alerts.push({type: type, msg: message, number: sameNumberOfAlerts, login: true});
      } else {
        $scope.alerts.push({type: type, msg: message, number: sameNumberOfAlerts, login: false});
      }

    }
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    }

    $scope.loadProjectionsAsActual = function(event) {
      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            for(var i = 0; i < allTextLines.length; i++) {
              var headers = allTextLines[i].split(',');
              var playerPosition = "";
              var playerFName = "";
              var playerLName = "";
              var playerPoints = 0;
              var playerSalary = 0;
              var playerTeam = "";
              var playerOpp = "";
              for (var j = 0; j < headers.length; j++) {
                  switch (j) {
                    case 0:
                        var name = headers[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                        var splitName = name.split(' ');
                        playerFName = splitName[0];
                        if(splitName.length == 2) {
                            playerLName = splitName[1];
                        } else {
                            playerLName = splitName[2];
                        }
                        break;
                    case 1:
                        playerSalary = parseInt(headers[j].replace('"', '').replace('"', '').replace('$', '').trim());
                        break;
                    case 2:
                      playerTeam = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 3:
                      playerPosition = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 4:
                      playerOpp = headers[j].replace('"', '').replace('"', '').trim();
                      break;
                    case 7:
                      playerPoints = parseFloat(headers[j].replace('"', '').replace('"', '').trim());
                      break;
                  }
              }
              $scope._AllPlayers.forEach(function (player) {
                  if((player._Name.includes(playerFName) && player._Name.includes(playerLName)) && player._Position == playerPosition) {
                      player._ActualFantasyPoints = playerPoints;
                  }
                  if($scope._Positions.indexOf(player._Postion) === -1) {
                    $scope._Positions.push(player._Position);
                  }
              });
              $scope._Positions.sort();
            }


        }

        $scope.$apply(function() {
          $scope.displayNewMessage("success", "Player projections loaded as actual Success");
        });

        reader.readAsText(file);
    }

    $scope.loadActual = function (event) {

      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');


            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(';');

                var playerPosition = "";
                var playerFName = "";
                var playerLName = "";
                var playerPoints = 0;
                var playerSalary = 0;
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 2:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 3:
                            var name = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            var splitName = name.split(' ');
                            playerFName = splitName[0];
                            if(splitName.length == 2) {
                                playerLName = splitName[1];
                            } else {
                                playerLName = splitName[2];
                            }
                            break;
                        case 5:
                            playerPoints = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 6:
                            playerSalary = parseInt(data[j].replace('"', '').replace('"', '').replace('$', '').trim());
                            break;

                    }
                }

                $scope._AllPlayers.forEach(function (player) {
                    if((player._Name.includes(playerFName) && player._Name.includes(playerLName)) && player._Position == playerPosition) {
                        player._ActualFantasyPoints = playerPoints;
                    }
                    if($scope._Positions.indexOf(player._Postion) === -1) {
                      $scope._Positions.push(player._Position);
                    }
                });
            }
            $scope._Positions.sort();
            $scope.$apply(function() {

              $scope.displayNewMessage("success", "Player Actual Results have been successfully loaded");

            });

        }
        reader.readAsText(file);
    }



    $scope.loadPlayers = function (event) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.clearAllPlayerFilters();
      $scope.currentRead = null;
      $scope.mainTabHeading = "Players";

      var file = event.target.files[0];

        var allText = "";
        var reader = new FileReader();
        reader.onload = function (e) {
            allText = reader.result;

            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');


            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');

                var playerID = "";
                var playerPosition = "";
                var playerFName = "";
                var playerLName = "";
                var playerTeam = "";
                var playerOpponent = "";
                var playerFPPG = 0;
                var playerSalary = 0;
                var playerInjury = false;
                var playerInjuryDetails = "";
                var playerGame = "";
                for (var j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0:
                            playerID = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 1:
                            playerPosition = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 2:
                            playerFName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            break;
                        case 4:
                            playerLName = data[j].replace('"', '').replace('"', '').replace('Jr.', '').replace('Sr.', '').trim();
                            break;
                        case 5:
                            playerFPPG = parseFloat(data[j].replace('"', '').replace('"', '').trim());
                            playerFPPG = parseFloat(playerFPPG.toFixed(2));
                            break;
                        case 7:
                            playerSalary = parseInt(data[j].replace('"', '').replace('"', '').trim());
                            break;
                        case 8:
                            playerGame = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 9:
                            playerTeam = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 10:
                            playerOpponent = data[j].replace('"', '').replace('"', '').trim();
                            break;
                        case 11:
                            if (data[j].replace('"', '').replace('"', '').trim().length > 0) {
                                playerInjury = data[j].replace('"', '').replace('"', '').trim();
                                if (playerInjury == 'O') {
                                    playerInjury = 'danger';
                                } else if(playerInjury = 'GTD') {
                                    playerInjury = 'warning';
                                }
                            }
                            break;
                        case 12:
                            playerInjuryDetails = data[j].replace('"', '').replace('"', '').trim();
                            break;
                    }
                }
                var pointsPerDollar = parseFloat((playerFPPG / playerSalary).toFixed(5));
                var playerRead = { playerID: playerID, _Position: playerPosition, _Name: playerFName + " " + playerLName, _FPPG: playerFPPG, _ActualFantasyPoints: -1, _Team: playerTeam, _Opponent: playerOpponent, _Salary: playerSalary, _ProjectedPointsPerDollar: pointsPerDollar, _playerInjured: playerInjury, _playerInjuryDetails: playerInjuryDetails, _Game: playerGame, _PercentInDrafts: -1, _TimesInDrafts: 0, _TimesInValidDrafts: 0 };
                $scope._AllPlayers.push(playerRead);
                $scope._AllPlayersMASTER.push(playerRead);

                if($scope._Positions.indexOf(playerPosition) === -1) {
                  $scope._Positions.push(playerPosition);
                }

                //add team data
                if ($scope._AllTeams.length == 0) {
                    $scope._AllTeams.push(playerRead._Team);
                } else if ($scope._AllTeams.indexOf(playerRead._Team) == -1) {
                    $scope._AllTeams.push(playerRead._Team);
                }

            }
            $scope.$apply(function() {

              $scope.displayNewMessage("success", "Players have been successfully loaded");

            });

        }
        reader.readAsText(file);
        $scope._Positions.sort();
    }

    // $scope.$watch('AVERAGE',function(val,old){
    //    $scope.AVERAGE = parseFloat(val);
    //    $scope.TopRange = ($scope.AVERAGE + $scope.STDEVIATION);
    //    $scope.BottomRange = ($scope.AVERAGE - $scope.STDEVIATION);
    // });
    // $scope.$watch('STDEVIATION',function(val,old){
    //    $scope.STDEVIATION = parseFloat(val);
    //    $scope.TopRange = ($scope.AVERAGE + $scope.STDEVIATION);
    //    $scope.BottomRange = ($scope.AVERAGE - $scope.STDEVIATION);
    // });

    $scope.addTopActualResults = function() {
      $scope.clearPlayerPools();

      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_ActualFantasyPoints', true);
      var allPGs = $filter('position')(orderedPlayers, 'PG');
      var allSGs = $filter('position')(orderedPlayers, 'SG');
      var allSFs = $filter('position')(orderedPlayers, 'SF');
      var allPFs = $filter('position')(orderedPlayers, 'PF');
      var allPFs = $filter('position')(orderedPlayers, 'PF');
      var allCs = $filter('position')(orderedPlayers, 'C');

      var PGTeams = [];

      for(var j = 0; j < 5; j++) {
        if(allPGs.length >= j) {
          $scope.addPlayerToPool(allPGs[j]);
        }
        if(allSGs.length >= j) {
          $scope.addPlayerToPool(allSGs[j]);
        }
        if(allSFs.length >= j) {
          $scope.addPlayerToPool(allSFs[j]);
        }
        if(allPFs.length >= j) {
          $scope.addPlayerToPool(allPFs[j]);
        }
        if(allCs.length >= j && j < 3) {
          $scope.addPlayerToPool(allCs[j]);
        }
      }

    }

    $scope.addTopTeamPlayers = function() {

      $scope.clearPlayerPools();

      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var NonInjuredPlayers =  $filter('removeInjured')(orderedPlayers);
      var allPGs = $filter('position')(NonInjuredPlayers, 'PG');
      var allSGs = $filter('position')(NonInjuredPlayers, 'SG');
      var allSFs = $filter('position')(NonInjuredPlayers, 'SF');
      var allPFs = $filter('position')(NonInjuredPlayers, 'PF');
      var allCs = $filter('position')(NonInjuredPlayers, 'C');

      var PGTeams = [];
      allPGs.forEach(function(PG) {
        if(PGTeams.length <= $scope._AllTeams.length && PGTeams.indexOf(PG._Team) == -1) {
          $scope.addPlayerToPool(PG);
          PGTeams.push(PG._Team);
        }
      });

      var SGTeams = [];
      allSGs.forEach(function(SG) {
        if(SGTeams.length <= $scope._AllTeams.length && SGTeams.indexOf(SG._Team) == -1) {
          $scope.addPlayerToPool(SG);
          SGTeams.push(SG._Team);
        }
      });

      var SFTeams = [];
      allSFs.forEach(function(SF) {
        if(SFTeams.length <= $scope._AllTeams.length && SFTeams.indexOf(SF._Team) == -1) {
          $scope.addPlayerToPool(SF);
          SFTeams.push(SF._Team);
        }
      });

      var PFTeams = [];
      allPFs.forEach(function(PF) {
        if(PFTeams.length <= $scope._AllTeams.length && PFTeams.indexOf(PF._Team) == -1) {
          $scope.addPlayerToPool(PF);
          PFTeams.push(PF._Team);
        }
      });
    }

    $scope.teamRemovalFormularHelpers = function(PGPlayersToAdd, PGPlayersToLock) {
      var PGTeams = [];
      var PGPlayersToAddAfterTeamRemoval = [];

      if(PGPlayersToLock.length != 0) {
        PGTeams.push(PGPlayersToLock[0]._Team);
        PGPlayersToAddAfterTeamRemoval.push(PGPlayersToLock[0]);
      }

      PGPlayersToAdd.forEach(function(PG) {
        if(PGTeams.indexOf(PG._Team) != -1) {
          //find other player with same team
          //compare salaries, and add the highest One
          var indexOfAddedTeam = PGTeams.indexOf(PG._Team);
          var existingPlayerSameTeam = PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam];
          if(existingPlayerSameTeam._Salary < PG._Salary) {
            //replace
            PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam] = PG;
          } else if(existingPlayerSameTeam._Salary === PG._Salary) {
            if(existingPlayerSameTeam._FPPG < PG._FPPG) {
              PGPlayersToAddAfterTeamRemoval[indexOfAddedTeam] = PG;
            }
          } else {
            //do nothing, allready have best player (highest salary)
          }
        } else if( PGTeams.indexOf(PG._Team) == -1) {
          PGTeams.push(PG._Team);
          PGPlayersToAddAfterTeamRemoval.push(PG);
        }
      });
      return PGPlayersToAddAfterTeamRemoval;
    }

    $scope.setAndUnsetPosition = function(position) {
      if($scope.SelectedPosition === position) {
          $scope.SelectedPosition = '';
      } else {
          $scope.SelectedPosition = position;
      }
    }

    $scope.autoAddPlayerFormula = function() {
      $scope.clearPlayerPools();

      var orderedPlayers =  $filter('orderBy')($scope._AllPlayers, '_FPPG', true);
      var NonInjuredPlayers =  $filter('removeInjured')(orderedPlayers);
      var allPGs = $filter('position')(NonInjuredPlayers, 'PG');
      var allSGs = $filter('position')(NonInjuredPlayers, 'SG');
      var allSFs = $filter('position')(NonInjuredPlayers, 'SF');
      var allPFs = $filter('position')(NonInjuredPlayers, 'PF');
      var allCs = $filter('position')(NonInjuredPlayers, 'C');

      //version 1
      for(var j = 0; j < allPGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allPGs[j]);
        }
      }
      //$scope.lockAndUnLockPlayer(allPGs[0]);

      for(var j = 0; j < allSGs.length; j++) {
        if(j == 0 || j == 1 || j == 2 || j == 3 || j == 4) {
          $scope.addPlayerToPool(allSGs[j]);
        }
      }

      for(var j = 0; j < allSFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3) {
          $scope.addPlayerToPool(allSFs[j]);
        }
      }

      $scope.lockAndUnLockPlayer(allSFs[0]);

      for(var j = 0; j < allPFs.length; j++) {
        if( j == 0 || j == 1 || j == 2 || j == 3 || j == 4 ) {
          $scope.addPlayerToPool(allPFs[j]);
        }
      }

      $scope.addPlayerToPool(allCs[0]);
      $scope.addPlayerToPool(allCs[1]);

      $scope.AVERAGE = 259;
      $scope.STDEVIATION = 5;

    }
    $scope.parseFloat = function(value)
    {
       return parseFloat(value);
    }
    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
      $scope._AllTeams = [];
      $scope._Positions = [];
    }

    $scope.changeLineups = function (files) {
        var formData = new FormData();
        for (var j = 0; j < files.length; j++) {
            formData.append(files[j].name, files[j]);
        }

        $http.post("/api/NBA/changeLineups", formData, {
            headers: {
                "Content-Type": undefined,
                transformRequest: angular.identity
            }
        }).then(function successCallBack(response) {
            console.log(response);
        }, function errorCallBack(response) {
            console.log(response);
        });
    }

    $scope.getPointsPerDollar = function (player) {
        var returnData = 0;
        returnData = player._FPPG / player._Salary;
        returnData = returnData.toFixed(5);
        returnData = parseFloat(returnData);
        return returnData;
    }

    $scope.resetMessage = function () {
        $scope._Message.hasData = false;
        $scope._Message.messageType = "info";
        $scope._Message.message = "";
    }

    $scope.addTeam = function (team) {
        if(SelectedTeams.indexOf(team) == -1) {
            SelectedTeams.push(team);
        }
    }
    $scope.addRemoveTeam = function (team) {
        var playerIndex = $scope.SelectedTeams.indexOf(team);
        if (playerIndex > -1) {
            $scope.SelectedTeams.splice(playerIndex, 1);
        } else {
            $scope.SelectedTeams.push(team);
        }
    }
    $scope.addRemoveWeek= function (week) {
        var weekIndex = $scope.SelectedWeeks.indexOf(week);
        if (weekIndex > -1) {
            $scope.SelectedWeeks.splice(weekIndex, 1);
        } else {
            $scope.SelectedWeeks.push(week);
        }
    }

    $scope.setDraftSortTypeAndReverse = function (sortType) {
        $scope.sortTypeDraft = sortType;
        $scope.sortReverseDraft = !$scope.sortReverseDraft;

        $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, $scope.sortReverseDraft);
        //cap gUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }

    }

    $scope.DownloadDraftCSV = function () {
        if ($scope._AllDraftData.length == 0) {
            $scope.displayNewMessage("danger", "Error: Cannot downloaded drafts when none have been generated");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,";
        var drafts = $scope._AllDraftData;

        drafts = $filter('checkValidOnly')(drafts, true);
        drafts = $filter('orderBy')(drafts, $scope.sortTypeDraft, $scope.sortReverseDraft);

        csvContent = csvContent + "PG,PG,SG,SG,SF,SF,PF,PF,C\n";
        drafts.forEach(function (draft) {
            var lineOfText = "";
            for (var j = 0; j < draft.players.length; j++) {
                if (j == 0)
                {
                    lineOfText = lineOfText + draft.players[j].playerID;
                }
                else
                {
                    lineOfText = lineOfText + "," + draft.players[j].playerID;
                }
            }
            csvContent = csvContent + lineOfText + "\n";
        });

        var anchor = angular.element('<a/>');
        anchor.css({ display: 'none' }); // Make sure it's not visible
        angular.element(document.body).append(anchor); // Attach to document

        var CSVName = "";
        $scope._AllTeams.forEach(function (team) {
          if(CSVName.length == 0) {
            CSVName = team;
          } else {
            CSVName = CSVName + "_" + team;
          }
        });
        anchor.attr({
            href: encodeURI(csvContent),
            target: '_blank',
            download: CSVName+'.csv'
        })[0].click();

        anchor.remove(); // Clean it up afterwards


        //window.open(encodedUri);
    }

    $scope.lockAndUnLockPlayer = function (player)
    {
        if ($scope.playerInPool(player)) {
            switch (player._Position) {
                case 'PG':
                    if ($scope._PGPlayerLocked.indexOf(player) == -1)
                    {
                        if ($scope._PGPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: _PGPlayerLocked.length >= 2, cannot lock more than 2 PGs");
                            return;
                        }
                        $scope._PGPlayerLocked.push(player);
                    }
                    else
                    {
                        $scope._PGPlayerLocked.splice($scope._PGPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'SG':
                    if ($scope._SGPlayerLocked.indexOf(player) == -1) {
                        if ($scope._SGPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: _SGPlayerLocked.length >= 2, cannot lock more than 2 SGs");
                            return;
                        }
                        $scope._SGPlayerLocked.push(player);
                    } else {
                        $scope._SGPlayerLocked.splice($scope._SGPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'SF':
                    if ($scope._SFPlayerLocked.indexOf(player) == -1) {
                        if ($scope._SFPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: _SFPlayerLocked.length >= 2, cannot lock more than 3 SFs");
                            return;
                        }
                        $scope._SFPlayerLocked.push(player);
                    } else {
                        $scope._SFPlayerLocked.splice($scope._SFPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'PF':
                    if ($scope._PFPlayerLocked.indexOf(player) == -1) {
                        if ($scope._PFPlayerLocked.length >= 2) {
                            $scope.displayNewMessage("danger", "Error: _PFPlayerLocked.length >= 2, cannot lock more than 3 PFs");
                            return;
                        }
                        $scope._PFPlayerLocked.push(player);
                    } else {
                        $scope._PFPlayerLocked.splice($scope._PFPlayerLocked.indexOf(player), 1);
                    }
                    break;
                case 'C':
                    if ($scope._CPlayerLocked.indexOf(player) == -1) {
                        $scope._CPlayerLocked.push(player);
                    } else {
                        $scope._CPlayerLocked.splice($scope._CPlayerLocked.indexOf(player), 1);
                    }
                    break;
            }
        }
    }
    $scope.unLockPlayer = function (player) {
        switch (player._Position) {
            case 'PG':
                if ($scope._PGPlayerLocked.indexOf(player) > -1) {
                    $scope._PGPlayerLocked.splice($scope._PGPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'SG':
                if ($scope._SGPlayerLocked.indexOf(player) > -1) {
                    $scope._SGPlayerLocked.splice($scope._SGPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'SF':
                if ($scope._SFPlayerLocked.indexOf(player) > -1) {
                    $scope._SFPlayerLocked.splice($scope._SFPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'PF':
                if ($scope._PFPlayerLocked.indexOf(player) > -1) {
                    $scope._PFPlayerLocked.splice($scope._PFPlayerLocked.indexOf(player), 1);
                }
                break;
            case 'C':
                if ($scope._CPlayerLocked.indexOf(player) > -1) {
                    $scope._CPlayerLocked.splice($scope._CPlayerLocked.indexOf(player), 1);
                }
                break;
        }
    }
    $scope.removePlayerFromPool = function (player)
    {
        switch (player._Position)
        {
            case 'PG':
                $scope.unLockPlayer(player);
                $scope._PGPlayerPool.splice($scope._PGPlayerPool.indexOf(player), 1);
                break;
            case 'SG':
                $scope.unLockPlayer(player);
                $scope._SGPlayerPool.splice($scope._SGPlayerPool.indexOf(player), 1);
                break;
            case 'SF':
                $scope.unLockPlayer(player);
                $scope._SFPlayerPool.splice($scope._SFPlayerPool.indexOf(player), 1);
                break;
            case 'PF':
                $scope.unLockPlayer(player);
                $scope._PFPlayerPool.splice($scope._PFPlayerPool.indexOf(player), 1);
                break;
            case 'C':
                $scope._CPlayerPool.splice($scope._CPlayerPool.indexOf(player), 1);
                break;
        }
    }

    $scope.addPlayerToPool = function (player)
    {
        if (!$scope.playerInPool(player))
        {
            switch (player._Position)
            {
                case 'PG':
                    $scope._PGPlayerPool.push(player);
                    break;
                case 'SG':
                    $scope._SGPlayerPool.push(player);
                    break;
                case 'SF':
                    $scope._SFPlayerPool.push(player);
                    break;
                case 'PF':
                    $scope._PFPlayerPool.push(player);
                    break;
                case 'C':
                    $scope._CPlayerPool.push(player);
                    break;
            }
        }

    }
    $scope.playerInPool = function (player)
    {
        switch (player._Position)
        {
            case 'PG':
                if ($scope._PGPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SG':
                if ($scope._SGPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'SF':
                if ($scope._SFPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'PF':
                if ($scope._PFPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
            case 'C':
                if ($scope._CPlayerPool.indexOf(player) > -1)
                {
                    return true;
                }
                break;
        }
        return false;
    }
    $scope.clearPlayerPools = function () {
        $scope._PGPlayerPool = [];
        $scope._SGPlayerPool = [];
        $scope._SFPlayerPool = [];
        $scope._PFPlayerPool = [];
        $scope._CPlayerPool = [];

        $scope._PGPlayerLocked = [];
        $scope._SGPlayerLocked = [];
        $scope._SFPlayerLocked = [];
        $scope._PFPlayerLocked = [];
        $scope._CPlayerLocked = [];
    }

    $scope.averagePlayerPoolSalary = function (playerPool) {
        if (playerPool.length == 0)
            return 0;
        var totalSalaries = 0;
        playerPool.forEach(function (player) {
            totalSalaries = totalSalaries + player._Salary;
        });
        return Math.round(totalSalaries / playerPool.length, 0);
    }

    $scope.removeDraft = function (draft) {
        $scope._AllDisplayedDraftData.splice($scope._AllDisplayedDraftData.indexOf(draft), 1);

        var indexOfDraftToRemove = $scope._AllDraftData.indexOf(draft);
        $scope._AllDraftData[indexOfDraftToRemove].players.forEach(function (player) {
            var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
            $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts -= 1;
            $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts -= 1;
        });
        $scope._AllDraftData.splice(indexOfDraftToRemove, 1);

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
    }

    $scope.removeAllButTopN = function() {
      $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);
      if($scope._AllDraftData.length > nba.TopLimit) {
        var tempDraftData = [];
        for(var j = 0; j < nba.TopLimit; j++) {
          tempDraftData.push($scope._AllDraftData[j]);

          if(j === 0) {
            //reset player %
            for(var k = 0; k < $scope._AllPlayers.length; k++) {
              $scope._AllPlayers[k]._TimesInDrafts = 0;
              $scope._AllPlayers[k]._TimesInValidDrafts = 0;
            }
          }

          $scope._AllDraftData[j].players.forEach(function (player) {
              var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
              $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
              $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
          });
        }
        $scope._AllDraftData = tempDraftData;
        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;
        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
        //add top TopLimit to displayed
        $scope._AllDisplayedDraftData = [];
        for(var i = 0; i < nba.TopLimit; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      }
    }
    // $scope.loadMoreDrafts = function() {
    //   console.log('ad');
    //   if($scope._AllDraftData.length > 0) {
    //     var length = $scope._AllDisplayedDraftData.length - 1;
    //     for(var i = 1; i <= 10; i++) {
    //       $scope._AllDisplayedDraftData.push($scope._AllDraftData[length + i]);
    //     }
    //   }
    //
    // }
    $scope.clearDrafts = function () {
        $scope._AllDraftData = [];
        $scope.TotalPossibleDrafts = 0;
        $scope.TotalValidDrafts = 0;

        $scope._AllPlayers.forEach(function (player) {
            player._TimesInDrafts = 0;
            player._TimesInValidDrafts = 0;
        });

    }

    $scope.buildDrafts = function () {

        //check if all pools have at least 1 player
        if ( $scope._PGPlayerPool.length == 0 || $scope._SGPlayerPool.length == 0 || $scope._SFPlayerPool.length == 0 || $scope._PFPlayerPool.length == 0 || $scope._CPlayerPool.length == 0 ) {
            $scope.displayNewMessage("danger", "Error: One or more player pools contain zero players");
            return;
        }

        //before, make sure data is cleared
        $scope.clearDrafts();

        //PG
        var PGCombinations = [];
        if ($scope._PGPlayerLocked.length > 0) {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._PGPlayerPool.forEach(function (player) {
                if ($scope._PGPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._PGPlayerLocked.length) {
                case 0:
                    PGCombinations = $scope.getCombinations($scope._PGPlayerPool, 2);
                    break;
                case 1:
                    PGCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    PGCombinations = $scope.getCombinations($scope._PGPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 2 PGs");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else {
            //no locked players
            PGCombinations = $scope.getCombinations($scope._PGPlayerPool, 2);
            // console.log("RB Combos: ", RBCombinations);
        }

        //SG
        var SGCombinations = [];
        if ($scope._SGPlayerLocked.length > 0)
        {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._SGPlayerPool.forEach(function (player) {
                if ($scope._SGPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._SGPlayerLocked.length) {
                case 0:
                    SGCombinations = $scope.getCombinations($scope._SGPlayerPool, 2);
                    break;
                case 1:
                    SGCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    SGCombinations = $scope.getCombinations($scope._SGPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 2 SGs");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else
        {
            //no locked players
            SGCombinations = $scope.getCombinations($scope._SGPlayerPool, 2);
           // console.log("RB Combos: ", RBCombinations);
        }

        //SF
        var SFCombinations = [];
        if ($scope._SFPlayerLocked.length > 0) {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._SFPlayerPool.forEach(function (player) {
                if ($scope._SFPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._SFPlayerLocked.length) {
                case 0:
                    SFCombinations = $scope.getCombinations($scope._SFPlayerPool, 2);
                    break;
                case 1:
                    SFCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    SFCombinations = $scope.getCombinations($scope._SFPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 2 SFs");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else {
            //no locked players
            SFCombinations = $scope.getCombinations($scope._SFPlayerPool, 2);
            // console.log("RB Combos: ", RBCombinations);
        }


        //PF
        var PFCombinations = [];
        if ($scope._PFPlayerLocked.length > 0) {
            //player locked, must modify input
            var unLockedPlayersInPool = [];
            $scope._PFPlayerPool.forEach(function (player) {
                if ($scope._PFPlayerLocked.indexOf(player) == -1) {
                    unLockedPlayersInPool.push(player);
                }
            });
            switch ($scope._PFPlayerLocked.length) {
                case 0:
                    PFCombinations = $scope.getCombinations($scope._PFPlayerPool, 2);
                    break;
                case 1:
                    PFCombinations = $scope.getCombinations(unLockedPlayersInPool, 1);
                    break;
                case 2:
                    PFCombinations = $scope.getCombinations($scope._PFPlayerLocked, 2);//full locked
                    break;
                default:
                    $scope.displayNewMessage("danger", "Error: Cannot lock > 2 PFs");
                    return;
                    //console.log("Error: _RBPlayerLocked.length > 2 || null, cannot create combinations");
            }
        }
        else {
            //no locked players
            PFCombinations = $scope.getCombinations($scope._PFPlayerPool, 2);
            // console.log("RB Combos: ", RBCombinations);
        }

        //C
        var CCombinations = [];
        CCombinations = $scope.getCombinations($scope._CPlayerPool, 1);

        //start draft building
        PGCombinations.forEach(function (PGCombo) {
            var tempDraft = [];
            switch ($scope._PGPlayerLocked.length) {
                case 0:
                    tempDraft.push(PGCombo[0]);
                    tempDraft.push(PGCombo[1]);
                    break;
                case 1:
                    tempDraft.push($scope._PGPlayerLocked[0]);
                    tempDraft.push(PGCombo[0]);
                    break;
                case 2:
                    tempDraft.push($scope._PGPlayerLocked[0]);
                    tempDraft.push($scope._PGPlayerLocked[1]);
                    break;
            }

            //SG
            SGCombinations.forEach(function (SGCombo) {
                tempDraft = $filter('removePosition')(tempDraft, 'SG');
                switch ($scope._SGPlayerLocked.length) {
                    case 0:
                        tempDraft.push(SGCombo[0]);
                        tempDraft.push(SGCombo[1]);
                        break;
                    case 1:
                        tempDraft.push($scope._SGPlayerLocked[0]);
                        tempDraft.push(SGCombo[0]);
                        break;
                    case 2:
                        tempDraft.push($scope._SGPlayerLocked[0]);
                        tempDraft.push($scope._SGPlayerLocked[1]);
                        break;
                }
                //SF
                SFCombinations.forEach(function (SFCombo) {
                    tempDraft = $filter('removePosition')(tempDraft, 'SF');
                    switch ($scope._SFPlayerLocked.length) {
                        case 0:
                            tempDraft.push(SFCombo[0]);
                            tempDraft.push(SFCombo[1]);
                            break;
                        case 1:
                            tempDraft.push($scope._SFPlayerLocked[0]);
                            tempDraft.push(SFCombo[0]);
                            break;
                        case 2:
                            tempDraft.push($scope._SFPlayerLocked[0]);
                            tempDraft.push($scope._SFPlayerLocked[1]);
                            break;
                    }
                    //PF
                    PFCombinations.forEach(function (PFCombo) {
                        tempDraft = $filter('removePosition')(tempDraft, 'PF');
                        switch ($scope._PFPlayerLocked.length) {
                            case 0:
                                tempDraft.push(PFCombo[0]);
                                tempDraft.push(PFCombo[1]);
                                break;
                            case 1:
                                tempDraft.push($scope._PFPlayerLocked[0]);
                                tempDraft.push(PFCombo[0]);
                                break;
                            case 2:
                                tempDraft.push($scope._PFPlayerLocked[0]);
                                tempDraft.push($scope._PFPlayerLocked[1]);
                                break;
                        }

                        //C
                        CCombinations.forEach(function (C) {
                            tempDraft = $filter('removePosition')(tempDraft, 'C');
                            tempDraft.push(C[0]);
                            //add only valid drafts
                            if($scope.isDraftTeamValid(tempDraft) && $scope.isDraftSalaryValid(tempDraft)) {
                              //$scope._AllDrafts.push(tempDraft);
                              var tempDataObj = { projection: parseFloat($scope.getDraftProjection(tempDraft)), actual: parseFloat($scope.getDraftActual(tempDraft)), validTeam: $scope.isDraftTeamValid(tempDraft), validSalary: $scope.isDraftSalaryValid(tempDraft), players: tempDraft, displayDetails: false };
                              $scope._AllDraftData.push(tempDataObj);//store valid only
                              tempDraft.forEach(function (player) {
                                  var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                                  $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
                                  $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
                              });
                            }
                        });
                    });
                });
            });
        });

        $http.post('/NBA/buildDraft', {'builtDrafts':$scope._AllDraftData.length}).then(function successCallback(response) {

        }, function errorCallBack(response) {
          if(response.data.error !== undefined) {
            $scope._AllDisplayedDraftData = [];
            $scope._AllDraftData = [];
            $scope.displayNewMessage('danger', 'Build Failed, '+response.data.error);
            return;
          } else {
            $scope.displayNewMessage('danger', 'Loading Single Saves - Failed');
            return;
          }
        });


        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        $scope.TotalValidDrafts = $scope.TotalPossibleDrafts;

        $scope._AllDraftData = $filter('orderBy')($scope._AllDraftData, $scope.sortTypeDraft, true);

        //cap GUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });

    }

    // $scope.switchValidDraftSelector = function () {
    //     $scope.SelectedValidDrafts = !$scope.SelectedValidDrafts;
    //     $scope.buildDrafts();
    // }

    $scope.setPlayerPercentInDraft = function (player) {
        if ($scope.SelectedValidDrafts) {
            player._PercentInDrafts = ((player._TimesInValidDrafts / $scope.TotalValidDrafts) * 100 ).toFixed(0);
        } else {
            player._PercentInDrafts = ((player._TimesInDrafts / $scope.TotalPossibleDrafts) * 100 ).toFixed(0);
        }
    }

    $scope.removeCalcDrafts = function (AVERAGE, STDEVIATION) {
        var calcRemovedDrafts = $filter('removeCalcDraft')($scope._AllDraftData, parseFloat(AVERAGE), parseFloat(STDEVIATION));

        $scope.AVERAGE = parseFloat(AVERAGE);
        $scope.STDEVIATION = parseFloat(STDEVIATION);

        $scope._AllDraftData = calcRemovedDrafts;

        $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
        var validDraftData = $filter('checkValidOnly')($scope._AllDraftData, true);
        $scope.TotalValidDrafts = validDraftData.length;

        $scope._AllPlayers.forEach(function (player) {
            player._TimesInDrafts = 0;
            player._TimesInValidDrafts = 0;
        });
        validDraftData.forEach(function (draftData) {
            draftData.players.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
            });
        });

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });
        //cap gUI to 150 to displayed
        $scope._AllDisplayedDraftData = [];
        if($scope._AllDraftData.length > 150) {
          for(var i = 0; i < 150; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        } else {
          for(var i = 0; i < $scope._AllDraftData.length; i++) {
            $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
          }
        }
    }
    $scope.getDraftSalaryRemaining = function (draft) {
        var startingSalary = 60000;
        draft.players.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return startingSalary;
    }
    $scope.removeDraftsWithBadPlayerSetups = function() {

      var rawLineupData = [];
      var draftsToKeep = [];

      var AllPGPlayers =  $filter('orderBy')($scope._PGPlayerPool, '_FPPG', true);
      var AllSGPlayers =  $filter('orderBy')($scope._SGPlayerPool, '_FPPG', true);
      var AllSFPlayers =  $filter('orderBy')($scope._SFPlayerPool, '_FPPG', true);
      var AllPFPlayers =  $filter('orderBy')($scope._PFPlayerPool, '_FPPG', true);
      var AllCPlayers =  $filter('orderBy')($scope._CPlayerPool, '_FPPG', true);

      for(var j = 0; j < $scope._AllDraftData.length; j++) {
          var PGPlayers = $filter('position')($scope._AllDraftData[j].players, 'PG');
          var SGPlayers = $filter('position')($scope._AllDraftData[j].players, 'SG');
          var SFPlayers = $filter('position')($scope._AllDraftData[j].players, 'SF');
          var PFPlayers = $filter('position')($scope._AllDraftData[j].players, 'PF');
          var CPlayers = $filter('position')($scope._AllDraftData[j].players, 'C');

          var PG1Value = AllPGPlayers.indexOf(PGPlayers[0]) + 1;
          if($scope._PGPlayerLocked.indexOf(PGPlayers[0]) !== -1) {
            PG1Value = 1;
          }
          var PG2Value = AllPGPlayers.indexOf(PGPlayers[1]) + 1;
          if($scope._PGPlayerLocked.indexOf(PGPlayers[1]) !== -1) {
            PG2Value = 1;
          }

          var SG1Value = AllSGPlayers.indexOf(SGPlayers[0]) + 1;
          if($scope._SGPlayerLocked.indexOf(SGPlayers[0]) !== -1) {
            SG1Value = 1;
          }
          var SG2Value = AllSGPlayers.indexOf(SGPlayers[1]) + 1;
          if($scope._SGPlayerLocked.indexOf(SGPlayers[1]) !== -1) {
            SG2Value = 1;
          }

          var SF1Value = AllSFPlayers.indexOf(SFPlayers[0]) + 1;
          if($scope._SFPlayerLocked.indexOf(SFPlayers[0]) !== -1) {
            SF1Value = 1;
          }
          var SF2Value = AllSFPlayers.indexOf(SFPlayers[1]) + 1;
          if($scope._SFPlayerLocked.indexOf(SFPlayers[1]) !== -1) {
            SF2Value = 1;
          }

          var PF1Value = AllPFPlayers.indexOf(PFPlayers[0]) + 1;
          if($scope._PFPlayerLocked.indexOf(PFPlayers[0]) !== -1) {
            PF1Value = 1;
          }
          var PF2Value = AllPFPlayers.indexOf(PFPlayers[1]) + 1;
          if($scope._PFPlayerLocked.indexOf(PFPlayers[1]) !== -1) {
            PF2Value = 1;
          }


          if (PG1Value < 3 && SG1Value < 3 && PF1Value < 4 && SF1Value < 3) {
            draftsToKeep.push($scope._AllDraftData[j]);
          }



      }



      $scope._AllDraftData = draftsToKeep;

      $scope.TotalPossibleDrafts = $scope._AllDraftData.length;
      $scope.TotalValidDrafts = $scope._AllDraftData.length;

      $scope._AllPlayers.forEach(function (player) {
          player._TimesInDrafts = 0;
          player._TimesInValidDrafts = 0;
      });
      $scope._AllDraftData.forEach(function (draftData) {
          draftData.players.forEach(function (player) {
              var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
              $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
          });
      });

      $scope._AllPlayers.forEach(function (player) {
          $scope.setPlayerPercentInDraft(player);
      });
      //cap gUI to 150 to displayed
      $scope._AllDisplayedDraftData = [];
      if($scope._AllDraftData.length > 150) {
        for(var i = 0; i < 150; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      } else {
        for(var i = 0; i < $scope._AllDraftData.length; i++) {
          $scope._AllDisplayedDraftData.push($scope._AllDraftData[i]);
        }
      }

    }
    $scope.keepThisDraftSalary = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {
      var errorRateToUse = 1300;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('position')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('position')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('position')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('position')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('position')(orderedDraftPlayers, 'C');

      var PG1Value = PGPlayers[0]._Salary;
      var PG2Value = PGPlayers[1]._Salary;

      var SG1Value = SGPlayers[0]._Salary;
      var SG2Value = SGPlayers[1]._Salary;

      var SF1Value = SFPlayers[0]._Salary;
      var SF2Value = SFPlayers[1]._Salary;

      var PF1Value = PFPlayers[0]._Salary;
      var PF2Value = PFPlayers[1]._Salary;

      var CValue = CPlayers[0]._Salary;

      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff > errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
    }
    $scope.keepThisDraftFPPG = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {
      var errorRateToUse = 5;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('position')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('position')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('position')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('position')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('position')(orderedDraftPlayers, 'C');

      var PG1Value = PGPlayers[0]._FPPG;
      var PG2Value = PGPlayers[1]._FPPG;

      var SG1Value = SGPlayers[0]._FPPG;
      var SG2Value = SGPlayers[1]._FPPG;

      var SF1Value = SFPlayers[0]._FPPG;
      var SF2Value = SFPlayers[1]._FPPG;

      var PF1Value = PFPlayers[0]._FPPG;
      var PF2Value = PFPlayers[1]._FPPG;

      var CValue = CPlayers[0]._FPPG;

      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff > errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff > errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
    }
    $scope.keepThisDraft = function(rawLineupData, AllPGPlayers, AllSGPlayers, AllSFPlayers, AllPFPlayers, AllCPlayers, inputDraft) {


      var errorRateToUse = 0;
      var orderedDraftPlayers =  $filter('orderBy')(inputDraft.players, '_FPPG', true);
      var PGPlayers = $filter('position')(orderedDraftPlayers, 'PG');
      var SGPlayers = $filter('position')(orderedDraftPlayers, 'SG');
      var SFPlayers = $filter('position')(orderedDraftPlayers, 'SF');
      var PFPlayers = $filter('position')(orderedDraftPlayers, 'PF');
      var CPlayers = $filter('position')(orderedDraftPlayers, 'C');

      var PG1Value = AllPGPlayers.indexOf(PGPlayers[0]) + 1;
      var PG2Value = AllPGPlayers.indexOf(PGPlayers[1]) + 1;

      var SG1Value = AllSGPlayers.indexOf(SGPlayers[0]) + 1;
      var SG2Value = AllSGPlayers.indexOf(SGPlayers[1]) + 1;

      var SF1Value = AllSFPlayers.indexOf(SFPlayers[0]) + 1;
      var SF2Value = AllSFPlayers.indexOf(SFPlayers[1]) + 1;

      var PF1Value = AllPFPlayers.indexOf(PFPlayers[0]) + 1;
      var PF2Value = AllPFPlayers.indexOf(PFPlayers[1]) + 1;

      var CValue = AllCPlayers.indexOf(CPlayers[0]) + 1;



      for(var k = 0; k < rawLineupData.length; k++) {
        var flagDraftBad = false;
        var PG1Diff = Math.abs(rawLineupData[k].PG1 - PG1Value);
        if(PG1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PG2Diff = Math.abs(rawLineupData[k].PG2 - PG2Value);
        if(PG2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SG1Diff = Math.abs(rawLineupData[k].SG1 - SG1Value);
        if(SG1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SG2Diff = Math.abs(rawLineupData[k].SG2 - SG2Value);
        if(SG2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SF1Diff = Math.abs(rawLineupData[k].SF1 - SF1Value);
        if(SF1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var SF2Diff = Math.abs(rawLineupData[k].SF2 - SF2Value);
        if(SF2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PF1Diff = Math.abs(rawLineupData[k].PF1 - PF1Value);
        if(PF1Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var PF2Diff = Math.abs(rawLineupData[k].PF2 - PF2Value);
        if(PF2Diff != errorRateToUse) {
          flagDraftBad = true;
        }
        var CDiff = Math.abs(rawLineupData[k].C - CValue);
        if(CDiff != errorRateToUse) {
          flagDraftBad = true;
        }

        if(!flagDraftBad) {
          return true;
        }
      }
      return false;
    }


    $scope.getDraftProjection = function (draft) {
        var totalProjection = 0;
        draft.forEach(function (player) {
            totalProjection = totalProjection + player._FPPG;
        });
        totalProjection = parseFloat(totalProjection);
        return totalProjection.toFixed(2);
    }
    $scope.getDraftActual = function (draft) {
        var totalActual = 0;
        draft.forEach(function (player) {
            totalActual = totalActual + player._ActualFantasyPoints;
        });
        totalActual = parseFloat(totalActual);
        return totalActual.toFixed(2);
    }

    $scope.openCloseDraftDetails = function (draftInput) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/modalDraft.html',
            controller: 'DraftModalController',
            size:'lg',
            resolve: {
                draft: function () {
                    return draftInput;
                }
            }
        });
    }
    $scope.openClosePlayerDetails = function (player) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/modalPlayer.html',
            controller: 'PlayerModalController',
            size: 'lg',
            resolve: {
                allPlayers: function () {
                    return $scope._AllPlayersMASTER;
                },
                selectedPlayer: function () {
                    return player;
                }
            }
        });
    }





    $scope.isDraftSalaryValid = function (draft) {
        var startingSalary = 60000;
        draft.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return (startingSalary >= 0) ? true : false;
    }
    $scope.isDraftTeamValid = function (draft) {
        var teams = {};
        draft.forEach(function (player) {
            if (!teams.hasOwnProperty(player._Team))
            {
                teams[player._Team] = 1;
            }
            else
            {
                teams[player._Team] = teams[player._Team] + 1;
            }
        });

        for (team in teams) {
            var value = teams[team];
            if(value > 4) {
                return false;
            }
        }
        return true;
    }
    $scope.getCombinations = function(players, min) {
        var fn = function(n, src, got, all) {
            if (n == 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return;
            }
            for (var j = 0; j < src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < players.length; i++) {
            fn(i, players, [], all);
        }
        all.push(players);

        for (var j = 0; j < all.length; j++) {
            if(all[j].length > min) {
                all.splice(j);
            }
        }
        return all;
    }
    $scope.clearAllPlayerFilters = function () {
        $scope.SelectedTeams = [];
        $scope.SelectedWeeks = [];
    }

    //#################################################################
    //################################################################# - DATABASE
    //#################################################################

    $scope.openSaveDialog = function () {
        $scope.savedPastSettings = [];

        var postObject = {
            _AllPlayers : $scope._AllPlayers,
            _PGPlayerLocked : $scope._PGPlayerLocked,
            _SGPlayerLocked : $scope._SGPlayerLocked,
            _SFPlayerLocked : $scope._SFPlayerLocked,
            _PFPlayerLocked : $scope._PFPlayerLocked,
            _CPlayerLocked : $scope._CPlayerLocked,
            _PGPlayerPool : $scope._PGPlayerPool,
            _SGPlayerPool : $scope._SGPlayerPool,
            _SFPlayerPool : $scope._SFPlayerPool,
            _PFPlayerPool : $scope._PFPlayerPool,
            _CPlayerPool : $scope._CPlayerPool,
            AVERAGE : $scope.AVERAGE,
            STDEVIATION : $scope.STDEVIATION,
            ERRORRATE : nba.ERRORRATE,
            TopLimit : nba.TopLimit
        };
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/saveDialog.html',
            controller: 'SaveModalController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                postObject: function () {
                    return postObject;
                },
                currentRead: function() {
                  return $scope.currentRead;
                }
            }
        });
        modalInstance.result.then(function (saveResult) {
          $scope.currentRead = saveResult['readData'];
          $scope.loadPlayersFromSave(saveResult['postObject']);
          $scope.mainTabHeading = "Players - "+saveResult['title'];
        }, function () {

        });
    }

    $scope.read = function(saveDetailsID) {

      $http.post('/NBA/read', {'id':saveDetailsID}).then(function successCallback(response) {
          $scope.currentRead = response.data;
          $scope.loadPlayersFromSave(JSON.parse($scope.currentRead['userSaveJSON']));
          $scope.mainTabHeading = "Players - "+$scope.currentRead['title'];
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Loading Single Saves - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Loading Single Saves - Failed');
        }
      });

    }

    $scope.loadHistory = function() {
      $http.post('/NBA/loadHistory', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Loading More Saves - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Loading More Saves - Failed');
        }

      });
    }

    $scope.setDeleteConfirmation = function(id) {
      $scope.DeleteConfirmationID = id;
    }

    $scope.unsetDeleteConfirmation = function() {
      $scope.DeleteConfirmationID = -1;
    }

    $scope.showDeleteConfirmation = function(id) {
      return ($scope.DeleteConfirmationID == id);
    }

    $scope.delete = function(saveID) {
      $http.post('/NBA/delete', {'id':saveID}).then(function successCallback(response) {
        var indexToDelete = -1;
        for(var j = 0; j < $scope.savedPastSettings.length;j++) {
          if($scope.savedPastSettings[j].id == saveID) {
            indexToDelete = j;
            break;
          }
        }
        $scope.savedPastSettings.splice(indexToDelete, 1);
        $scope.displayNewMessage('success', 'Deleting #'+saveID+' - Success');
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Deleting - Failed, '+response.data.error);
        } else {
          $scope.displayNewMessage('danger', 'Deleting - Failed');
        }
      });

    }
    $scope.updateTitle = function(saveID, title) {
      $http.post('/NBA/updateTitle', {'id':saveID, 'title': title}).then(function successCallback(response) {
        $scope.displayNewMessage('success', 'Title Update - Success, Saved: '+title);
      }, function errorCallBack(response) {
        if(response.data.error !== undefined) {
          $scope.displayNewMessage('danger', 'Title Update - Failed,'+response.data.error);
        } else if(response.data.title !== undefined) {
          $scope.displayNewMessage('danger', 'Title Update - Failed, '+response.data.title);
        } else {
          $scope.displayNewMessage('danger', 'Title Update - Failed');
        }
      });
    }
    $scope.loadPlayerInPool = function(playerPool, singlePlayer) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.addPlayerToPool(singlePlayer);
        }
      });
    }
    $scope.loadPlayerInLocked = function(playerPool, singlePlayer) {
      playerPool.forEach(function(singlePlayerInPool) {
        if(singlePlayerInPool._Name == singlePlayer._Name && singlePlayerInPool._Position == singlePlayer._Position && singlePlayerInPool._Team == singlePlayer._Team) {
            $scope.lockAndUnLockPlayer(singlePlayer);
        }
      });
    }
    $scope.loadPlayersFromSave = function(savedData) {

      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
      $scope.clearAllPlayerFilters();

      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;
      $scope.AVERAGE = parseFloat(savedData.AVERAGE);
      $scope.STDEVIATION = parseFloat(savedData.STDEVIATION);
      if(savedData.ERRORRATE != undefined) {
        nba.ERRORRATE = parseFloat(savedData.ERRORRATE);
      }
      if(savedData.TopLimit != undefined) {
        nba.TopLimit = parseInt(savedData.TopLimit);
      }
      $scope._AllPlayers.forEach(function(singlePlayer) {

        if($scope._Positions.indexOf(singlePlayer._Position) === -1) {
          $scope._Positions.push(singlePlayer._Position);
        }

        //add team data
        if ($scope._AllTeams.length == 0) {
            $scope._AllTeams.push(singlePlayer._Team);
        } else if ($scope._AllTeams.indexOf(singlePlayer._Team) == -1) {
            $scope._AllTeams.push(singlePlayer._Team);
        }

        $scope.loadPlayerInPool(savedData._PGPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._SGPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._SFPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._PFPlayerPool, singlePlayer);
        $scope.loadPlayerInPool(savedData._CPlayerPool, singlePlayer);

        $scope.loadPlayerInLocked(savedData._PGPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._SGPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._SFPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._PFPlayerLocked, singlePlayer);
        $scope.loadPlayerInLocked(savedData._CPlayerLocked, singlePlayer);
      });
      $scope._Positions.sort();
      $scope.displayNewMessage("success", "Previous save loaded successfully.");

    }

}]);
