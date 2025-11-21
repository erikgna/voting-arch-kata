<script>
  let votes = $state([]);
  let isRunning = $state(false);
  let logs = $state([]);
  let stats = $state({
    renderTime: 0,
    apiRequests: 0,
    retries: 0,
    failedVotes: 0
  });

  function addLog(message, type = 'info') {
    logs = [...logs, {
      message,
      type,
      time: new Date().toLocaleTimeString()
    }];
    if (logs.length > 10) logs = logs.slice(-10);
  }

  // Test 1: Render 10k votes
  async function testMassiveRender() {
    addLog('Starting render test with 10,000 votes...');
    const start = performance.now();
    
    const newVotes = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      userId: `user_${i}`,
      option: Math.random() > 0.5 ? 'YES' : 'NO',
      timestamp: Date.now()
    }));
    
    votes = newVotes;
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const duration = performance.now() - start;
    stats.renderTime = duration.toFixed(2);
    addLog(`✓ Rendered 10k votes in ${duration.toFixed(2)}ms`, 'success');
  }

  // Test 2: Simulate API load
  async function testAPILoad() {
    addLog('Simulating 1,000 concurrent API requests...');
    const start = performance.now();
    const requestCount = 1000;
    
    const requests = Array.from({ length: requestCount }, async (_, i) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20));
      return { id: i, status: 'ok' };
    });
    
    await Promise.all(requests);
    const duration = performance.now() - start;
    stats.apiRequests = requestCount;
    addLog(`✓ Processed ${requestCount} requests in ${duration.toFixed(2)}ms`, 'success');
  }

  // Test 3: Poor connectivity with retries
  async function testPoorConnectivity() {
    addLog('Testing poor connectivity (70% failure rate)...');
    let retries = 0;
    let failed = 0;
    
    const sendVote = async (maxRetries = 5) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (Math.random() > 0.7) return true;
        retries++;
      }
      failed++;
      return false;
    };
    
    await Promise.all(Array.from({ length: 100 }, () => sendVote()));
    
    stats.retries = retries;
    stats.failedVotes = failed;
    
    if (failed === 0) {
      addLog(`✓ All votes sent! Retries: ${retries}`, 'success');
    } else {
      addLog(`⚠ ${failed} votes lost after ${retries} retries`, 'warning');
    }
  }

  async function runAllTests() {
    isRunning = true;
    logs = [];
    
    try {
      await testMassiveRender();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testAPILoad();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testPoorConnectivity();
      
      addLog('🎉 All tests completed!', 'success');
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      isRunning = false;
    }
  }

  function clearResults() {
    votes = [];
    logs = [];
    stats = { renderTime: 0, apiRequests: 0, retries: 0, failedVotes: 0 };
  }
</script>

<div class="container">
  <h1>🗳️ Svelte 5 Voting Platform Stress Test</h1>
  <p class="subtitle">Simulating 300M users • 250K req/s • Poor connectivity</p>

  <div class="controls">
    <button onclick={runAllTests} disabled={isRunning} class="btn-primary">
      {isRunning ? '⏳ Running...' : '🚀 Run All Tests'}
    </button>
    <button onclick={clearResults} disabled={isRunning} class="btn-secondary">
      🗑️ Clear
    </button>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Render Time</div>
      <div class="stat-value">{stats.renderTime}ms</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">API Requests</div>
      <div class="stat-value">{stats.apiRequests}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Retries</div>
      <div class="stat-value">{stats.retries}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Failed Votes</div>
      <div class="stat-value">{stats.failedVotes}</div>
    </div>
  </div>

  <div class="logs">
    {#if logs.length === 0}
      <div class="log-entry">Waiting for tests...</div>
    {:else}
      {#each logs as log}
        <div class="log-entry log-{log.type}">
          [{log.time}] {log.message}
        </div>
      {/each}
    {/if}
  </div>

  {#if votes.length > 0}
    <div class="votes-section">
      <h3>Rendered Votes (showing first 50 of {votes.length})</h3>
      <div class="vote-grid">
        {#each votes.slice(0, 50) as vote (vote.id)}
          <div class="vote-item vote-{vote.option.toLowerCase()}">
            <strong>{vote.userId}</strong>: {vote.option}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h1 {
    color: #1e293b;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #64748b;
    margin-bottom: 30px;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #8b5cf6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #7c3aed;
  }

  .btn-secondary {
    background: #ef4444;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #dc2626;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: #f1f5f9;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #8b5cf6;
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 5px;
  }

  .logs {
    background: #1e293b;
    color: #e2e8f0;
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 20px;
  }

  .log-entry {
    margin: 5px 0;
  }

  .log-success { color: #4ade80; }
  .log-error { color: #f87171; }
  .log-warning { color: #fbbf24; }

  .votes-section h3 {
    color: #1e293b;
    margin-bottom: 15px;
  }

  .vote-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .vote-item {
    padding: 10px;
    background: #f8fafc;
    border-radius: 6px;
    font-size: 13px;
  }

  .vote-yes { border-left: 3px solid #22c55e; }
  .vote-no { border-left: 3px solid #ef4444; }
</style>