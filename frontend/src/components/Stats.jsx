function Stats({ total, pending, completed }) {
  return (
    <div className="stats">
      <div className="stat-box">
        <strong>{total}</strong>
        <span>Total Tasks</span>
      </div>

      <div className="stat-box">
        <strong>{pending}</strong>
        <span>Pending</span>
      </div>

      <div className="stat-box">
        <strong>{completed}</strong>
        <span>Completed</span>
      </div>
    </div>
  );
}

export default Stats;