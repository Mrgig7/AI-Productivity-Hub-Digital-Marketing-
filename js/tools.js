/**
 * AI Productivity Hub — Interactive Tools
 * Pomodoro Timer, Task Priority Matrix, Study Planner
 */
(function() {
  'use strict';

  // ===== POMODORO TIMER =====
  var pomodoroInterval = null;
  var pomodoroTime = 25 * 60; // 25 minutes in seconds
  var pomodoroTotal = 25 * 60;
  var pomodoroRunning = false;

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updatePomodoroDisplay() {
    var display = document.getElementById('pomodoroTime');
    var progress = document.getElementById('pomodoroProgress');
    if(display) display.textContent = formatTime(pomodoroTime);
    if(progress) {
      var pct = ((pomodoroTotal - pomodoroTime) / pomodoroTotal) * 100;
      progress.style.setProperty('--progress', pct + '%');
    }
  }

  window.pomodoroStart = function() {
    if(pomodoroRunning) return;
    pomodoroRunning = true;
    if(window.Analytics) Analytics.trackToolUsed('pomodoro', 'start');
    var btn = document.getElementById('pomStartBtn');
    if(btn) btn.textContent = '⏸ Pause';
    btn.onclick = window.pomodoroPause;
    pomodoroInterval = setInterval(function() {
      pomodoroTime--;
      updatePomodoroDisplay();
      if(pomodoroTime <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroRunning = false;
        if(window.Analytics) Analytics.trackToolUsed('pomodoro', 'complete');
        showToast('Pomodoro complete! Take a break 🎉');
        pomodoroReset();
      }
    }, 1000);
  };

  window.pomodoroPause = function() {
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    if(window.Analytics) Analytics.trackToolUsed('pomodoro', 'pause');
    var btn = document.getElementById('pomStartBtn');
    if(btn) { btn.textContent = '▶ Resume'; btn.onclick = window.pomodoroStart; }
  };

  window.pomodoroReset = function() {
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    pomodoroTime = pomodoroTotal;
    updatePomodoroDisplay();
    if(window.Analytics) Analytics.trackToolUsed('pomodoro', 'reset');
    var btn = document.getElementById('pomStartBtn');
    if(btn) { btn.textContent = '▶ Start'; btn.onclick = window.pomodoroStart; }
  };

  // ===== PRIORITY MATRIX =====
  window.addMatrixTask = function() {
    var input = document.getElementById('matrixInput');
    var select = document.getElementById('matrixQuadrant');
    if(!input || !select || !input.value.trim()) return;
    var task = input.value.trim();
    var quadrant = select.value;
    var container = document.getElementById('quadrant-' + quadrant);
    if(!container) return;

    var div = document.createElement('div');
    div.className = 'matrix-task';
    div.innerHTML = '<span>' + task + '</span><span class="delete-task" onclick="this.parentElement.remove()">&times;</span>';
    container.appendChild(div);
    input.value = '';

    if(window.Analytics) Analytics.trackToolUsed('priority_matrix', 'add_task');
  };

  // ===== STUDY PLANNER =====
  window.togglePlannerCell = function(cell) {
    cell.classList.toggle('active');
    if(cell.classList.contains('active')) {
      if(!cell.querySelector('.planner-block')) {
        var block = document.createElement('div');
        block.className = 'planner-block';
        block.textContent = 'Study';
        cell.appendChild(block);
      }
    } else {
      var b = cell.querySelector('.planner-block');
      if(b) b.remove();
    }
    if(window.Analytics) Analytics.trackToolUsed('study_planner', cell.classList.contains('active') ? 'add_block' : 'remove_block');
  };

  // Init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    updatePomodoroDisplay();

    // Enter key for matrix input
    var mi = document.getElementById('matrixInput');
    if(mi) mi.addEventListener('keydown', function(e) { if(e.key==='Enter') addMatrixTask(); });

    // Planner cell clicks
    document.querySelectorAll('.planner-cell').forEach(function(cell) {
      cell.addEventListener('click', function() { togglePlannerCell(this); });
    });
  });
})();
