import { useState, useEffect } from "react";
import api from "@/utils/axios"; // Sesuaikan dengan path axios-mu
import Card from "react-bootstrap/Card";

const KPIReportTable = () => {
  const [selectedProject, setSelectedProject] = useState(""); // Simpan projectId
  const [selectedUser, setSelectedUser] = useState(""); // Simpan userId
  const [projects, setProjects] = useState([]); // Data project dropdown
  const [users, setUsers] = useState([]); // Data user dropdown
  const [reportData, setReportData] = useState([]); // Data KPI Report
  const [totalSkor, setTotalSkor] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/projects");
        setProjects(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data project:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `http://localhost:3000/api/v1/project/project-collaborators/${selectedProject}`
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUsers();
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedUser || !selectedProject) return;

    const fetchReport = async () => {
      try {
        const response = await api.post(
          "http://localhost:3000/api/v1/kpi-reports",
          { userId: selectedUser, projectId: selectedProject }
        );
        setReportData(response.data.data.reportData);
        setTotalSkor(response.data.data.totalSkor);
      } catch (error) {
        console.error("Gagal mengambil data KPI Report:", error);
      }
    };
    fetchReport();
  }, [selectedUser, selectedProject]);

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <h2 className="text-xl font-semibold mr-3">Laporan KPI</h2>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 rounded-lg bg-primer text-white min-w-[200px]"
        >
          <option value="">Pilih Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.projectName}
            </option>
          ))}
        </select>

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-4 py-2 rounded-lg border border-primer bg-transparent text-primer min-w-[200px]"
        >
          <option value="">Pilih User</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "12px" }}>
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Metrik</th>
              <th className="px-4 py-3 text-left text-primer">Bobot</th>
              <th className="px-4 py-3 text-left text-primer">Target</th>
              <th className="px-4 py-3 text-left text-primer">Skor Aktual</th>
              <th className="px-4 py-3 text-left text-primer">Skor Akhir</th>
              <th className="px-4 py-3 text-left text-primer">Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row) => (
                <tr key={row.metricId} className="border-b">
                  <td className="px-4 py-3">{row.metricName}</td>
                  <td className="px-4 py-3">{row.bobot}</td>
                  <td className="px-4 py-3">{row.target}</td>
                  <td className="px-4 py-3">{row.skorAktual}</td>
                  <td className="px-4 py-3">{row.skorAkhir}</td>
                  <td
                    className={`px-4 py-3 ${
                      row.status === "Achieved"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  {selectedUser && selectedProject
                    ? "Tidak ada data KPI untuk user ini."
                    : "Silakan pilih project dan user terlebih dahulu."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <Card
          style={{
            backgroundColor: "#7E0EFF",
            color: "white",
            width: "68rem",
            marginTop: "25px",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <Card.Body>
            <h2>Skor KPI Total adalah : {totalSkor} </h2>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default KPIReportTable;
