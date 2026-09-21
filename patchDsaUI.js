const fs = require('fs');
const path = './frontend/src/pages/DSA.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add sync state
content = content.replace(
  "const [stats, setStats] = useState(null);",
  "const [stats, setStats] = useState(null);\n  const [isSyncing, setIsSyncing] = useState(false);\n  const [cfHandle, setCfHandle] = useState('');\n  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);"
);

// Add sync handler
const syncHandler = `
  const handleSync = async () => {
    if (!cfHandle) return;
    try {
      setIsSyncing(true);
      const res = await dsaApi.syncCodeforces(cfHandle);
      alert(res.data.message);
      setIsSyncModalOpen(false);
      await fetchStatsAndTopics();
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to sync Codeforces');
    } finally {
      setIsSyncing(false);
    }
  };
`;
content = content.replace(
  "const fetchStatsAndTopics = async () => {",
  syncHandler + "\n  const fetchStatsAndTopics = async () => {"
);

// Add button next to "Add Problem"
content = content.replace(
  /<Button\n\s*variant="primary"\n\s*onClick=\{.*?setIsModalOpen\(true\).*?\}\n\s*icon=\{<Plus size=\{16\} \/>\}\n\s*>\n\s*Add Problem\n\s*<\/Button>/g,
  `<div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsSyncModalOpen(true)} icon={<RefreshCw size={16} />}>
              Sync Codeforces
            </Button>
            <Button variant="primary" onClick={() => { setEditingProblem(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
              Add Problem
            </Button>
          </div>`
);

// Add empty state explanation text
content = content.replace(
  '<p className="text-secondary text-sm mb-6 text-center max-w-md">Record your first problem to start building your statistics, tracking your streaks, and unlocking developer intelligence.</p>',
  '<p className="text-secondary text-sm mb-6 text-center max-w-md">Record your first problem to start building your statistics, tracking your streaks, and unlocking developer intelligence.</p>\n<p className="text-xs text-secondary/70 text-center max-w-md mb-6">Automatic sync is available only for platforms with supported APIs (Codeforces). Manual entry is available for all platforms.</p>'
);

// Add Sync Modal inside return
const syncModal = `
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Sync Codeforces</h3>
              <button onClick={() => setIsSyncModalOpen(false)} className="text-secondary hover:text-primary">
                <FilterX size={20} />
              </button>
            </div>
            <p className="text-sm text-secondary mb-4">
              Enter your Codeforces handle to automatically import your solved problems. Other platforms do not provide public APIs and require manual entry.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Codeforces Handle</label>
                <Input 
                  placeholder="e.g. tourist" 
                  value={cfHandle} 
                  onChange={(e) => setCfHandle(e.target.value)} 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsSyncModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSync} isLoading={isSyncing}>Sync Data</Button>
              </div>
            </div>
          </div>
        </div>
      )}
`;
content = content.replace(
  "{/* Main Content */}",
  "{/* Main Content */}\n" + syncModal
);

fs.writeFileSync(path, content);
console.log('Patched DSA.jsx UI');
