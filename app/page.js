'use client';



import React, { useState,useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const SkillTestPage = () => {
  const [percentile, setPercentile] = useState(30);
  const [inputValue, setInputValue] = useState(30);
  const [highlightedPercentile, setHighlightedPercentile] = useState(null);
  const [donutPercentage, setDonutPercentage] = useState(0);


const [showModal, setShowModal] = useState(false);
const [rank, setRank] = useState(1);
const [correctAnswers, setCorrectAnswers] = useState("10 / 15");

// Inside modal input fields
const [editRank, setEditRank] = useState(rank);
const [editPercentile, setEditPercentile] = useState(percentile);
const [editCorrectAnswers, setEditCorrectAnswers] = useState(correctAnswers);


  const ticks = [0, 25, 50, 75, 100];
  const data = Array.from({ length: 101 }, (_, i) => ({
    percentile: i,
    numberOfStudent: Math.round(100 * Math.exp(-Math.pow(i - 50, 2) / (2 * 15 * 15))),
  }));

  useEffect(() => {
    const [correct, total] = correctAnswers.split('/').map((val) => parseInt(val.trim()));
    if (!isNaN(correct) && !isNaN(total) && total !== 0) {
      const percentage = Math.round((correct / total) * 100);
      setDonutPercentage(percentage);
    }
  }, [correctAnswers]);
  

  return (
    <div className="flex flex-col min-h-screen bg-white ">
      {/* === Header === */}
      <header className="flex justify-between items-center bg-white px-6 py-4 shadow-md border-b border-gray-200 h-25">
       

      <h1 className="flex items-center gap-2 text-2xl font-bold text-black-600">
  <img src="/wat.jpg" alt="Tick Icon" className="w-10 h-10" />
  WhatBytes
</h1>


<div className="text-gray-700 font-medium text-right sm:text-center">
  Rahil Shaddique
</div>


      </header>

      <div className="flex gap-8 p-6 flex-1">
       
       

      <aside className="hidden md:block w-60 bg-white shadow-md p-6 min-h-screen border-r border-gray-200">
  <nav className="space-y-2 mt-6 text-gray-700 font-medium">
    {/* Dashboard */}
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:text-purple-600 cursor-pointer transition">
      <img src="/bchart.jpg" alt="Dashboard Icon" className="w-6 h-6 object-contain" />
      <span>Dashboard</span>
    </div>

    {/* Skill Test - Active */}
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-purple-600 font-semibold bg-purple-50">
      <img src="/medal.jpg" alt="Skill Test Icon" className="w-6 h-6 object-contain" />
      <span>Skill Test</span>
    </div>

    {/* Internship */}
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:text-purple-600 cursor-pointer transition">
      <img src="/paper.png" alt="Internship Icon" className="w-6 h-6 object-contain" />
      <span>Internship</span>
    </div>
  </nav>
</aside>







        {/* === Main Content === */}
     

<main className="flex-1 flex flex-col space-y-8 px-4 md:px-8 py-6 w-[95%] sm:w-full max-w-5xl mx-auto">

  
  {/* === Test Info Section === */}
  <section className="w-[200%] sm:w-auto bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4 w-full">
        <img src="/himg.png" alt="Icon" className="w-12 h-12 sm:w-16 sm:h-16 mt-1 sm:mt-3" />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Hyper Text Markup Language</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Questions: 08 | Duration: 15 mins | Submitted on 5 June 2021
          </p>
        </div>
      </div>

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition font-medium w-full sm:w-auto"
        onClick={() => setShowModal(true)}
      >
        Update
      </button>
    </div>
  </section>

  {/* === Quick Statistics Section === */}
  <section className="w-[200%] sm:w-auto bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">

    <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Statistics</h2>
    <div className="flex flex-col sm:flex-row justify-between text-center gap-6 sm:gap-10">

      {/* Rank */}
      <div className="flex-1 flex flex-col items-center min-h-[130px]">
        <img src="/trophy.jpg" alt="Cup Icon" className="w-12 h-12" />
        <p className="text-xl font-extrabold text-yellow-600 leading-none mt-2">{rank}</p>
        <p className="text-sm text-gray-600">YOUR RANK</p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block border-l h-[100px] border-gray-300"></div>

      {/* Percentile */}
      <div className="flex-1 flex flex-col items-center min-h-[130px]">
        <img src="/notespad.jpg" alt="Notes Icon" className="w-10 h-10 mb-2" />
        <p className="text-xl font-extrabold text-gray-800">{percentile}%</p>
        <p className="text-sm text-gray-600">PERCENTILE</p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block border-l h-[100px] border-gray-300"></div>

      {/* Correct Answers */}
      <div className="flex-1 flex flex-col items-center min-h-[130px]">
        <img src="/tick.png" alt="Tick Icon" className="w-10 h-10 mt-1" />
        <p className="text-xl font-extrabold text-green-600 mt-2">{correctAnswers}</p>
        <p className="text-sm text-gray-600">CORRECT ANSWERS</p>
      </div>
    </div>
  </section>

  {/* === Comparison Graph Section === */}

  <section className="w-[200%] sm:w-auto bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">




    <h2 className="text-base sm:text-xl font-semibold mb-2">Comparison Graph</h2>
    <p className="mb-4 text-sm sm:text-base">
      <strong>You scored {percentile}% percentile</strong> which is lower than the average
      percentile 72% of all the engineers who took this assessment.
    </p>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="percentile" ticks={ticks} domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis hide />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="bg-white border border-gray-300 rounded p-2 shadow text-sm">
                <p className="text-black font-semibold">{label}</p>
                <p className="text-purple-700">numberOfStudent : {payload[0].value}</p>
              </div>
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="numberOfStudent"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={({ cx, cy, payload }) => {
            const isMain = payload.percentile === percentile;
            const isTick = ticks.includes(payload.percentile);
            const isHighlighted = payload.percentile === highlightedPercentile;
            const onClick = () => setHighlightedPercentile(payload.percentile);

            if (isMain)
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#8B5CF6"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  onClick={onClick}
                  style={{ cursor: 'pointer' }}
                />
              );
            if (isHighlighted)
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#8B5CF6"
                  stroke="#000"
                  strokeWidth={1}
                  onClick={onClick}
                  style={{ cursor: 'pointer' }}
                />
              );
            if (isTick)
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#fff"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  onClick={onClick}
                  style={{ cursor: 'pointer' }}
                />
              );
            return (
              <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="transparent"
                onClick={onClick}
                style={{ cursor: 'pointer' }}
              />
            );
          }}
          activeDot={false}
        />
        <ReferenceLine
          x={percentile}
          stroke="#A0A0A0"
          strokeWidth={1}
          label={{
            position: 'insideBottomLeft',
            value: 'your percentile',
            fill: '#666',
            fontSize: 12,
          }}
        />
        {highlightedPercentile !== null && (
          <ReferenceLine x={highlightedPercentile} stroke="#A0A0A0" strokeWidth={2} />
        )}
      </LineChart>
    </ResponsiveContainer>
  </section>
</main>







        {/* === Syllabus Analysis Sidebar === */}
        
        {/* === Sidebar & Donut Chart Wrapper === */}




        <aside className="w-full sm:w-120 bg-white shadow-md border-l border-gray-200 p-6 flex flex-col gap-6 rounded-xl h-120 mt-[1300px] ml-[-200px] sm:mt-10 sm:mx-auto">


{/* === Syllabus Analysis === */}
<div>
  <h2 className="text-xl font-semibold mb-10 text-purple-600">Syllabus Analysis</h2>
  {[
    { topic: 'HTML Tools, Forms, History', percent: 80, color: 'bg-blue-500' },
    { topic: 'Tags & References in HTML', percent: 60, color: 'bg-orange-400' },
    { topic: 'Tables & References in HTML', percent: 24, color: 'bg-red-500' },
    { topic: 'Tables & CSS Basics', percent: 96, color: 'bg-green-500' },
  ].map(({ topic, percent, color }) => (
    <div key={topic} className="mb-10">
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span>{topic}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  ))}
</div>

{/* === Donut Chart === */}
<div className="w-[125%] sm:w-120 bg-white shadow-md border border-gray-300 py-20 px-7 rounded-2xl mt-20 -ml-5 mx-auto">

  {/* Header */}
  <div className="flex items-center justify-between -mt-15">
    <h2 className="text-lg font-bold text-gray-800 mb-0">Question Analysis</h2>
    <span className="text-blue-600 font-bold">{correctAnswers}</span>
  </div>

  {/* Description */}
  <p className="text-sm text-gray-700 mt-10">
    <span className="font-semibold text-gray-900">
      You scored <span className="text-black">{correctAnswers} question correct out of 15.</span>
    </span> However it still needs some improvements
  </p>

  {/* Donut Chart */}
  <div className="relative w-52 h-52 mx-auto">
    <svg
      width="220"
      height="220"
      viewBox="0 0 36 36"
      className="donut-chart"
    >
      {/* Background Circle */}
      <circle
        cx="18"
        cy="18"
        r="14.5"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="5"
      />
      {/* Progress Circle */}
      <circle
        cx="18"
        cy="18"
        r="14.5"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="5"
        strokeDasharray={`${donutPercentage} ${100 - donutPercentage}`}
        strokeDashoffset="25"
        strokeLinecap="none"
        transform="rotate(180 18 18)"
      />
    </svg>

    {/* Center Icon */}
    <div className="absolute inset-0 flex items-center justify-center">
      <img src="/dart.jpg" alt="Dart Icon" className="w-25 h-25" />
    </div>
  </div>
</div>
</aside>



      </div>

      

  {/*  Donut Chart Container */}


{/* Donut Chart Container */}












{showModal && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-full max-w-md space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Edit Quick Statistics</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">Your Rank</label>
          <input
            type="number"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={editRank}
            onChange={(e) => setEditRank(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Percentile</label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={editPercentile}
            onChange={(e) => setEditPercentile(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Correct Answers</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={editCorrectAnswers}
            onChange={(e) => setEditCorrectAnswers(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          className="px-4 py-2 text-gray-600 hover:text-black"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={() => {
            setRank(editRank);
            setPercentile(editPercentile);
            setCorrectAnswers(editCorrectAnswers);
            setShowModal(false);

            const match = editCorrectAnswers.match(/^(\d+)\s*\/\s*(\d+)$/);
            if (match) {
              const correct = Number(match[1]);
              const total = Number(match[2]) || 15; // fallback to 15 if not provided
              const percent = Math.min(100, Math.round((correct / total) * 100));
              setDonutPercentage(percent);
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



    </div>





  );
};

export default SkillTestPage;
