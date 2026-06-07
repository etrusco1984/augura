import "../../index.css";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ title = "Dashboard", children }) {
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <div className="dashboard-content-wrapper">
                    {/* Header */}
                    <header className="dashboard-header">
                        <h1>{title}</h1>
                    </header>

                    {/* Content */}
                    <section className="dashboard-content">
                        {children}
                    </section>
                </div>
            </main>
        </div>
    );
}
