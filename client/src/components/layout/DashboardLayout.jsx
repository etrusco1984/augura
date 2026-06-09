import "../../index.css";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ title = "Dashboard", children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard-container">

            {/* SIDEBAR */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">

                {/* HEADER */}
                <header className="dashboard-header">

                    {/* MOBILE HAMBURGER BUTTON */}
                    <button
                        className="hamburger-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>

                    <h1>{title}</h1>
                </header>

                {/* CONTENT WRAPPER */}
                <div className="dashboard-content-wrapper">
                    <section className="dashboard-content">
                        {children}
                    </section>
                </div>
            </main>
        </div>
    );
}
