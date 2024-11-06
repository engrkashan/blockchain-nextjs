"use client";
import { useState, useEffect } from "react";
import cogoToast from "@successtar/cogo-toast";
import { useDispatch, useSelector } from "react-redux";
import { calculateSwapRate } from "@/redux/slices/swapSlice";
import { fetchPriceHistory } from "@/redux/slices/historySlice";
import { setPriceAlert } from "@/redux/slices/alertSlice";

export default function Home() {
  const dispatch = useDispatch();
  const {
    rate: swapRate,
    loading: swapLoading,
    error: swapError,
  } = useSelector((state) => state.swap);
  const {
    alerts,
    loading: alertLoading,
    error: alertError,
  } = useSelector((state) => state.alert);
  const {
    history: priceHistory,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.history);

  const [alertData, setAlertData] = useState({
    chain: "Ethereum",
    targetPrice: "",
    email: "",
  });

  const [ethAmount, setEthAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    dispatch(fetchPriceHistory());
  }, [dispatch]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSetAlert = () => {
    if (!validateEmail(alertData.email)) {
      setEmailError("Invalid email format");
      return;
    }
    dispatch(setPriceAlert(alertData))
      .unwrap()
      .then(() => {
        cogoToast.success("Alert set successfully!", { hideAfter: 3 });
        setEmailError("");
      })
      .catch((error) =>
        cogoToast.error(`Error: ${error.message}`, { hideAfter: 3 })
      );
  };

  const handleSwapRate = () => {
    dispatch(calculateSwapRate({ ethAmount: Number(ethAmount) }))
      .unwrap()
      .then(() =>
        cogoToast.success("Swap rate calculated successfully!", {
          hideAfter: 3,
        })
      )
      .catch((error) =>
        cogoToast.error(`Error: ${error.message}`, { hideAfter: 3 })
      );
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = priceHistory?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil((priceHistory?.length || 0) / rowsPerPage);

  // Check if the Set Alert button should be disabled
  const isSetAlertDisabled =
    !alertData.targetPrice ||
    !alertData.email ||
    !validateEmail(alertData.email);

  // Check if the Get Swap Rate button should be disabled
  const isGetSwapRateDisabled = !ethAmount;

  return (
    <div className="min-h-screen p-8 pb-20">
      <main className="container mx-auto bg-white p-8 shadow-lg rounded-lg flex gap-8 items-start">
        {/* Right section (table) */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-start mb-6">
            Blockchain Price Monitoring
          </h1>
          <section>
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            {historyLoading ? (
              <p>Loading Price History...</p>
            ) : historyError ? (
              <p className="text-red-500">Error: {historyError}</p>
            ) : (
              <div>
                {currentRows && currentRows.length > 0 ? (
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b">Date</th>
                        <th className="px-4 py-2 border-b">Chain</th>
                        <th className="px-4 py-2 border-b">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-4 py-2 border-b">
                            {new Date(entry.createdAt).toLocaleString()}
                          </td>

                          <td className="px-4 py-2 border-b">{entry.chain}</td>
                          <td className="px-4 py-2 border-b">${entry.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No price history available.</p>
                )}

                <div className="flex justify-between items-center mt-6 space-x-4">
                  <button
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page{" "}
                    <span className="font-semibold text-blue-600">
                      {currentPage}
                    </span>{" "}
                    of {totalPages}
                  </span>
                  <button
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        {/* Left section */}
        <div className="flex flex-col flex-1 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Set Price Alert</h2>
            <div className="flex gap-4 mb-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Ethereum"
                    checked={alertData.chain === "Ethereum"}
                    onChange={(e) =>
                      setAlertData({ ...alertData, chain: e.target.value })
                    }
                    className="mr-2"
                  />
                  Ethereum
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Polygon"
                    checked={alertData.chain === "Polygon"}
                    onChange={(e) =>
                      setAlertData({ ...alertData, chain: e.target.value })
                    }
                    className="mr-2"
                  />
                  Polygon
                </label>
              </div>
              <input
                type="number"
                placeholder="Target Price"
                className="border p-2 flex-1 rounded"
                value={alertData.targetPrice}
                onChange={(e) =>
                  setAlertData({
                    ...alertData,
                    targetPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 flex-1 rounded"
                value={alertData.email}
                onChange={(e) => {
                  setAlertData({ ...alertData, email: e.target.value });
                  setEmailError(
                    validateEmail(e.target.value) ? "" : "Invalid email format"
                  );
                }}
              />
            </div>
            {emailError && <p className="text-red-500">{emailError}</p>}
            <button
              className={`bg-green-500 text-white px-6 py-2 rounded w-full ${
                isSetAlertDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleSetAlert}
              disabled={isSetAlertDisabled || alertLoading}
            >
              {alertLoading ? "Setting Alert..." : "Set Alert"}
            </button>
            {alertError && (
              <p className="text-red-500 mt-2">Error: {alertError}</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Get Swap Rate</h2>
            <div className="flex gap-4 mb-2">
              <input
                type="number"
                placeholder="ETH Amount"
                className="border p-2 flex-1 rounded"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
              />
            </div>
            <button
              className={`bg-purple-500 text-white px-6 py-2 rounded w-full ${
                isGetSwapRateDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleSwapRate}
              disabled={isGetSwapRateDisabled || swapLoading}
            >
              {swapLoading ? "Calculating..." : "Get Swap Rate"}
            </button>
            {swapRate && (
              <div className="mt-4">
                <h3 className="font-semibold">Swap Rate:</h3>
                <p>BTC Equivalent: {swapRate.btcEquivalent}</p>
                <p>ETH Fee: {swapRate.ethFee}</p>
                <p>Dollar Fee: {swapRate.dollarFee}</p>
              </div>
            )}
            {swapError && (
              <p className="text-red-500 mt-2">Error: {swapError}</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
