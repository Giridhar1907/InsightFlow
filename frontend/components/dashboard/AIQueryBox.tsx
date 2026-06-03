"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
  question: string;
  setQuestion: (value: string) => void;
  onInsight: (response: string) => void;
  onChart: (chart: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIQueryBox({
  question,
  setQuestion,
  onInsight,
  onChart,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const askQuestion = async (
    customQuestion?: string
  ) => {

    const finalQuestion =
      customQuestion || question;

    if (!finalQuestion) return;

    try {

      setLoading(true);

      // =========================
      // AI INSIGHT
      // =========================

      const insightResponse =
        await axios.post(
          `${API_URL}/analytics/query`,
          {
            question: finalQuestion,
          }
        );

      onInsight(
        insightResponse.data.answer
      );

      // =========================
      // CHART GENERATION
      // =========================

      const chartResponse =
        await axios.post(
          `${API_URL}/chart/`,
          {
            question: finalQuestion,
          }
        );

      onChart(chartResponse.data);

      // IMPORTANT:
      // DO NOT setQuestion again here
      // Causes render loops

    } catch (error) {

      console.error(error);

      alert("AI query failed");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="
      border rounded-2xl
      p-6 bg-white shadow-sm
    ">

      <h2 className="
        text-2xl font-bold mb-4
      ">
        Ask AI About Your Data
      </h2>

      <div className="flex gap-4">

        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="
            Show monthly sales trend
          "
          className="
            border rounded-xl
            px-4 py-3 flex-1
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />

        <button
          onClick={() => askQuestion()}
          disabled={loading}
          className="
            bg-black text-white
            px-6 py-3 rounded-xl
            hover:opacity-90
            transition
            disabled:opacity-50
          "
        >

          {loading
            ? "Analyzing..."
            : "Ask AI"}

        </button>

      </div>

    </div>
  );
}