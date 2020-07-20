'use strict';
const axios = require('axios');
const GameStatus = require('../types/GameStatus');
var saved_games = [];
var last_refresh_time = 0; // Refresh each individual game every minute
var last_full_refresh_time = 0; // Refresh games list every hour
var isError = false;
var req_num = 0;
var isRefreshing = false;
var promise;
const ONE_MINUTE_MILLIS = 1000 * 60;
const ONE_HOUR_MILLIS = ONE_MINUTE_MILLIS * 60;

const MLBTeams = {
    108: { id: 108, city: 'Los Angeles', name: "Angels", display_name: "Angels", abbreviation: "LAA", primary_color: "ba0021", secondary_color: "c4ced4" },
    109: { id: 109, city: 'Arizona', name: "D-backs", display_name: "D-backs", abbreviation: "ARI", primary_color: "a71930", secondary_color: "e3d4ad" },
    110: { id: 110, city: 'Baltimore', name: "Orioles", display_name: "Orioles", abbreviation: "BAL", primary_color: "df4601", secondary_color: "27251f" },
    111: { id: 111, city: 'Boston', name: "Red Sox", display_name: "Red Sox", abbreviation: "BOS", primary_color: "c6011f", secondary_color: "ffffff" },
    112: { id: 112, city: 'Chicago', name: "Cubs", display_name: "Cubs", abbreviation: "CHC", primary_color: "0e3386", secondary_color: "cc3433" },
    113: { id: 113, city: 'Cincinnati', name: "Reds", display_name: "Reds", abbreviation: "CIN", primary_color: "c6011f", secondary_color: "000000" },
    114: { id: 114, city: 'Cleveland', name: "Indians", display_name: "Indians", abbreviation: "CLE", primary_color: "e31937", secondary_color: "0c2340" },
    115: { id: 115, city: 'Colorado', name: "Rockies", display_name: "Rockies", abbreviation: "COL", primary_color: "33006f", secondary_color: "c4ced4" },
    116: { id: 116, city: 'Detroit', name: "Tigers", display_name: "Tigers", abbreviation: "DET", primary_color: "0c2340", secondary_color: "fa4616" },
    117: { id: 117, city: 'Houston', name: "Astros", display_name: "Astros", abbreviation: "HOU", primary_color: "002d62", secondary_color: "f4911e" },
    118: { id: 118, city: 'Kansas City', name: "Royals", display_name: "Royals", abbreviation: "KC", primary_color: "004687", secondary_color: "bd9b60" },
    119: { id: 119, city: 'Los Angeles', name: "Dodgers", display_name: "Dodgers", abbreviation: "LAD", primary_color: "005a9c", secondary_color: "ef3e42" },
    120: { id: 120, city: 'Washington', name: "Nationals", display_name: "Nationals", abbreviation: "WSH", primary_color: "ab0003", secondary_color: "14225a" },
    121: { id: 121, city: 'New York', name: "Mets", display_name: "Mets", abbreviation: "NYM", primary_color: "002d72", secondary_color: "fc5910" },
    133: { id: 133, city: 'Oakland', name: "Athletics", display_name: "Athletics", abbreviation: "OAK", primary_color: "003831", secondary_color: "efb21e" },
    134: { id: 134, city: 'Pittsburgh', name: "Pirates", display_name: "Pirates", abbreviation: "PIT", primary_color: "fdb827", secondary_color: "27251f" },
    135: { id: 135, city: 'San Diego', name: "Padres", display_name: "Padres", abbreviation: "SD", primary_color: "002d62", secondary_color: "a2aaad" },
    136: { id: 136, city: 'Seattle', name: "Mariners", display_name: "Mariners", abbreviation: "SEA", primary_color: "005c5c", secondary_color: "c4ced4" },
    137: { id: 137, city: 'San Francisco', name: "Giants", display_name: "Giants", abbreviation: "SF", primary_color: "27251f", secondary_color: "fd5a1e" },
    138: { id: 138, city: 'St. Louis', name: "Cardinals", display_name: "Cardinals", abbreviation: "STL", primary_color: "c41e3a", secondary_color: "0c2340" },
    139: { id: 139, city: 'Tampa Bay', name: "Rays", display_name: "Rays", abbreviation: "TB", primary_color: "d65a24", secondary_color: "ffffff" },
    140: { id: 140, city: 'Texas', name: "Rangers", display_name: "Rangers", abbreviation: "TEX", primary_color: "003278", secondary_color: "c0111f" },
    141: { id: 141, city: 'Toronto', name: "Blue Jays", display_name: "Blue Jays", abbreviation: "TOR", primary_color: "134a8e", secondary_color: "b1b3b3" },
    142: { id: 142, city: 'Minnesota', name: "Twins", display_name: "Twins", abbreviation: "MIN", primary_color: "002b5c", secondary_color: "d31145" },
    143: { id: 143, city: 'Philadelphia', name: "Phillies", display_name: "Phillies", abbreviation: "PHI", primary_color: "e81828", secondary_color: "002d72" },
    144: { id: 144, city: 'Atlanta', name: "Braves", display_name: "Braves", abbreviation: "ATL", primary_color: "13274f", secondary_color: "ce1141" },
    145: { id: 145, city: 'Chicago', name: "White Sox", display_name: "White Sox", abbreviation: "CWS", primary_color: "27251f", secondary_color: "c4ced4" },
    146: { id: 146, city: 'Miami', name: "Marlins", display_name: "Marlins", abbreviation: "MIA", primary_color: "000000", secondary_color: "00a3e0" },
    147: { id: 147, city: 'New York', name: "Yankees", display_name: "Yankees", abbreviation: "NYY", primary_color: "0c2340", secondary_color: "ffffff" },
    158: { id: 158, city: 'Milkwaukee', name: "Brewers", display_name: "Brewers", abbreviation: "MIL", primary_color: "13294b", secondary_color: "b6922e" },
    159: { id: 159, city: 'NL', name: "NL All Stars", display_name: "NL All Stars", abbreviation: "NL", primary_color: "ff0000", secondary_color: "ffffff" },
    160: { id: 160, city: 'AL', name: "AL All Stars", display_name: "AL All Stars", abbreviation: "AL", primary_color: "0000ff", secondary_color: "ffffff" },
}

async function refreshSchedule() {
    last_full_refresh_time = Date.now();
    try {

        console.log("Refreshing schedule");
        const schedule_url = 'http://statsapi.mlb.com/api/v1/schedule?sportId=1';
        let response = await axios.get(schedule_url);
        const data = response["data"];
        var games = [];
        games = [
            {
                common: {
                    away_team: MLBTeams[112],
                    home_team: MLBTeams[138],
                    away_score: 5,
                    home_score: 5,
                    ordinal: "8th",
                    status: GameStatus.getValue("ACTIVE").value,
                    start_time: "2020-07-02T16:05:00Z",
                    id: 5
                },
                balls: 2,
                outs: 1,
                strikes: 2,
                inning: 8,
                is_inning_top: true
            }

        ];
        // if (data["dates"].length > 0) {
        //     const schedule = data["dates"][0]["games"]
        //     games = schedule.filter(game => {
        //         const awayId = game["teams"]["away"]["team"]["id"];
        //         const homeId = game["teams"]["home"]["team"]["id"];
        //         return awayId in MLBTeams && homeId in MLBTeams;
        //     }).map(game => {
        //         return {
        //             common: {
        //                 away_team: MLBTeams[game["teams"]["away"]["team"]["id"]],
        //                 home_team: MLBTeams[game["teams"]["home"]["team"]["id"]],
        //                 away_score: 0,
        //                 home_score: 0,
        //                 ordinal: "",
        //                 status: GameStatus.INVALID,
        //                 start_time: game["gameDate"],
        //                 id: game["gamePk"]
        //             },
        //             balls: 0,
        //             outs: 0,
        //             strikes: 0,
        //             inning: 0,
        //             is_inning_top: false
        //         }
        //     });
        // } else {
        //     games = [];
        // }
        console.log("Found " + games.length + " games!");
    } catch (err) {

        console.log("There was an error refreshing schedule, " + err);
        isError = true;
        return new Error("Internal Server Error");
    }
    return games;
    // return await refreshGames(games);
}

async function refreshGame(game) {
    const feed_url = 'http://statsapi.mlb.com/api/v1.1/game/' + game['common']['id'] + '/feed/live'
    console.log("Refreshing game " + game['common']['id'] + " url: " + feed_url);
    let feed_result = await axios.get(feed_url);
    let feed_response = feed_result["data"]
    let linescore = feed_response["liveData"]["linescore"];
    const teams = linescore['teams'];
    const away = teams['away'];
    const home = teams['home'];
    game['common']['away_score'] = away['runs'] || 0;
    game['common']['home_score'] = home['runs'] || 0;
    game['inning'] = linescore['currentInning'] || 0;
    game['is_inning_top'] = linescore['isTopInning'] || false;

    const gameState = feed_response["gameData"]['status']['abstractGameState'];
    if (gameState == 'Final') {
        game['common']['ordinal'] = 'Final';
        game['common']['status'] = GameStatus.getValue("END").value;
    } else if (gameState == 'Live') {
        game['common']['ordinal'] = linescore['currentInningOrdinal'] || ''
        game['common']['status'] = GameStatus.getValue("ACTIVE").value;
    } else if (gameState == 'Preview') {
        game['common']['ordinal'] = ''
        game['common']['status'] = GameStatus.getValue("PREGAME").value;
    } else {
        game['common']['ordinal'] = 'Stats Error'
        game['common']['status'] = GameStatus.getValue("INVALID").value;
    }

    if (game['common']['status'] == GameStatus.getValue("ACTIVE").value) {
        game['balls'] = linescore['balls'];
        game['outs'] = linescore['outs'];
        game['strikes'] = linescore['strikes'];
        if (game['outs'] == 3) {
            // TODO: This is an awful if statement, it should be broken up into pieces
            // if it is at least the 9th inning, and it's the end of the top of the inning and the home team has more points, the home team wins
            // if it's the end of the bottom of the >=9th inning, and either team has more points, the game is over
            if (game['inning'] >= 9 && (
                (game['is_inning_top'] && home['runs'] > away['runs']) ||
                (!game['is_inning_top'] && home['runs'] != away['runs'])
            )) {
                console.log("Detected game end")
                game['common']['ordinal'] = "Final"
                game['common']['status'] = GameStatus.getValue("END").value;
            } else if (game['is_inning_top']) {
                game['common']['ordinal'] = "Middle " + game['common']['ordinal'];
                game['common']['status'] = GameStatus.getValue("INTERMISSION").value;
            } else {
                game['common']['ordinal'] = "Middle " + game['common']['ordinal'];
                game['common']['status'] = GameStatus.getValue("INTERMISSION").value;
            }
        }
    }

    console.log("Done Refreshing game " + game['common']['id']);
    return game;
}

async function refreshGames(games) {
    last_refresh_time = Date.now();
    try {
        var new_games = [];
        for (var game of games) {
            let update = await refreshGame(game);
            new_games.push(update);
        }
        // saved_games = await Promise.all(games.map(async (game) => {
        //     return await refreshGame(game);
        // }));
        isError = false;
        saved_games = new_games
        console.log("Finished refreshing all games!");
        return saved_games;
    } catch (err) {
        console.log("There was an error refreshing games " + err);
        isError = true;
        return new Error("Internal Server Error");

    }
}

const MLBController = {
    index: () => {
        req_num++;
        console.log("Got request " + req_num + " at " + Date.now());
        if (!isRefreshing) { // If we are refreshing, the promise is waiting to finish
            promise = saved_games;
            if (isError && last_refresh_time + ONE_MINUTE_MILLIS < Date.now()) {
                promise = refreshSchedule();
            }
            else if (last_full_refresh_time + ONE_HOUR_MILLIS < Date.now()) {
                promise = refreshSchedule();
            } else if (last_refresh_time + ONE_MINUTE_MILLIS < Date.now()) {
                // promise = refreshGames(saved_games);
            }
        }
        return promise;
    }
}

module.exports = MLBController;