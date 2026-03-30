/**
 * AI Productivity Hub — Interactive Tools
 * Pomodoro Timer, Task Priority Matrix, Study Planner
 * Enhanced with GA4 tool completion & deep engagement tracking
 */
(function() {
  'use strict';

  // ═════════════════════════════════════════
  // POMODORO TIMER
  // ═════════════════════════════════════════
  var pomodoroInterval = null;
  var pomodoroTime = 25 * 60;
  var pomodoroTotal = 25 * 60;
  var pomodoroRunning = false;
  var pomodoroSessionCount = parseInt(localStorage.getItem('aph_pomodoro_sessions') || '0');
  var pomodoroTotalMinutes = parseInt(localStorage.getItem('aph_pomodoro_minutes') || '0');

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
    if(btn) { btn.textContent = '⏸ Pause'; btn.onclick = window.pomodoroPause; }
    pomodoroInterval = setInterval(function() {
      pomodoroTime--;
      updatePomodoroDisplay();
      if(pomodoroTime <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroRunning = false;

        // Track session completion
        pomodoroSessionCount++;
        pomodoroTotalMinutes += 25;
        localStorage.setItem('aph_pomodoro_sessions', pomodoroSessionCount);
        localStorage.setItem('aph_pomodoro_minutes', pomodoroTotalMinutes);

        if(window.Analytics) {
          Analytics.trackToolUsed('pomodoro', 'complete');
          // Fire deep engagement conversion event
          Analytics.trackToolCompletion('pomodoro', {
            session_number: pomodoroSessionCount,
            total_focus_minutes: pomodoroTotalMinutes,
            session_duration: 25
          });
        }

        showToast('🎉 Pomodoro #' + pomodoroSessionCount + ' complete! Total: ' + pomodoroTotalMinutes + ' min focused');
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

  // ═════════════════════════════════════════
  // PRIORITY MATRIX
  // ═════════════════════════════════════════
  var matrixTaskCounts = { ui: 0, ni: 0, un: 0, nn: 0 };

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
    div.innerHTML = '<span>' + task + '</span><span class="delete-task" onclick="removeMatrixTask(this, \'' + quadrant + '\')">&times;</span>';
    container.appendChild(div);
    input.value = '';

    // Track
    matrixTaskCounts[quadrant]++;
    var totalTasks = Object.values(matrixTaskCounts).reduce(function(a,b){return a+b;}, 0);
    if(window.Analytics) {
      Analytics.trackToolUsed('priority_matrix', 'add_task');
      // Fire completion event at milestones (5, 10, 20 tasks)
      if(totalTasks === 5 || totalTasks === 10 || totalTasks === 20) {
        Analytics.trackToolCompletion('priority_matrix', {
          total_tasks: totalTasks,
          urgent_important: matrixTaskCounts.ui,
          not_urgent_important: matrixTaskCounts.ni,
          urgent_not_important: matrixTaskCounts.un,
          not_urgent_not_important: matrixTaskCounts.nn
        });
      }
    }
  };

  window.removeMatrixTask = function(el, quadrant) {
    el.parentElement.remove();
    if(matrixTaskCounts[quadrant] > 0) matrixTaskCounts[quadrant]--;
    if(window.Analytics) Analytics.trackToolUsed('priority_matrix', 'remove_task');
  };

  // ═════════════════════════════════════════
  // STUDY PLANNER
  // ═════════════════════════════════════════
  var plannerActiveCount = 0;

  window.togglePlannerCell = function(cell) {
    cell.classList.toggle('active');
    if(cell.classList.contains('active')) {
      plannerActiveCount++;
      if(!cell.querySelector('.planner-block')) {
        var block = document.createElement('div');
        block.className = 'planner-block';
        block.textContent = 'Study';
        cell.appendChild(block);
      }
    } else {
      plannerActiveCount--;
      var b = cell.querySelector('.planner-block');
      if(b) b.remove();
    }

    if(window.Analytics) {
      Analytics.trackToolUsed('study_planner', cell.classList.contains('active') ? 'add_block' : 'remove_block');
      // Fire completion at milestones (5, 10, 20 blocks)
      if(plannerActiveCount === 5 || plannerActiveCount === 10 || plannerActiveCount === 20) {
        Analytics.trackToolCompletion('study_planner', {
          total_blocks: plannerActiveCount,
          estimated_hours: plannerActiveCount
        });
      }
    }
  };

  // ═════════════════════════════════════════
  // INIT
  // ═════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', function() {
    updatePomodoroDisplay();

    // Enter key for matrix input
    var mi = document.getElementById('matrixInput');
    if(mi) mi.addEventListener('keydown', function(e) { if(e.key==='Enter') addMatrixTask(); });

    // Planner cell clicks
    document.querySelectorAll('.planner-cell').forEach(function(cell) {
      cell.addEventListener('click', function() { togglePlannerCell(this); });
    });

    // Show session count if returning user
    if(pomodoroSessionCount > 0) {
      var display = document.getElementById('pomodoroTime');
      if(display) {
        display.title = 'Sessions completed: ' + pomodoroSessionCount + ' | Total focus: ' + pomodoroTotalMinutes + ' min';
      }
    }
  });
})();
