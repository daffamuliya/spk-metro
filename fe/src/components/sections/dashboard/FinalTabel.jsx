import { useState, useEffect } from "react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const FinalTabel = () => {
  const [kpiList, setKpiList] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [siRiData, setSiRiData] = useState([]);
  const [vikorResult, setVikorResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [normRes, siRiRes, vikorRes] = await Promise.all([
          api.get("http://localhost:3000/api/normalized-matrix"),
          api.get("http://localhost:3000/api/si-ri"),
          api.get("http://localhost:3000/api/vikor-result"),
        ]);

        setNormalizedData(normRes.data.data);
        setSiRiData(siRiRes.data.data);
        setVikorResult(vikorRes.data.data);
      } catch (err) {
        console.error("Gagal memuat data SPK:", err);
        setError("Gagal mengambil data SPK");
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat mengambil data SPK.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch KPI Metrics
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/v1/metrics");
        setKpiList(response.data.data);
      } catch (error) {
        console.error("Gagal memuat KPI:", error);
      }
    };

    fetchKPI();
  }, []);

  // ✅ Fetch data KPI Report dari API
  const fetchKPIReport = async () => {
    try {
      const response = await api.get(
        "http://localhost:3000/api/v1/kpi-reports"
      );
      setReportData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data KPI Report:", error);
      setError("Gagal mengambil data");
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data KPI Report.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIReport();
  }, []);

  const renderMetricTable = (data) => (
    <table className="w-full" style={{ fontSize: "12px" }}>
      <thead>
        <tr className="bg-purple-50">
          <th className="px-4 py-3 text-left text-primer">Nama Member</th>
          {kpiList.map((kpi) => (
            <th key={kpi.id} className="px-4 py-3 text-left text-primer">
              {kpi.kpiName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3">{row.fullName}</td>
              {row.values.map((value, idx) => (
                <td
                  key={idx}
                  className="px-4 py-3"
                  style={{ textAlign: "center" }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              Tidak ada data.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "12px" }}>
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Nama Member</th>
              <th className="px-4 py-3 text-left text-primer">Qi</th>
              <th className="px-4 py-3 text-left text-primer">Rank</th>
            </tr>
          </thead>
          <tbody>
            {vikorResult.length > 0 ? (
              vikorResult.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">{row.fullName}</td>
                  <td className="px-4 py-3 text-left">{row.Qi}</td>
                  <td className="px-4 py-3 text-left">{row.rank}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalTabel;
