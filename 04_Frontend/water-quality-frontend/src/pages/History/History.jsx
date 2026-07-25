import { useEffect, useState, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import HistoryStats from "../../components/history/HistoryStats";
import HistoryTable from "../../components/history/HistoryTable";
import SkeletonTable from "../../components/common/SkeletonTable";
import ErrorState from "../../components/common/ErrorState";
import { getAllHistory } from "../../services/historyService";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllHistory();
      setHistoryData(data || []);
    } catch (err) {
      console.error("Failed to load prediction history", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHistory]);

  if (error) {
    return (
      <PageWrapper>
        <ErrorState onRetry={fetchHistory} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Cards summary panels */}
      <HistoryStats history={historyData} />

      {/* Table grid */}
      {loading ? (
        <SkeletonTable rows={8} cols={10} />
      ) : (
        <HistoryTable
          history={historyData}
          onRefresh={fetchHistory}
          loading={loading}
        />
      )}
    </PageWrapper>
  );
};

export default History;
