function DateSelector({ selectedDate, onDateChange }) {
  const dates = [];

  for (let i = -7; i <= 7; i++) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + i);
    dates.push(date);
  }

  const formatDay = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const formatDate = (date) => {
    return date.getDate();
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="date-selector">
      {dates.map((date) => {
        const selected = isSameDate(
          date,
          selectedDate
        );

        return (
          <button
            key={date.toISOString()}
            type="button"
            className={`date-item ${
              selected ? "selected" : ""
            }`}
            onClick={() => onDateChange(date)}
            aria-label={`Select ${date.toLocaleDateString(
              "en-US",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}`}
          >
            <span className="date-number">
              {formatDate(date)}
            </span>

            <span className="date-day">
              {formatDay(date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DateSelector;