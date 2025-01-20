let players = [];
let matches = [];
let results = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.player-button').forEach(button => {
    button.addEventListener('click', () => togglePlayer(button));
  });
});

function togglePlayer(button) {
  const playerName = button.dataset.player;
  if (players.includes(playerName)) {
    players = players.filter(player => player !== playerName);
    button.classList.remove('selected');
  } else {
    players.push(playerName);
    button.classList.add('selected');
  }

  console.log("Selected players:", players);

  if (players.length === 4) {
    generateInitialMatches();
  } else if (players.length > 4) {
    alert('Velg kun 4 spillere.');
    players = players.slice(0, 4); // Limit to 4 players
    document.querySelectorAll('.player-button').forEach(btn => {
      if (!players.includes(btn.dataset.player)) {
        btn.classList.remove('selected');
      }
    });
  }
}

function generateInitialMatches() {
  matches = generateRandomMatches(players, 3);
  updateMatchList();
  console.log("Initial matches generated:", matches);
}

function generateMoreMatches() {
  if (players.length !== 4) {
    alert('Velg nøyaktig 4 spillere for å generere kamper.');
    return;
  }

  const newMatches = generateRandomMatches(players, 3, matches[matches.length - 1]);
  matches = matches.concat(newMatches);
  updateMatchList();
  console.log("Additional matches generated:", newMatches);
}

function generateRandomMatches(players, numMatches, lastMatch = null) {
  const allPossibleMatches = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const team1 = [players[i], players[j]];
      const team2 = players.filter(player => !team1.includes(player));
      allPossibleMatches.push({ team1, team2 });
    }
  }

  // Shuffle for randomness
  for (let i = allPossibleMatches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPossibleMatches[i], allPossibleMatches[j]] = [allPossibleMatches[j], allPossibleMatches[i]];
  }

  const selectedMatches = [];
  while (selectedMatches.length < numMatches) {
    const match = allPossibleMatches.pop();

    // Ensure no consecutive duplicates
    if (!lastMatch || JSON.stringify(match) !== JSON.stringify(lastMatch)) {
      selectedMatches.push(match);
    }

    if (allPossibleMatches.length === 0) {
      break; // Prevent infinite loop
    }
  }

  return selectedMatches;
}

function updateMatchList() {
  const matchSelect = document.getElementById('matchSelect');
  matchSelect.innerHTML = matches.map(
    (m, index) => `<option value="${index}">${m.team1.join(' & ')} vs ${m.team2.join(' & ')}</option>`
  ).join('');
  updateActiveMatch();
}

function updateActiveMatch() {
  const matchIndex = document.getElementById('matchSelect').value;
  const activeMatchDiv = document.getElementById('activeMatch');
  if (matchIndex === "") {
    activeMatchDiv.innerHTML = "Velg en kamp fra listen under";
  } else {
    const match = matches[matchIndex];
    activeMatchDiv.innerHTML = `${match.team1.join(' & ')} vs ${match.team2.join(' & ')}`;
  }
}

function recordResult() {
  const matchIndex = document.getElementById('matchSelect').value;
  const predefinedResult = document.getElementById('predefinedResults').value;
  const team1Score = parseInt(document.getElementById('team1Score').value);
  const team2Score = parseInt(document.getElementById('team2Score').value);
  const errorMessage = document.getElementById('errorMessage');

  let result;
  if (predefinedResult) {
    result = predefinedResult;
  } else if (!isNaN(team1Score) && !isNaN(team2Score) && team1Score + team2Score === 21) {
    result = `${team1Score}-${team2Score}`;
  } else {
    errorMessage.style.display = 'block';
    return;
  }

  errorMessage.style.display = 'none';
  const match = matches[matchIndex];
  results.push({ match, result });
  matches.splice(matchIndex, 1);

  updateScoringHistory();
  updateMatchList();
  updateActiveMatch();
  updateStandings();
}

function updateScoringHistory() {
  const scoringHistoryList = document.getElementById('scoringHistoryList');
  scoringHistoryList.innerHTML = results.map((entry, index) => {
    const { match, result } = entry;
    return `<li>${match.team1.join(' & ')} vs ${match.team2.join(' & ')}: ${result} <button onclick="editResult(${index})">Rediger</button></li>`;
  }).join('');
}

function editResult(index) {
  const { match, result } = results[index];
  const newResult = prompt(`Rediger resultat for ${match.team1.join(' & ')} vs ${match.team2.join(' & ')}`, result);
  if (newResult && /^[0-9]+-[0-9]+$/.test(newResult)) {
    results[index].result = newResult;
    updateScoringHistory();
    updateStandings();
  } else {
    alert('Ugyldig resultatformat. Prøv igjen.');
  }
}

function updateStandings() {
  const standings = {};
  players.forEach(player => standings[player] = { wins: 0, goalDiff: 0 });

  results.forEach(({ match, result }) => {
    const [score1, score2] = result.split('-').map(Number);
    const team1 = match.team1;
    const team2 = match.team2;

    team1.forEach(player => standings[player].goalDiff += score1 - score2);
    team2.forEach(player => standings[player].goalDiff += score2 - score1);

    if (score1 > score2) {
      team1.forEach(player => standings[player].wins += 1);
    } else {
      team2.forEach(player => standings[player].wins += 1);
    }
  });

  const sortedStandings = Object.entries(standings).sort(([, a], [, b]) => b.goalDiff - a.goalDiff || b.wins - a.wins);
  const standingsList = document.getElementById('standingsList');
  standingsList.innerHTML = sortedStandings.map(
    ([player, stats]) => `<li>${player}: ${stats.wins} seire, ${stats.goalDiff} målforskjell</li>`
  ).join('');
}
