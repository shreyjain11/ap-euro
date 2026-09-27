import { shuffle, isCorrect } from './core.js';
import { periods } from './periods.js';

const $ = id => document.getElementById(id);
let studySet = null;
let round = [];
let options = [];
let answers = {};
let checked = false;
let revealed = false;
let grade = [];
const direction = () => $('direction').value;
const answerText = entry => direction() === 'definition' ? entry.word : entry.definition;

function notice(text) { $('notice').textContent = text; }
function choosePeriod(id, updateUrl = false) {
  studySet = periods.find(period => period.id === id) || periods[0];
  document.querySelectorAll('[data-period]').forEach(link => {
    if (link.dataset.period === studySet.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `AP Euro · ${studySet.name} — Match & remember`;
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('period', studySet.id);
    history.pushState(null, '', url);
    notice(`${studySet.name} ready. ${studySet.entries.length} terms from the supplied StudyMate set.`);
  }
  startRound();
}

function loadSet() {
  const navigation = document.createDocumentFragment();
  periods.forEach(period => {
    const link = document.createElement('a');
    link.href = `?period=${period.id}`;
    link.dataset.period = period.id;
    link.textContent = `${period.name} · ${period.entries.length} terms`;
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      choosePeriod(period.id, true);
    });
    navigation.append(link);
  });
  $('periods').replaceChildren(navigation);
  choosePeriod(new URLSearchParams(window.location.search).get('period'));
}
window.addEventListener('popstate', () => choosePeriod(new URLSearchParams(window.location.search).get('period')));

function startRound(subset) {
  if (!studySet) return;
  const size = Number($('round-size').value) || studySet.entries.length;
  round = subset || shuffle(studySet.entries).slice(0, size);
  options = shuffle(round);
  answers = {}; checked = false; revealed = false; grade = [];
  $('set-heading').textContent = studySet.name;
  $('set-count').textContent = `${studySet.entries.length} terms in your set · ${round.length} in this round`;
  $('prompt-label').textContent = direction() === 'definition' ? 'DEFINITION' : 'TERM';
  $('answer-label').textContent = direction() === 'definition' ? 'CHOOSE THE TERM' : 'CHOOSE THE DEFINITION';
  $('results').hidden = true;
  renderQuestions();
}

function renderQuestions() {
  const fragment = document.createDocumentFragment();
  round.forEach((entry, index) => {
    const row = document.createElement('div'); row.className = 'question'; row.dataset.entry = entry.id;
    const prompt = document.createElement('div'); prompt.className = 'prompt';
    const number = document.createElement('span'); number.className = 'number'; number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('label'); label.htmlFor = `answer-${entry.id}`; label.textContent = direction() === 'definition' ? entry.definition : entry.word;
    prompt.append(number, label);
    const answer = document.createElement('div'); answer.className = 'answer';
    const select = document.createElement('select'); select.id = `answer-${entry.id}`; select.dataset.entry = entry.id;
    select.setAttribute('aria-describedby', `feedback-${entry.id}`);
    const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = direction() === 'definition' ? 'Choose a term…' : 'Choose a definition…'; select.append(placeholder);
    options.forEach(option => { const element = document.createElement('option'); element.value = option.id; element.textContent = answerText(option); select.append(element); });
    const fullText = document.createElement('p'); fullText.className = 'chosen-definition'; fullText.hidden = true;
    const feedback = document.createElement('p'); feedback.className = 'feedback'; feedback.id = `feedback-${entry.id}`;
    select.addEventListener('change', () => {
      answers[entry.id] = select.value;
      checked = false; revealed = false; $('results').hidden = true;
      document.querySelectorAll('.question').forEach(item => item.classList.remove('correct', 'incorrect'));
      document.querySelectorAll('.feedback').forEach(item => { item.textContent = ''; });
      document.querySelectorAll('.answer select').forEach(item => item.removeAttribute('aria-invalid'));
      fullText.textContent = select.value ? answerText(options.find(item => item.id === select.value)) : '';
      fullText.hidden = direction() !== 'term' || !select.value;
      updateProgress();
    });
    answer.append(select, fullText, feedback); row.append(prompt, answer); fragment.append(row);
  });
  $('questions').replaceChildren(fragment);
  updateProgress();
}

function updateProgress() {
  const answered = round.filter(entry => answers[entry.id]).length;
  $('progress-text').textContent = `${answered} of ${round.length} answered`;
  $('progress').max = round.length; $('progress').value = answered;
  $('check').disabled = !answered;
}

function checkAnswers() {
  if (!round.length) return;
  checked = true; revealed = false;
  grade = round.map(entry => ({ entry, correct: isCorrect(entry, answers[entry.id], direction(), studySet.entries) }));
  grade.forEach(({ entry, correct }) => {
    const row = document.querySelector(`[data-entry="${entry.id}"]`);
    row.classList.toggle('correct', correct); row.classList.toggle('incorrect', !correct);
    $(`answer-${entry.id}`).setAttribute('aria-invalid', String(!correct));
    $(`feedback-${entry.id}`).textContent = correct ? '✓ Correct' : answers[entry.id] ? 'Not quite — try this one again.' : 'Not answered yet.';
  });
  const count = grade.filter(item => item.correct).length;
  $('score').textContent = `${count} / ${round.length} correct`;
  $('score-note').textContent = count === round.length ? 'Every connection made. Ready for another round?' : `${round.length - count} to revisit. You can change your answers or retry just those terms.`;
  $('retry').hidden = count === round.length; $('reveal').hidden = count === round.length;
  $('reveal').disabled = false; $('reveal').textContent = 'Show answers';
  $('results').hidden = false;
  notice(`${count} of ${round.length} correct.`);
}

['direction', 'round-size'].forEach(id => $(id).addEventListener('change', () => { notice('Started a fresh round with your new settings.'); startRound(); }));
$('shuffle').addEventListener('click', () => { notice('New round shuffled.'); startRound(); });
$('new-round').addEventListener('click', () => { notice('New round ready.'); startRound(); $('study').scrollIntoView({ behavior: 'instant' }); });
$('check').addEventListener('click', checkAnswers);
$('retry').addEventListener('click', () => { if (!checked) return; const missed = grade.filter(item => !item.correct).map(item => item.entry); if (missed.length) { startRound(shuffle(missed)); notice(`Retrying ${missed.length} missed ${missed.length === 1 ? 'term' : 'terms'}.`); $('study').scrollIntoView({ behavior: 'instant' }); } });
$('reveal').addEventListener('click', () => { if (!checked || revealed) return; revealed = true; grade.filter(item => !item.correct).forEach(({ entry }) => { $(`feedback-${entry.id}`).textContent = `Answer: ${answerText(entry)}`; }); $('reveal').textContent = 'Answers shown'; $('reveal').disabled = true; });
loadSet();
