import { useState } from "react";

function App() {
 // Temporary dummy task database matching our Prisma model fields exactly
const [tasks, setTasks] = useState([
  {
    id: 1,
    name: "Initialize Database Migrations",
    description: "Connect Prisma ORM schema block to a live server instance and provision tables.",
    dueDate: "2026-07-25",
    isCompleted: false,
  },
  {
    id: 2,
    name: "Design Layout Navigation",
    description: "Create responsive left panel menu control system using Tailwind structures.",
    dueDate: "2026-07-20",
    isCompleted: true,
  },
  {
    id: 3,
    name: "Write Unit Test Coverage",
    description: "Formulate 5 independent test parameters using Vitest assert utilities.",
    dueDate: "2026-08-01",
    isCompleted: false,
  }
]);
 
  // This state will track which navigation/filter tab is currently active
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      
      {/* LEFT SIDEBAR: Navigation & Filter Controls */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
        <div>
          {/* App Branding Title */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
              TaskManager
            </h1>
            <p className="text-xs text-gray-400 mt-1">Personal Workspace</p>
          </div>

          {/* Navigation/Filter Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📋 All Tasks
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "today"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📅 Due Today
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "completed"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ✅ Completed
            </button>
          </nav>
        </div>

        {/* User Workspace Profile Card Placeholder at Bottom */}
        <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
            ND
          </div>
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
            <h2 className="text-lg font-semibold capitalize text-gray-800">
              {activeTab} Tasks
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
              0
            </span>
          </div>

          {/* Action Trigger for Task Creation */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            + New Task
          </button>
        </header>

        {/* Dynamic Task Grid Work Area Container */}
        <div className="flex-1 overflow-y-auto p-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {tasks.map((task) => (
      <div 
        key={task.id} 
        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <div>
          {/* Card Header: Title & Completion Flag */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={`font-semibold text-base tracking-tight ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.name}
            </h3>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
              task.isCompleted ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {task.isCompleted ? 'Done' : 'Pending'}
            </span>
          </div>

          {/* Description Text */}
          <p className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Card Footer: Metadata & Action Triggers */}
        <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>📅</span>
            <span className="font-medium text-gray-500">{task.dueDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-indigo-600 hover:text-indigo-800 font-semibold p-1">
              Edit
            </button>
            <button className="text-red-500 hover:text-red-700 font-semibold p-1">
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </main>

    </div>
  );
}

export default App;

