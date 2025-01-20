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

  if (players.length === 4) {
    generateInitialMatches();
  } else if (players.length > 4) {
    alert('Velg kun 4 spillere.');
    players = players.slice(0, 4);
    document.querySelectorAll('.player-button').forEach(btn => {
      if (!players.includes(btn.dataset.player)) {
        btn.classList.remove('selected');
      }
    });
  }
}

function generateInitialMatches() {
  matches = generatePredefinedUniqueMatches(players);
  updateActiveMatch();
}

function generateMoreMatches() {
  if (players.length !== 4) {
    alert('Velg nøyaktig 4 spillere for å generere kamper.');
    return;
  }

  const newMatches = generatePredefinedUniqueMatches(players);
  matches = matches.concat(newMatches);
  updateActiveMatch();
}

function generatePredefinedUniqueMatches(players) {
  if (players.length !== 4) {
    alert('Velg nøyaktig 4 spillere.');
    return [];
  }

  const predefinedMatches = [
    { team1: [players[0], players[1]], team2: [players[2], players[3]] },
    { team1: [players[0], players[2]], team2: [players[1], players[3]] },
    { team1: [players[0], players[3]], team2: [players[1], players[2]] },
  ];

  for (let i = predefinedMatches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [predefinedMatches[i], predefinedMatches[j]] = [predefinedMatches[j], predefinedMatches[i]];
  }

  return predefinedMatches;
}

function updateActiveMatch() {
  const activeMatchDiv = document.getElementById('activeMatch');
  if (matches.length > 0) {
    const match = matches[0];
    activeMatchDiv.innerHTML = `${match.team1.join(' & ')} vs ${match.team2.join(' & ')}`;
    updateSliderResult();
  } else {
    activeMatchDiv.innerHTML = "Ingen aktive kamper. Generer flere kamper.";
  }
}

function updateSliderResult() {
  const slider = document.getElementById('scoreSlider');
  const team1Score = 21 - slider.value;
  const team2Score = parseInt(slider.value, 10);

  if (matches.length > 0) {
    document.getElementById('team1Score').textContent = team1Score;
    document.getElementById('team2Score').textContent = team2Score;
  }
}

function recordSliderResult() {
  if (matches.length === 0) {
    alert('Ingen kamp å registrere resultat for.');
    return;
  }

  const slider = document.getElementById('scoreSlider');
  const team1Score = 21 - slider.value;
  const team2Score = parseInt(slider.value, 10);

  const match = matches.shift();
  const result = `${team1Score}-${team2Score}`;
  results.push({ match, result });

  updateScoringHistory();
  updateActiveMatch();
  updateStandings();
}

function updateScoringHistory() {
  const scoringHistoryList = document.getElementById('scoringHistoryList');
  scoringHistoryList.innerHTML = results.map((entry, index) => {
    const { match, result } = entry;
    return `
      <li>
        ${match.team1.join(' & ')} vs ${match.team2.join(' & ')}: ${result}
        <button onclick="editResult(${index})">Rediger</button>
      </li>`;
  }).join('');
}

function editResult(index) {
  const { match, result } = results[index];
  const newResult = prompt(`Rediger resultat for ${match.team1.join(' & ')} vs ${match.team2.join(' & ')}`, result);
  if (newResult && /^[0-9]+-[0-9]+$/.test(newResult)) {
    const [score1, score2] = newResult.split('-').map(Number);
    if (score1 + score2 === 21) {
      results[index].result = newResult;
      updateScoringHistory();
      updateStandings();
    } else {
      alert('Summen av poengene må være 21.');
    }
  } else {
    alert('Ugyldig format. Prøv igjen.');
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
