import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import api from "@/utils/axios";
import Swal from "sweetalert2";

const TableKPI = () => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => setShowModal(!showModal);
  const [data, setData] = useState([]);

  const [kodeKpi, setkodeKPI] = useState("");
  const [kpiName, setkpiName] = useState("");
  const [target, settarget] = useState("");
  const [bobot, setBobot] = useState("");
  const [char, setChar] = useState("");
  const [divisionId] = useState("e0b4374f-3403-4e5d-97af-398e0cec468d");

  const fetchData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/metrics");
      setData(response.data.data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus KPI ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`http://localhost:3000/api/v1/metrics/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "KPI berhasil dihapus.",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchData();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus KPI.",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("http://localhost:3000/api/v1/metrics", {
        kodeKpi,
        kpiName,
        target: parseFloat(target),
        bobot: parseFloat(bobot),
        char,
        divisionId,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "KPI berhasil ditambahkan!",
        });
        fetchData();
        handleModal();
        setkodeKPI("");
        setkpiName("");
        settarget("");
        setBobot("");
        setChar("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menambah KPI",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6 ">
        <h2 className="text-xl font-semibold mr-3">Divisi Developer</h2>
        <button
          onClick={handleModal}
          className="px-4 py-2 rounded-lg bg-primer text-white  ml-auto"
        >
          + Tambah KPI
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="px-4 py-3 text-left text-primer">Kode KPI</th>
              <th className="px-4 py-3 text-left text-primer">Nama KPI </th>
              <th className="px-4 py-3 text-left text-primer">Karakteristik</th>
              <th className="px-4 py-3 text-left text-primer">Bobot</th>
              <th className="px-4 py-3 text-left text-primer">Target</th>
              <th className="px-4 py-3 text-left text-primer">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.kodeKpi}</td>
                <td className="px-4 py-3">{row.kpiName}</td>
                <td className="px-4 py-3">{row.char}</td>
                <td className="px-4 py-3">{row.bobot}</td>
                <td className="px-4 py-3">{row.target}%</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-4">
                    <button className="p-1 hover:text-yellow-500">
                      <Edit className="w-5 h-5 text-yellow-400" />
                    </button>
                    <button
                      className="p-1 hover:text-red-600"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Proyek</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Kode KPI*
                </label>
                <input
                  type="text"
                  value={kodeKpi}
                  onChange={(e) => setkodeKPI(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Nama KPI*
                </label>
                <input
                  type="text"
                  value={kpiName}
                  onChange={(e) => setkpiName(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Karakteristik*
                </label>
                <input
                  type="text"
                  value={char}
                  onChange={(e) => setChar(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Bobot*</label>
                <input
                  type="number"
                  value={bobot}
                  onChange={(e) => setBobot(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Target*
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => settarget(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300"
                  onClick={handleModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primer text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableKPI;
