import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne'; // Consider adapting this chart for your needs
import ChartTwo from '../../components/Charts/ChartTwo'; // Consider adapting this chart for your needs
import ChartThree from '../../components/Charts/ChartThree'; // Consider adapting this chart for your needs

const SEIDashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Service Requests"
          total="120"
          rate="3.25%"
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Your SVG icon */}
            <path
              d="M7 6H15C15.553 6 16 6.447 16 7C16 7.553 15.553 8 15 8H7C6.447 8 6 7.553 6 7C6 6.447 6.447 6 7 6ZM7 10H11C11.553 10 12 10.447 12 11C12 11.553 11.553 12 11 12H7C6.447 12 6 11.553 6 11C6 10.447 6.447 10 7 10ZM7 14H15C15.553 14 16 14.447 16 15C16 15.553 15.553 16 15 16H7C6.447 16 6 15.553 6 15C6 14.447 6.447 14 7 14Z"
              fill="currentColor"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Active Contracts" total="58" rate="1.85%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Your SVG icon */}
            <path
              d="M14 0H6C4.34315 0 3 1.34315 3 3V19C3 20.6569 4.34315 22 6 22H14C15.6569 22 17 20.6569 17 19V3C17 1.34315 15.6569 0 14 0ZM6 2H14C14.5523 2 15 2.44772 15 3V19C15 19.5523 14.5523 20 14 20H6C5.44772 20 5 19.5523 5 19V3C5 2.44772 5.44772 2 6 2ZM7 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H7C6.44772 7 6 6.55228 6 6C6 5.44772 6.44772 5 7 5ZM7 9H11C11.5523 9 12 9.44772 12 10C12 10.5523 11.5523 11 11 11H7C6.44772 11 6 10.5523 6 10C6 9.44772 6.44772 9 7 9Z"
              fill="currentColor"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Revenue" total="$15.8K" rate="5.20%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Your SVG icon */}
            <path
              d="M11 0C10.447 0 10 0.447 10 1V9H6.293C5.523 9 5.077 9.791 5.5 10.5L10.5 18.5C10.788 19 11.788 19 12.077 18.5L17.077 10.5C17.5 9.791 17.055 9 16.293 9H12V1C12 0.447 11.553 0 11 0Z"
              fill="currentColor"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Alerts" total="5" rate="N/A" levelDown>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Your SVG icon */}
             <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor"/>
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne /> {/* Adapt these charts to display relevant data */}
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default SEIDashboard;
