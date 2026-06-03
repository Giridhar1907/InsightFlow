"use client";

import { useState } from "react";
import axios from "axios";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

import AIQueryBox from "@/components/dashboard/AIQueryBox";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import SuggestedQuestions from "@/components/dashboard/SuggestedQuestions";
import ExecutiveSummaryCard from "@/components/dashboard/ExecutiveSummaryCard";
import AIHighlights from "@/components/dashboard/AIHighlights";
import ExplorationSuggestions from "@/components/dashboard/ExplorationSuggestions";

import DynamicChart from "@/components/charts/DynamicChart";
import AnalyticsCarousel from "@/components/dashboard/AnalyticsCarousel";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [data, setData] =
    useState<any>(null);

  const [kpis, setKpis] =
    useState<any>(null);

  const [insight, setInsight] =
    useState("");

  const [chartData, setChartData] =
    useState<any>(null);

  const [uploadLoading,
    setUploadLoading] =
    useState(false);

  const [suggestedQuestions,
    setSuggestedQuestions] =
    useState<string[]>([]);

  const [question, setQuestion] =
    useState("");

  // AUTO INSIGHTS
  const [autoInsights,
    setAutoInsights] =
    useState<string[]>([]);

  // AUTO DASHBOARD
  const [autoCharts,
    setAutoCharts] =
    useState<any[]>([]);

  const [autoLoading,
    setAutoLoading] =
    useState(false);

  // EXECUTIVE SUMMARY
  const [executiveSummary,
    setExecutiveSummary] =
    useState("");

  // AI GUIDED EXPLORATION
  const [
    explorationSuggestions,

    setExplorationSuggestions

  ] = useState<any[]>([]);

  const handleUpload = async () => {

    if (!file) return;

    try {

      setUploadLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      // =========================
      // UPLOAD DATASET
      // =========================

      const response =
        await axios.post(
          `${API_URL}/upload/csv`,
          formData
        );

      setData(response.data);

      // =========================
      // KPI FETCH
      // =========================

      const kpiResponse =
        await axios.get(
          `${API_URL}/kpi/`
        );

      setKpis(
        kpiResponse.data
      );

      // =========================
      // SUGGESTED QUESTIONS
      // =========================

      const questionsResponse =
        await axios.get(
          `${API_URL}/questions/`
        );

      setSuggestedQuestions(
        questionsResponse
          .data
          .questions
      );

      // =========================
      // AI AUTO INSIGHTS
      // =========================

      const insightsResponse =
        await axios.get(
          `${API_URL}/insights/`
        );

      setAutoInsights(
        insightsResponse
          .data
          .insights
      );

      // =========================
      // EXECUTIVE SUMMARY
      // =========================

      const executiveResponse =
        await axios.get(
          `${API_URL}/executive-summary/`
        );

      setExecutiveSummary(
        executiveResponse
          .data
          .summary
      );

      // =========================
      // EXPLORATION SUGGESTIONS
      // =========================

      const explorationResponse =
        await axios.get(
          `${API_URL}/exploration/`
        );

      setExplorationSuggestions(
        explorationResponse
          .data
          .suggestions
      );

      // =========================
      // AUTO DASHBOARD
      // =========================

      setAutoLoading(true);

      const autoDashboardResponse =
        await axios.get(
          `${API_URL}/auto-dashboard/`
        );

      const chartConfigs =
        autoDashboardResponse
          .data
          .charts;

      const generatedCharts = [];

      for (
        const chart
        of chartConfigs
      ) {

        const chartResponse =
          await axios.post(
            `${API_URL}/chart/`,
            {
              question:
                chart.question,
            }
          );

        generatedCharts.push({

          ...chartResponse.data,

          ai_context:
            chart.context

        });
      }

      setAutoCharts(
        generatedCharts
      );

      setAutoLoading(false);

    } catch (error) {

      console.error(error);

      alert("Upload failed");

    } finally {

      setUploadLoading(false);

    }
  };

  return (

    <div className="
      bg-gray-100
      min-h-screen
    ">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="
        ml-72 min-h-screen
      ">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="
          p-8 overflow-x-hidden
        ">

          {/* Upload Section */}
          <div className="
            bg-white
            p-6
            rounded-2xl
            shadow-sm
            mb-10
          ">

            <div className="
              flex items-center gap-4
            ">

              <input
                type="file"
                accept=".csv"
                onChange={(e) => {

                  if (
                    e.target.files?.[0]
                  ) {

                    setFile(
                      e.target.files[0]
                    );

                  }

                }}
              />

              <button
                onClick={handleUpload}
                className="
                  bg-black text-white
                  px-6 py-3 rounded-xl
                  hover:opacity-90
                  transition
                "
              >

                {uploadLoading
                  ? "Uploading..."
                  : "Upload Dataset"}

              </button>

            </div>

          </div>

          {data && (

            <>

              {/* KPI CARDS */}
              {kpis && (

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-5
                  gap-6
                  mb-10
                ">

                  <div className="
                    bg-white rounded-2xl
                    p-6 shadow-sm
                  ">

                    <h2 className="
                      text-gray-500 mb-2
                    ">
                      Total Sales
                    </h2>

                    <p className="
                      text-2xl font-bold
                    ">
                      $
                      {kpis.total_sales ?? 0}
                    </p>

                  </div>

                  <div className="
                    bg-white rounded-2xl
                    p-6 shadow-sm
                  ">

                    <h2 className="
                      text-gray-500 mb-2
                    ">
                      Total Profit
                    </h2>

                    <p className="
                      text-2xl font-bold
                    ">
                      $
                      {kpis.total_profit ?? 0}
                    </p>

                  </div>

                  <div className="
                    bg-white rounded-2xl
                    p-6 shadow-sm
                  ">

                    <h2 className="
                      text-gray-500 mb-2
                    ">
                      Quantity Sold
                    </h2>

                    <p className="
                      text-2xl font-bold
                    ">
                      {kpis.total_quantity ?? 0}
                    </p>

                  </div>

                  <div className="
                    bg-white rounded-2xl
                    p-6 shadow-sm
                  ">

                    <h2 className="
                      text-gray-500 mb-2
                    ">
                      Total Rows
                    </h2>

                    <p className="
                      text-2xl font-bold
                    ">
                      {kpis.total_rows}
                    </p>

                  </div>

                  <div className="
                    bg-white rounded-2xl
                    p-6 shadow-sm
                  ">

                    <h2 className="
                      text-gray-500 mb-2
                    ">
                      Total Columns
                    </h2>

                    <p className="
                      text-2xl font-bold
                    ">
                      {kpis.total_columns}
                    </p>

                  </div>

                </div>

              )}

              {/* EXECUTIVE SUMMARY */}
              <ExecutiveSummaryCard
                summary={executiveSummary}
              />

              {/* AI HIGHLIGHTS */}
              <AIHighlights
                insights={autoInsights}
              />

              {/* AI EXPLORATION */}
              <ExplorationSuggestions

                suggestions={
                  explorationSuggestions
                }

                onSelect={(question) => {

                  setQuestion(question);

                }}
              />

              {/* AUTO DASHBOARD */}
              {autoLoading && (

                <div className="
                  bg-white rounded-2xl
                  p-10 shadow-sm mb-10
                ">

                  <h2 className="
                    text-2xl font-bold
                  ">
                    AI is generating
                    your dashboard...
                  </h2>

                </div>

              )}

              {autoCharts.length > 0 && (

                <div className="mb-14">

                  <AnalyticsCarousel
                    charts={autoCharts}
                  />

                </div>

              )}

              {/* AI QUERY */}
              <AIQueryBox
                question={question}
                setQuestion={setQuestion}
                onInsight={setInsight}
                onChart={(chart) => {

                  setChartData(chart);

                }}
              />

              {/* SUGGESTED QUESTIONS */}
              <SuggestedQuestions
                questions={
                  suggestedQuestions
                }
                onSelect={(
                  selectedQuestion
                ) => {

                  setQuestion(
                    selectedQuestion
                  );

                }}
              />

              {/* AI INSIGHT */}
              {insight && (

                <AIInsightCard
                  insight={insight}
                />

              )}

              {/* DYNAMIC CHART */}
              {chartData && (

                <DynamicChart
                  chartData={chartData}
                />

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
}