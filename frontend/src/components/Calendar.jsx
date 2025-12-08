import { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Trigger flip animation on month change
    useEffect(() => {
        setIsFlipping(true);
        const timer = setTimeout(() => setIsFlipping(false), 600);
        return () => clearTimeout(timer);
    }, [currentDate.getMonth(), currentDate.getFullYear()]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    const currentDay = today.getDate();

    // Get days in month
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(currentDate.getMonth(), year);

    // Get starting day of the week (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayRaw = new Date(year, currentDate.getMonth(), 1).getDay();
    // Adjust for Monday start: Mon(1)->0, ..., Sun(0)->6
    const firstDayOfMonth = (firstDayRaw + 6) % 7;

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const renderCalendarGrid = () => {
        const grid = [];
        // Empty cells for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && i === currentDay;
            grid.push(
                <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    {i}
                </div>
            );
        }
        return grid;
    };

    return (
        <div className="calendar-perspective-container">
            <div className={`calendar-page ${isFlipping ? 'flipping' : ''}`}>
                {/* Navigation Controls */}
                <div className="calendar-navigation">
                    <button className="nav-arrow" onClick={goToPreviousMonth} title="Previous Month">
                        ◀
                    </button>
                    <button className="today-btn" onClick={goToToday} title="Go to Today">
                        Today
                    </button>
                    <button className="nav-arrow" onClick={goToNextMonth} title="Next Month">
                        ▶
                    </button>
                </div>

                <div className="calendar-page-header">
                    <span className="calendar-month-title">{monthName}</span>
                    <span className="calendar-year-title">{year}</span>
                </div>
                <div className="calendar-weekdays">
                    {days.map(d => <div key={d} className="weekday">{d}</div>)}
                </div>
                <div className="calendar-grid">
                    {renderCalendarGrid()}
                </div>
                {/* Decorative spiral binding */}
                <div className="calendar-binding"></div>
            </div>
        </div>
    );
};

export default Calendar;

