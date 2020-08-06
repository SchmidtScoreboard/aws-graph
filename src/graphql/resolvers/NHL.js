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

const NHLTeams = {
    1: { id: 1, city: "New Jersey", name: "Devils", display_name: "Devils", abbreviation: "NJD", primary_color: "c8102e", secondary_color: "000000" },
    2: { id: 2, city: "New York", name: "Islanders", display_name: "Islanders", abbreviation: "NYI", primary_color: "003087", secondary_color: "fc4c02" },
    3: { id: 3, city: "New York", name: "Rangers", display_name: "Rangers", abbreviation: "NYR", primary_color: "0033a0", secondary_color: "c8102e" },
    4: { id: 4, city: "Philadelphia", name: "Flyers", display_name: "Flyers", abbreviation: "PHI", primary_color: "fa4616", secondary_color: "000000" },
    5: { id: 5, city: "Pittsburgh", name: "Penguins", display_name: "Penguins", abbreviation: "PIT", primary_color: "ffb81c", secondary_color: "000000" },
    6: { id: 6, city: "Boston", name: "Bruins", display_name: "Bruins", abbreviation: "BOS", primary_color: "fcb514", secondary_color: "000000" },
    7: { id: 7, city: "Buffalo", name: "Sabres", display_name: "Sabres", abbreviation: "BUF", primary_color: "002654", secondary_color: "fcb514" },
    8: { id: 8, city: "Montréal", name: "Canadiens", display_name: "Canadiens", abbreviation: "MTL", primary_color: "a6192e", secondary_color: "001e62" },
    9: { id: 9, city: "Ottawa", name: "Senators", display_name: "Senators", abbreviation: "OTT", primary_color: "c8102e", secondary_color: "c69214" },
    10: { id: 10, city: "Toronto", name: "Maple Leafs", display_name: "Leafs", abbreviation: "TOR", primary_color: "00205b", secondary_color: "ffffff" },
    12: { id: 12, city: "Carolina", name: "Hurricanes", display_name: "Canes", abbreviation: "CAR", primary_color: "cc0000", secondary_color: "a2a9af" },
    13: { id: 13, city: "Florida", name: "Panthers", display_name: "Panthers", abbreviation: "FLA", primary_color: "c8102e", secondary_color: "b9975b" },
    14: { id: 14, city: "Tampa Bay", name: "Lightning", display_name: "Lightning", abbreviation: "TBL", primary_color: "00205b", secondary_color: "ffffff" },
    15: { id: 15, city: "Washington", name: "Capitals", display_name: "Capitals", abbreviation: "WSH", primary_color: "041e42", secondary_color: "c8102e" },
    16: { id: 16, city: "Chicago", name: "Blackhawks", display_name: "Blackhawks", abbreviation: "CHI", primary_color: "ce1126", secondary_color: "cc8a00" },
    17: { id: 17, city: "Detroit", name: "Red Wings", display_name: "Red Wings", abbreviation: "DET", primary_color: "c8102e", secondary_color: "ffffff" },
    18: { id: 18, city: "Nashville", name: "Predators", display_name: "Predators", abbreviation: "NSH", primary_color: "ffb81c", secondary_color: "041e42" },
    19: { id: 19, city: "St. Louis", name: "Blues", display_name: "Blues", abbreviation: "STL", primary_color: "002f87", secondary_color: "ffb81c" },
    20: { id: 20, city: "Calgary", name: "Flames", display_name: "Flames", abbreviation: "CGY", primary_color: "ce1126", secondary_color: "f3bc52" },
    21: { id: 21, city: "Colorado", name: "Avalanche", display_name: "Avalanche", abbreviation: "COL", primary_color: "236192", secondary_color: "d94574" },
    22: { id: 22, city: "Edmonton", name: "Oilers", display_name: "Oilers", abbreviation: "EDM", primary_color: "fc4c02", secondary_color: "041e42" },
    23: { id: 23, city: "Vancouver", name: "Canucks", display_name: "Canucks", abbreviation: "VAN", primary_color: "008852", secondary_color: "00205b" },
    24: { id: 24, city: "Anaheim", name: "Ducks", display_name: "Ducks", abbreviation: "ANA", primary_color: "b5985a", secondary_color: "ffffff" },
    25: { id: 25, city: "Dallas", name: "Stars", display_name: "Stars", abbreviation: "DAL", primary_color: "006341", secondary_color: "a2aaad" },
    26: { id: 26, city: "Los Angeles", name: "Kings", display_name: "Kings", abbreviation: "LAK", primary_color: "a2aaad", secondary_color: "000000" },
    28: { id: 28, city: "San Jose", name: "Sharks", display_name: "Sharks", abbreviation: "SJS", primary_color: "006272", secondary_color: "e57200" },
    29: { id: 29, city: "Columbus", name: "Blue Jackets", display_name: "B. Jackets", abbreviation: "CBJ", primary_color: "041e42", secondary_color: "c8102e" },
    30: { id: 30, city: "Minnesota", name: "Wild", display_name: "Wild", abbreviation: "MIN", primary_color: "154734", secondary_color: "a6192e" },
    52: { id: 52, city: "Winnipeg", name: "Jets", display_name: "Jets", abbreviation: "WPG", primary_color: "041e42", secondary_color: "a2aaad" },
    53: { id: 53, city: "Arizona", name: "Coyotes", display_name: "Coyotes", abbreviation: "ARI", primary_color: "b4975a", secondary_color: "333f42" },
    54: { id: 54, city: "Las Vegas", name: "Golden Knights", display_name: "Knights", abbreviation: "VGK", primary_color: "8c2633", secondary_color: "e2d6b5" },
    87: { id: 87, city: "Atlantic", name: "Atlantic All Stars", display_name: "Atlantic", abbreviation: "ATL", primary_color: "fa1b1b", secondary_color: "000000" },
    88: { id: 88, city: "Metropolitan", name: "Metropolitan All Stars", display_name: "Metro", abbreviation: "MET", primary_color: "fae71b", secondary_color: "000000" },
    89: { id: 89, city: "Central", name: "Central All Stars", display_name: "Central", abbreviation: "CEN", primary_color: "1411bd", secondary_color: "000000" },
    90: { id: 90, city: "Pacific", name: "Pacific All Stars", display_name: "Pacific", abbreviation: "PAC", primary_color: "11bd36", secondary_color: "000000" },
    7460: { id: 7460, city: "Canada", name: "Canadian All Stars", display_name: "Canada", abbreviation: "CA", primary_color: "d11717", secondary_color: "ffffff" },
    7461: { id: 7461, city: "America", name: "American All Stars", display_name: "America", abbreviation: "USA", primary_color: "3271a8", secondary_color: "ffffff" },
}

async function refreshSchedule() {
    isRefreshing = true;
    last_full_refresh_time = Date.now();
    try {

        console.log("Refreshing schedule");
        const schedule_url = 'https://statsapi.web.nhl.com/api/v1/schedule';
        let response = await axios.get(schedule_url);
        const data = response["data"];
        var games = [];
        if (data["dates"].length > 0) {
            const schedule = data["dates"][0]["games"]

            games = schedule.filter(game => {
                // first, make sure both teams show up in our team list
                const awayId = game["teams"]["away"]["team"]["id"]
                const homeId = game["teams"]["home"]["team"]["id"]
                return awayId in NHLTeams && homeId in NHLTeams;
            }).map(game => {
                return {
                    common: {
                        away_team: NHLTeams[game["teams"]["away"]["team"]["id"]],
                        home_team: NHLTeams[game["teams"]["home"]["team"]["id"]],
                        away_score: 0,
                        home_score: 0,
                        ordinal: "",
                        status: GameStatus.INVALID,
                        start_time: game["gameDate"],
                        id: game["gamePk"]
                    },
                    away_powerplay: false,
                    home_powerplay: false,
                    away_players: 0,
                    home_players: 0
                }
            });
        } else {
            games = [];
        }
        console.log("Found " + games.length + " games!");
    } catch (err) {

        console.log("There was an error refreshing schedule, " + err);
        isError = true;
        return new Error("Internal Server Error");
    }
    return await refreshGames(games);
}

async function refreshGame(game) {
    console.log("Refreshing game " + game['common']['id']);
    const game_url = 'https://statsapi.web.nhl.com/api/v1/game/' + game['common']['id'] + '/linescore';
    let api_response = await axios.get(game_url)
    const response = api_response["data"];
    const teams = response['teams'];
    const away = teams['away'];
    const home = teams['home'];
    game['common']['away_score'] = away['goals'];
    game['common']['home_score'] = home['goals'];
    game['away_powerplay'] = away['powerPlay'];
    game['home_powerplay'] = home['powerPlay'];
    game['away_players'] = away['numSkaters'];
    game['home_players'] = home['numSkaters'];
    const period = response['currentPeriod'];
    // current period time remaining does not appear until the game starts
    const period_time = response['currentPeriodTimeRemaining'] || '20:00';
    if (period >= 1) {
        game['common']['ordinal'] = response["currentPeriodOrdinal"] || '1st';
    }

    var status = GameStatus.getValue("INVALID").value;
    if (period_time == "Final") {
        status = GameStatus.getValue("END").value;
    } else if (period_time == "END") {
        if (period >= 3 && away['goals'] != home['goals']) {
            status = GameStatus.getValue("END").value;
        } else {
            status = GameStatus.getValue("INTERMISSION").value;
            game['common']['ordinal'] += " INT";
        }
    } else if (period_time == "20:00" && period > 1) {
        status = GameStatus.getValue("INTERMISSION").value;
        game['common']['ordinal'] += " INT";
    } else if (period_time != "20:00" && period >= 1) {
        status = GameStatus.getValue("ACTIVE").value;
    } else {
        status = GameStatus.getValue("PREGAME").value;
    }
    game['common']['status'] = status;
    console.log("Done Refreshing game " + game['common']['id']);
    return game;
}

async function refreshGames(games) {
    isRefreshing = true;
    last_refresh_time = Date.now();
    try {
        saved_games = await Promise.all(games.map(async (game) => {
            return await refreshGame(game);
        }));
        isError = false;
        isRefreshing = false;
        return saved_games;
    } catch (err) {
        console.log("There was an error refreshing games " + err);
        isError = true;
        return new Error("Internal Server Error");

    }
}

const NHLController = {
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
                promise = refreshGames(saved_games);
            }
        }
        return promise;
    }
}

module.exports = NHLController;