import { useState, useEffect } from "react";

function App() {
  // Initialize tasks as a clean empty array waiting for database connection records
  const [tasks, setTasks] = useState([]);

  // This state tracks which navigation/filter tab is currently active
  const [activeTab, setActiveTab] = useState("all");

  // Controls whether the popup modal window is open (true) or closed (false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tracks individual form inputs as the user types
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  // Function to capture input state values and add a new task card
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskName || !taskDueDate) return;

    const newTask = {
      id: Date.now(), 
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);

    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
    setIsModalOpen(false);
  };

  // Automatically calls your backend API to fetch live tasks when the app boots up
  useEffect(() => {
    const fetchDatabaseTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("❌ Failed to communicate with the database api:", error);
      }
    };
    fetchDatabaseTasks();
  }, []); 

  // Filter the tasks array based on the activeTab selection (Protected against empty arrays)
  const filteredTasks = (tasks || []).filter((task) => {
    if (activeTab === "completed") {
      return task.isCompleted === true;
    }
    if (activeTab === "today") {
      const todayStr = new Date().toISOString().split('T')[0];
      return task.dueDate?.split('T')[0] === todayStr && !task.isCompleted;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      
      {/* LEFT SIDEBAR: Navigation & Filter Controls */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          <div className="mb-8">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">TaskManager</h1>
            <p className="text-xs text-gray-400 mt-1">Personal Workspace</p>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("all")} 
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "all" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50" }`} 
            >
              📋 All Tasks
            </button>
            <button 
              onClick={() => setActiveTab("today")} 
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "today" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50" }`} 
            >
              📅 Due Today
            </button>
            <button 
              onClick={() => setActiveTab("completed")} 
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "completed" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50" }`} 
            >
              ✅ Completed
            </button>
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">ND</div>
          <div>
            <p className="text-xs font-semibold text-gray-700">Niv Design</p>
            <p className="text-[10px] text-gray-400">Developer Account</p>
          </div>
        </div>
      </aside>
            {/* RIGHT MAIN WINDOW: Displays active tasks grid */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar inside Main Window */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold capitalize text-gray-800">{activeTab} Tasks</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              {filteredTasks.length}
            </span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            + New Task
          </button>
        </header>

        {/* Dynamic Task Grid Work Area Container */}
        <div className="flex-1 overflow-y-auto p-8">
          {filteredTasks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <span className="text-3xl mb-2">📋</span>
              <p className="text-sm font-medium text-gray-600">No tasks found here.</p>
              <p className="text-xs mt-1 text-gray-400">Click "+ New Task" above to add your first record to the database!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`font-semibold text-base tracking-tight ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.name}</h3>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${ task.isCompleted ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-amber-50 text-amber-600 border border-amber-200' }`}>
                        {task.isCompleted ? 'Done' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">{task.description || "No description provided."}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span>📅</span>
                      <span className="font-medium text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold p-1"> Edit </button>
                      <button className="text-red-500 hover:text-red-700 font-semibold p-1"> Delete </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POPUP MODAL OVERLAY */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4 border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">Create New Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-semibold p-1">✕</button>
              </div>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Task Name *</label>
                  <input type="text" required value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g., Connect API Endpoints" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Add brief task summary details..." rows="3" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date *</label>
                  <input type="date" required value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">Save Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;

