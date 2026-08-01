import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom React hook to subscribe to real-time sensor_data and prediction_history updates from Supabase.
 */
export const useSupabaseRealtime = (onNewTelemetry) => {
  const [latestData, setLatestData] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);

  useEffect(() => {
    // 1. Subscribe to real-time inserts on sensor_data table
    const sensorChannel = supabase
      .channel('public:sensor_data')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_data' },
        (payload) => {
          console.log('⚡ Realtime Sensor Data Received:', payload.new);
          setLatestData(payload.new);
          if (onNewTelemetry) onNewTelemetry(payload.new);
        }
      )
      .subscribe();

    // 2. Subscribe to real-time inserts on prediction_history table
    const predictionChannel = supabase
      .channel('public:prediction_history')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prediction_history' },
        (payload) => {
          console.log('⚡ Realtime Prediction Received:', payload.new);
          setLatestPrediction(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sensorChannel);
      supabase.removeChannel(predictionChannel);
    };
  }, [onNewTelemetry]);

  return { latestData, latestPrediction };
};
