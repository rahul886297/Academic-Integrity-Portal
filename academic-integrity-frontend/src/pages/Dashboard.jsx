import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiUser, FiUploadCloud } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard");
        setUserInfo(res.data.user);
      } catch (err) {
        console.error("failed to fetch protected data", err);
      }
    };
    fetchData();
  }, []);

  const role = userInfo?.role || "student";

  // Mock data for graphs
  const chartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Maths Performance',
        data: [65, 59, 80, 81],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Statistics Performance',
        data: [70, 62, 20, 15],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Subject Consistency Over Time' },
    },
  };

  // ---------------- TEACHER DASHBOARD ----------------
  if (role === "teacher" || role === "admin") {
    return (
      <Layout>
        <div style={styles.grid}>
          <div style={styles.rightCol}>
            <div style={{...styles.card, marginBottom: "20px"}}>
              <h2 style={{margin: "0 0 10px 0"}}>Faculty Portal</h2>
              <p style={{color: "#666"}}>Welcome back, Prof. {userInfo?.name}. Monitor student performance anomalies below.</p>
              <div style={{ marginTop: "15px" }}>
                 <Link to="/data-entry" style={{...styles.primaryAlertBtn, textDecoration: "none"}}>
                   <FiUploadCloud /> Upload New Marks
                 </Link>
              </div>
            </div>

            <div style={styles.metricsRow}>
               <div style={styles.metricCard}>
                 <div style={styles.metricIconBgRed}>
                   <FiAlertTriangle size={28} color="#d7285c" />
                 </div>
                 <div style={styles.metricInfo}>
                   <div style={styles.metricValue}>12</div>
                   <div style={styles.metricLabel}>At-Risk Students</div>
                 </div>
               </div>
               
               <div style={styles.metricCard}>
                 <div style={styles.metricIconBgOrange}>
                   <FiTrendingUp size={28} color="#f6a117" />
                 </div>
                 <div style={styles.metricInfo}>
                   <div style={styles.metricValue}>3</div>
                   <div style={styles.metricLabel}>Recent Anomalies</div>
                 </div>
               </div>
            </div>

            <div style={{...styles.card, marginTop: "20px"}}>
              <h3 style={styles.panelTitle}>At-Risk Student Alerts</h3>
              <table style={{width: "100%", borderCollapse: "collapse"}}>
                <thead>
                  <tr style={{textAlign: "left", borderBottom: "1px solid #eee"}}>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th}>Consistency</th>
                    <th style={styles.th}>Flag Reason</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.td}>
                    <td>Rishav (MCA)</td>
                    <td><span style={{color: "#d7285c", fontWeight: "bold"}}>30/100</span></td>
                    <td>Severe Drop: Scored 40% lower than historical inside Math.</td>
                    <td><button style={styles.secondaryBtn}>Review Case</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ---------------- STUDENT DASHBOARD ----------------
  return (
    <Layout>
      <div style={styles.grid}>
        
        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <div style={styles.profileHeader}>
               <div style={styles.avatar}>
                 <FiUser size={60} color="#999" />
               </div>
               <h3 style={styles.name}>{userInfo ? userInfo.name : "Student Name"}</h3>
               <p style={styles.studentId}>Role: {role.toUpperCase()}</p>
               <div style={styles.statusBadge}>ACTIVE</div>
               <p style={styles.program}>Technology and AI Sciences</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>
           {/* TOP METRICS */}
           <div style={styles.metricsRow}>
             <div style={styles.metricCard}>
               <div style={styles.metricIconBgBlue}>
                 <FiCheckCircle size={28} color="#0465a3" />
               </div>
               <div style={styles.metricInfo}>
                 <div style={styles.metricValue}>75/100</div>
                 <div style={styles.metricLabel}>Consistency Score</div>
               </div>
             </div>
             
             <div style={styles.metricCard}>
               <div style={styles.metricIconBgOrange}>
                 <FiAlertTriangle size={28} color="#f6a117" />
               </div>
               <div style={styles.metricInfo}>
                 <div style={styles.metricValue}>1</div>
                 <div style={styles.metricLabel}>Academic Warnings</div>
               </div>
             </div>
           </div>

           {/* PANELS */}
           <div style={styles.panelsRow}>
              {/* GRAPH PANEL */}
              <div style={styles.panelLeft}>
                <div style={{...styles.card, height: "400px"}}>
                  <h3 style={styles.panelTitle}>Performance Trends</h3>
                  <div style={{ height: "300px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* INSIGHTS PANEL */}
              <div style={styles.panelRight}>
                <div style={{...styles.card, height: "400px"}}>
                  <h3 style={styles.panelTitle}>AI Insights & Warnings</h3>
                  
                  <div style={{ padding: "15px", background: "#fbe9ed", borderLeft: "4px solid #d7285c", borderRadius: "4px", marginBottom: "15px" }}>
                    <h4 style={{margin: "0 0 5px 0", color: "#d7285c"}}>Warning: Inconsistent Pattern</h4>
                    <p style={{margin: 0, fontSize: "13px", color: "#333"}}>Your performance in <strong>Statistics</strong> has dropped catastrophically relative to your high marks in <strong>Maths</strong>. This triggers an illogical pattern alert. Please contact your coordinator.</p>
                  </div>

                  <div style={{ padding: "15px", background: "#f9f9f9", borderRadius: "4px" }}>
                    <h4 style={{margin: "0 0 5px 0", color: "#0465a3"}}>Improvement Area</h4>
                    <p style={{margin: 0, fontSize: "13px", color: "#666"}}>Focus on foundational statistical theories. Your overall trend indicates strong logic (Maths) but poor application.</p>
                  </div>

                </div>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  grid: { display: "flex", gap: "20px", width: "100%", maxWidth: "1400px", margin: "0 auto" },
  leftCol: { width: "280px", flexShrink: 0 },
  rightCol: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  profileHeader: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "10px 0" },
  avatar: { width: "120px", height: "120px", borderRadius: "50%", background: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px", border: "4px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  name: { margin: "0 0 5px 0", fontSize: "18px", color: "var(--upes-blue)", fontWeight: "700" },
  studentId: { margin: "0 0 10px 0", fontSize: "13px", color: "#555", fontWeight: "500" },
  statusBadge: { background: "#0a8a0a", color: "#fff", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", letterSpacing: "0.5px", marginBottom: "15px" },
  program: { margin: "0 0 5px 0", fontSize: "14px", color: "#555" },
  metricsRow: { display: "flex", gap: "20px" },
  metricCard: { flex: 1, background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "20px" },
  metricIconBgBlue: { width: "70px", height: "70px", borderRadius: "8px", background: "#e6f2f9", display: "flex", justifyContent: "center", alignItems: "center" },
  metricIconBgOrange: { width: "70px", height: "70px", borderRadius: "8px", background: "#fef5e7", display: "flex", justifyContent: "center", alignItems: "center" },
  metricIconBgRed: { width: "70px", height: "70px", borderRadius: "8px", background: "#fbe9ed", display: "flex", justifyContent: "center", alignItems: "center" },
  metricInfo: { display: "flex", flexDirection: "column" },
  metricValue: { fontSize: "28px", fontWeight: "700", color: "#333", lineHeight: "1.2" },
  metricLabel: { fontSize: "13px", color: "#888", fontWeight: "500" },
  panelsRow: { display: "flex", gap: "20px", flex: 1 },
  panelLeft: { flex: 6 },
  panelRight: { flex: 4 },
  panelTitle: { margin: "0 0 15px 0", fontSize: "16px", fontWeight: "700", color: "#333" },
  primaryAlertBtn: { display: "inline-flex", gap: "8px", alignItems: "center", padding: "12px 20px", background: "var(--upes-blue)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  secondaryBtn: { padding: "8px 12px", background: "#f4f4f4", color: "#333", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  th: { padding: "10px", color: "#666", fontSize: "13px", textTransform: "uppercase" },
  td: { padding: "15px 10px", fontSize: "14px", color: "#333", borderBottom: "1px solid #f4f4f4" }
};

export default Dashboard;