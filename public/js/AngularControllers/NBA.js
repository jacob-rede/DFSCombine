var NFLApp = angular.module('NFLApp', ['ui.bootstrap']);


NFLApp.filter('position', function () {
    return function (allPlayers, input) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (input == '' || input == undefined) {
                filteredPlayers.push(element);
            }
            if (element._Position == input) {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})

NFLApp.filter('team', function () {
    return function (allPlayers, input) {
        var filteredPlayers = [];
        allPlayers.forEach(function (element) {
            if (input.length == 0 || input == undefined) {
                filteredPlayers.push(element);
            }
            if (input.indexOf(element._Team) > -1) {
                filteredPlayers.push(element);
            }
        });
        return filteredPlayers;
    };
})
NFLApp.filter('sort', function () {
    return function (allPlayers) {
        var filteredPlayers = [];

        var compare = function (a, b) {
            if (a._FPPG < b._FPPG)
                return -1;
            if (a._FPPG > b._FPPG)
                return 1;
            return 0;
        }
        allPlayers.sort(compare);
        allPlayers.reverse();
        return allPlayers;
    };
})
NFLApp.filter('sumProjection', function () {
    return function (allPlayers) {
        var projectionSum = 0;
        allPlayers.forEach(function (player) {
            projectionSum = projectionSum + player._FPPG;
        });
        return projectionSum.toFixed(2);
    };
})
NFLApp.filter('sumActual', function () {
    return function (allPlayers) {
        var actualSum = 0;
        allPlayers.forEach(function (player) {
            actualSum = actualSum + player._ActualFantasyPoints;
        });
        return actualSum.toFixed(2);
    };
})
NFLApp.filter('playersInPosition', function () {
    return function (allPlayers, position) {
        var totalPlayers = 0;
        allPlayers.forEach(function (player) {
            if(player._Position == position) {
                totalPlayers++;
            }
        });
        return totalPlayers;
    };
})
NFLApp.filter('removePosition', function () {
    return function (players, position) {
        var filteredPlayers = [];
        players.forEach(function (player) {
            if (player._Position != position) {
                filteredPlayers.push(player);
            }
        });
        return filteredPlayers;
    };
})
NFLApp.filter('checkValidOnly', function () {
    return function (drafts, valid) {
        var filteredDrafts = [];
        drafts.forEach(function (draft) {
            if (valid) {
                if (draft.validTeam && draft.validSalary) {
                    filteredDrafts.push(draft);
                }
            }
            else
            {
                filteredDrafts.push(draft);
            }

        });
        return filteredDrafts;
    };
})
NFLApp.filter('removeCalcDraft', function () {
    return function (drafts, AVERAGE, STDEVIATION) {
        var maxProjectionDraft = parseFloat(AVERAGE + STDEVIATION);
        var minProjectionDraft = parseFloat(AVERAGE - STDEVIATION);

        var filteredDrafts = [];
        drafts.forEach(function (draft) {
            if (minProjectionDraft <= draft.projection && draft.projection <= maxProjectionDraft) {
                filteredDrafts.push(draft);
            }
        });
        return filteredDrafts;
    };
})

//NFLApp.filter('randomize', function () {
//    return function (drafts) {
//        var currentIndex = drafts.length, temporaryValue, randomIndex;

//        // While there remain elements to shuffle...
//        while (0 !== currentIndex) {

//            // Pick a remaining element...
//            randomIndex = Math.floor(Math.random() * currentIndex);
//            currentIndex -= 1;

//            // And swap it with the current element.
//            temporaryValue = drafts[currentIndex];
//            drafts[currentIndex] = drafts[randomIndex];
//            drafts[randomIndex] = temporaryValue;
//        }
//        return drafts;
//    };
//})
NFLApp.controller('NBAController', ['$http', '$scope', '$filter', '$uibModal', '$window', function ($http, $scope, $filter, $uibModal, $window) {
    var nfl = this;

    $scope._Message = { hasData: true, messageType: "info", message: "Please Upload Player CSV..." };

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

    $scope._AllDrafts = [];
    $scope._AllDraftData = [];
    $scope.TotalPossibleDrafts = 0;
    $scope.TotalValidDrafts = 0;
    $scope.SelectedValidDrafts = false;

    $scope.sortType = '_FPPG'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.sortReverseDraft = false;
    $scope.SelectedPosition = '';     // set the default search/filter term
    $scope.SelectedTeams = [];
    $scope.SelectedStackPositions = [];
    $scope.SelectedDraft = null;

    $scope.savedPastSettings = [];
    $scope.AVERAGE = parseFloat(-1);
    $scope.STDEVIATION = parseFloat(-1);
    $scope.TopRange = -1;
    $scope.BottomRange = -1;

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

    var compareNumbers = function(a, b) {
        return b-a;
    }

    $scope.displayNewMessage = function (messageType, messageContent) {
        $window.scrollTo(0, 0);
        $scope._Message.message = "";
        $scope._Message.hasData = true;
        $scope._Message.messageType = messageType;
        $scope._Message.message = messageContent;
    }

    $scope.loadActual = function (file) {
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
                });
            }

            $scope.displayNewMessage("info", "Player Actual Results have been successfully loaded");
        }
        reader.readAsText(file[0]);
    }



    $scope.loadPlayers = function (file) {
      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();
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
                var playerRead = { playerID: playerID, _Position: playerPosition, _Name: playerFName + " " + playerLName, _FPPG: playerFPPG, _ActualFantasyPoints: -1, _Team: playerTeam, _Opponent: playerOpponent, _Salary: playerSalary, _ProjectedPointsPerDollar: pointsPerDollar, _playerInjured: playerInjury, _playerInjuryDetails: playerInjuryDetails, _playerGame: playerGame, _PercentInDrafts: -1, _TimesInDrafts: 0, _TimesInValidDrafts: 0 };
                $scope._AllPlayers.push(playerRead);
                $scope._AllPlayersMASTER.push(playerRead);

                //add team data
                if ($scope._AllTeams.length == 0) {
                    $scope._AllTeams.push(playerRead._Team);
                } else if ($scope._AllTeams.indexOf(playerRead._Team) == -1) {
                    $scope._AllTeams.push(playerRead._Team);
                }

            }

            $scope.displayNewMessage("info", "Players have been successfully loaded");
        }
        reader.readAsText(file[0]);
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
    $scope.parseFloat = function(value)
    {
       return parseFloat(value);
    }
    $scope.clearAllPlayers = function() {
      $scope._AllPlayers = [];
      $scope._AllPlayersMASTER = [];
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

        anchor.attr({
            href: encodeURI(csvContent),
            target: '_blank',
            download: 'NBADraftData.csv'
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
        var indexOfDraftToRemove = $scope._AllDraftData.indexOf(draft);
        $scope._AllDraftData.splice(indexOfDraftToRemove, 1);

    }

    $scope.clearDrafts = function () {
        $scope._AllDrafts = [];
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
                    $scope.displayNewMessage("danger", "Error: _PGPlayerLocked.length > 2 || null, cannot create combinations");
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
                    $scope.displayNewMessage("danger", "Error: _SGPlayerLocked.length > 2 || null, cannot create combinations");
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
                    $scope.displayNewMessage("danger", "Error: _SGPlayerLocked.length > 2 || null, cannot create combinations");
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
                    $scope.displayNewMessage("danger", "Error: _PFPlayerLocked.length > 2 || null, cannot create combinations");
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
                            $scope._AllDrafts.push(tempDraft);
                        });
                    });
                });
            });
        });

        $scope.TotalPossibleDrafts = $scope._AllDrafts.length;
        $scope._AllDrafts.forEach(function (draft) {
            var tempDataObj = { projection: parseFloat($scope.getDraftProjection(draft)), actual: parseFloat($scope.getDraftActual(draft)), validTeam: $scope.isDraftTeamValid(draft), validSalary: $scope.isDraftSalaryValid(draft), players: draft, displayDetails: false };
            $scope._AllDraftData.push(tempDataObj);
            draft.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInDrafts += 1;
            });


        });

        var validDraftData = $filter('checkValidOnly')($scope._AllDraftData, true);
        $scope.TotalValidDrafts = validDraftData.length;

        validDraftData.forEach(function (draftData) {
            draftData.players.forEach(function (player) {
                var playerIndexInGlobal = $scope._AllPlayers.indexOf(player);
                $scope._AllPlayers[playerIndexInGlobal]._TimesInValidDrafts += 1;
            });
        });

        $scope._AllPlayers.forEach(function (player) {
            $scope.setPlayerPercentInDraft(player);
        });

    }

    $scope.switchValidDraftSelector = function () {
        $scope.SelectedValidDrafts = !$scope.SelectedValidDrafts;
        $scope.buildDrafts();
    }

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
            STDEVIATION : $scope.STDEVIATION
    		};
        var modalInstance = $uibModal.open({
            templateUrl: '/js/AngularControllers/saveDialog.html',
            controller: 'SaveModalController',
            size: 'lg',
            resolve: {
                postObject: function () {
                    return postObject;
                }
            }
        });
    }

    $scope.loadSavedSettings = function(saveDetailsID) {
      $http.post('/NBA/loadSavedSettings', {'id':saveDetailsID}).then(function successCallback(response) {
          var jsonData = JSON.parse(response.data['userSaveJSON']);

          $scope.loadPlayersFromSave(jsonData);

      }, function errorCallBack(response) {
        console.log("errror");
      });

    }
    $scope.loadNBASavedSettingsDetails = function() {
      $http.post('/NBA/loadSavedSettingsDetails', {'endIndex':$scope.savedPastSettings.length}).then(function successCallback(response) {
        var jsonData = response.data;
        jsonData.forEach(function(singleDraftDetail) {
          $scope.savedPastSettings.push(singleDraftDetail);
        });
      }, function errorCallBack(response) {
        console.log("errror");
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
            console.log(singlePlayer);
            $scope.lockAndUnLockPlayer(singlePlayer);
        }
      });
    }
    $scope.loadPlayersFromSave = function(savedData) {

      $scope.clearPlayerPools();
      $scope.clearDrafts();
      $scope.clearAllPlayers();

      $scope._AllPlayers = savedData._AllPlayers;
      $scope._AllPlayersMASTER = savedData._AllPlayers;
      $scope.AVERAGE = parseFloat(savedData.AVERAGE);
      $scope.STDEVIATION = parseFloat(savedData.STDEVIATION);
      $scope._AllPlayers.forEach(function(singlePlayer) {

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

      $scope.displayNewMessage("info", "Previous save loaded successfully.");

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
        $scope.SelectedWeeks.push($scope._AllWeeks[0]);
    }

}]);

NFLApp.controller('DraftModalController', function ($scope, $uibModalInstance, draft) {

    $scope.draft = draft;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.getDraftSalaryLeft = function (draft) {
        var startingSalary = 60000;
        draft.players.forEach(function (player) {
            startingSalary = startingSalary - player._Salary;
        });
        return startingSalary;
    }
    $scope.getDraftProjection = function (draft) {
        var totalProjection = 0;
        draft.players.forEach(function (player) {
            totalProjection = totalProjection + player._FPPG;
        });
        return totalProjection.toFixed(2);
    }
    $scope.getDraftActual = function (draft) {
        var totalActual = 0;
        draft.players.forEach(function (player) {
            totalActual = totalActual + player._ActualFantasyPoints;
        });
        return totalActual.toFixed(2);
    }
});

NFLApp.controller('SaveModalController', function ($scope, $uibModalInstance, $http, postObject) {

  $scope.postObject = postObject;
  $scope.title = "";
  $scope.saved = false;

  $scope.savePlayerData = function() {
    if($scope.title.length > 0) {
      $http.post('/NBA/saveSettings', {'postObject':JSON.stringify($scope.postObject), 'title': $scope.title}).then(function successCallback(response) {
         console.log("success");
           $scope.saved = true;
      }, function errorCallBack(response) {
        console.log("errror");
        $uibModalInstance.close();
      });
    } else {
      $http.post('/NBA/saveSettings', {'postObject':JSON.stringify($scope.postObject)}).then(function successCallback(response) {
         console.log("success");
         $scope.saved = true;
      }, function errorCallBack(response) {
        console.log("errror");
      });
    }


  }
  $scope.ok = function () {
      $uibModalInstance.close();
  };

  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
});


NFLApp.controller('PlayerModalController', function ($scope, $uibModalInstance, allPlayers, selectedPlayer) {

    $scope.SelectedPlayer = selectedPlayer;
    $scope.allPlayers = allPlayers;

    $scope.OppHistoryVsPostion = [];
    $scope.OppHistoryVsPostionActualAverage = 0;
    $scope.OppHistoryVsPostionProjectionAverage = 0;

    $scope.playerPastData = [];
    $scope.sortType = '_WeekNum'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.SelectedPosition = '';     // set the default search/filter term

    var createPlayerData = function () {
        $scope.allPlayers.forEach(function (player) {
            //player history
            if (player._Name == $scope.SelectedPlayer._Name && player._Team == $scope.SelectedPlayer._Team) {
                //match
                if ($scope.playerPastData.indexOf(player) == -1) {
                    $scope.playerPastData.push(player);
                }
            }
            //Opponent history vs player position
            if ($scope.SelectedPlayer._Position == player._Position && $scope.SelectedPlayer._Opponent == player._Opponent) {
                //match
                if ($scope.OppHistoryVsPostion.indexOf(player) == -1) {
                    $scope.OppHistoryVsPostion.push(player);
                }

            }
        });
        $scope.OppHistoryVsPostion.forEach(function (player) {
            if (player._FPPG < 0) {
                $scope.OppHistoryVsPostionProjectionAverage += 0;
            } else {
                $scope.OppHistoryVsPostionProjectionAverage += player._FPPG;
            }
            if (player._ActualFantasyPoints < 0) {
                $scope.OppHistoryVsPostionActualAverage += 0;
            } else {
                $scope.OppHistoryVsPostionActualAverage += player._ActualFantasyPoints;
            }

        });
        $scope.OppHistoryVsPostionActualAverage = ($scope.OppHistoryVsPostionActualAverage / $scope.OppHistoryVsPostion.length).toFixed(2);
        $scope.OppHistoryVsPostionProjectionAverage = ($scope.OppHistoryVsPostionProjectionAverage / $scope.OppHistoryVsPostion.length).toFixed(2);
    };
    createPlayerData();

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


NFLApp.directive('setHeight', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', $window.innerHeight - 200 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
});
NFLApp.directive('setHeightDrafts', function ($window) {
    return {
        link: function (scope, element, attrs) {
            element.css('height', ($window.innerHeight - 200) / 2 + 'px');
            //element.height($window.innerHeight/3);
        }
    }
});
