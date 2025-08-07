import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import CalendarHeader from './CalendarHeader';

interface CalendarAppProps {
  onClose: () => void;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get days from previous month to fill first week
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <CalendarHeader />
      
      <div className="flex-1 bg-white p-4">
        {/* Month Navigation */}
        <div className="calendar-nav-bar">
          <button
            onClick={previousMonth}
            className="calendar-nav-btn"
            aria-label="Previous Month"
          >
            &#x2039;
          </button>
          <div className="calendar-nav-title">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <button
            onClick={nextMonth}
            className="calendar-nav-btn"
            aria-label="Next Month"
          >
            &#x203A;
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="calendar-day-header"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={index}
                className={`
                  calendar-day aspect-square flex items-center justify-center text-sm font-medium cursor-pointer
                  ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${isCurrentDay ? 'today' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>

        {/* Today's Info */}
        <div className="calendar-event-summary">
          <h3>
            Today - {format(new Date(), 'EEEE, MMMM d')}
          </h3>
          <p>
            No events scheduled for today.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarApp; 