"use client";

import { useState } from "react";

import DynamicChart from
"@/components/charts/DynamicChart";

interface Props {
  charts: any[];
}

export default function
AnalyticsCarousel({

  charts,

}: Props) {

  const [

    currentIndex,

    setCurrentIndex

  ] = useState(0);

  if (!charts.length)
    return null;

  const currentChart =
    charts[currentIndex];

  const nextChart = () => {

    setCurrentIndex((prev) =>

      prev === charts.length - 1
        ? 0
        : prev + 1

    );

  };

  const previousChart = () => {

    setCurrentIndex((prev) =>

      prev === 0
        ? charts.length - 1
        : prev - 1

    );

  };

  return (

    <div className="mb-14">

      {/* HEADER */}
      <div className="
        flex items-center
        justify-between
        mb-8
      ">

        <div>

          <p className="
            text-sm uppercase
            tracking-wide
            text-gray-500
            mb-2
          ">
            AI Generated Dashboard
          </p>

          <h2 className="
            text-4xl font-bold
          ">
            AI Analytics Overview
          </h2>

        </div>

        {/* NAVIGATION */}
        <div className="
          flex items-center
          gap-3
        ">

          <button
            onClick={previousChart}
            className="
              h-14 w-14
              bg-white border
              rounded-2xl
              hover:bg-gray-100
              transition
              text-xl
              shadow-sm
            "
          >
            ←
          </button>

          <button
            onClick={nextChart}
            className="
              h-14 w-14
              bg-white border
              rounded-2xl
              hover:bg-gray-100
              transition
              text-xl
              shadow-sm
            "
          >
            →
          </button>

        </div>

      </div>

      {/* MAIN LAYOUT */}
      <div className="
        grid
        grid-cols-1
        xl:grid-cols-5
        gap-8
        items-stretch
      ">

        {/* CHART SECTION */}
        <div className="
          xl:col-span-3
        ">

          <DynamicChart
            chartData={currentChart}
          />

        </div>

        {/* AI PANEL */}
        <div className="
          xl:col-span-2

          bg-black
          text-white

          rounded-[32px]

          p-10

          flex flex-col
          justify-between

          min-h-[620px]

          shadow-xl
        ">

          {/* TOP */}
          <div>

            <p className="
              text-sm uppercase
              tracking-wider
              text-gray-400
              mb-4
            ">
              AI Deep Dive
            </p>

            <h3 className="
              text-3xl
              font-bold
              leading-tight
              mb-10
            ">
              {
                currentChart
                ?.ai_context
                ?.metric
              }
            </h3>

            <div className="
              space-y-10
            ">

              {/* OBSERVATION */}
              <div>

                <p className="
                  text-gray-400
                  text-sm uppercase
                  tracking-wide
                  mb-3
                ">
                  Observation
                </p>

                <p className="
                  text-lg
                  leading-relaxed
                  text-gray-100
                ">
                  {
                    currentChart
                    ?.ai_context
                    ?.observation
                  }
                </p>

              </div>

              {/* BUSINESS IMPACT */}
              <div>

                <p className="
                  text-gray-400
                  text-sm uppercase
                  tracking-wide
                  mb-3
                ">
                  Business Impact
                </p>

                <p className="
                  text-lg
                  leading-relaxed
                  text-gray-100
                ">
                  {
                    currentChart
                    ?.ai_context
                    ?.impact
                  }
                </p>

              </div>

            </div>

          </div>

          {/* RECOMMENDATION */}
          <div className="
            border-t
            border-white/10
            pt-8
            mt-10
          ">

            <p className="
              text-gray-400
              text-sm uppercase
              tracking-wide
              mb-3
            ">
              Recommendation
            </p>

            <p className="
              text-xl
              leading-relaxed
              font-medium
            ">
              {
                currentChart
                ?.ai_context
                ?.recommendation
              }
            </p>

          </div>

        </div>

      </div>

      {/* INDICATORS */}
      <div className="
        flex justify-center
        gap-3 mt-8
      ">

        {charts.map(
          (_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentIndex(index)
              }
              className={`
                transition-all

                ${
                  currentIndex === index
                    ? "w-10 bg-black"
                    : "w-3 bg-gray-300"
                }

                h-3 rounded-full
              `}
            />

          )
        )}

      </div>

    </div>
  );
}