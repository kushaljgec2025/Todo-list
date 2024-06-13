import "../css/DisplayTask.css";
import React, { useEffect, useState } from "react";
import { MdPendingActions } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlineBorderClear } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdSort } from "react-icons/md";
import { CiFilter, CiSearch } from "react-icons/ci";
// import emptyLogo from "../asset/emty_logo.png";
import { toast } from "react-toastify";
function DisplayTask({ tasks, setTasks }) {
  const [displayTask, setDisplayTask] = useState(tasks);
  const [filterState, setFilterState] = useState("all");
  const sorting_criteria = localStorage.getItem("sorting_criteria");

  const updateTaskCompleteStatus = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (taskId === task.id) {
          task.isDone = true;
        }
        return task;
      })
    );
    toast.success("👍 Congratulation you complete a task");
  };

  const deleteATask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.success("🚫 Task successfully deleted");
  };

  const clearAllFilter = () => {
    const filterTask = tasks;
    const filterSortedTask = sorting_criteria
      ? sortTaskArray(sorting_criteria, filterTask)
      : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("all");
  };

  const pendingTaskFilter = () => {
    const filterTask = tasks.filter((task) => task.isDone === false);
    const filterSortedTask = sorting_criteria
      ? sortTaskArray(sorting_criteria, filterTask)
      : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("pending");
  };

  const completedTaskFilter = () => {
    const filterTask = tasks.filter((task) => task.isDone === true);
    const filterSortedTask = sorting_criteria
      ? sortTaskArray(sorting_criteria, filterTask)
      : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("completed");
  };

  const todayTaskFilter = () => {
    const localDate = new Date().toLocaleDateString();
    const [month, day, year] = localDate.split("/");
    const todayDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const filterTask = tasks.filter(
      (task) => task.dueDate.split("T")[0] === todayDate
    );
    const filterSortedTask = sorting_criteria
      ? sortTaskArray(sorting_criteria, filterTask)
      : filterTask;
    setDisplayTask(filterSortedTask);
    setFilterState("today");
  };

  const sortTaskArray = (sortBy = "dueDate", array = displayTask) => {
    let sortedArray = [];
    if (sortBy === "dueDate") {
      sortedArray = [...array].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    } else if (sortBy === "newToOld") {
      sortedArray = [...array].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "oldToNew") {
      sortedArray = [...array].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    return sortedArray;
  };
  const handelSearchTaskByName = (e) => {
    const searchValue = e.target.value.trim();
    // console.log(searchValue);
    setDisplayTask(
      tasks.filter((task) =>
        task.taskName.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      localStorage.setItem("sorting_criteria", selectedValue);
      const sortedArray = sortTaskArray(selectedValue);
      setDisplayTask(sortedArray);
    }
  };

  useEffect(() => {
    setDisplayTask(tasks);
    filterState === "all" && clearAllFilter();
    filterState === "pending" && pendingTaskFilter();
    filterState === "completed" && completedTaskFilter();
    filterState === "today" && todayTaskFilter();
    // eslint-disable-next-line
  }, [tasks]);
  useEffect(() => {
    if (sorting_criteria) {
      const sortedArray = sortTaskArray(sorting_criteria);
      setDisplayTask(sortedArray);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="display-container">
      <div className="filter-btn-container">
        <button
          className={`${
            filterState === "all" ? "applied-filter-btn" : "filter-btn"
          }`}
          onClick={clearAllFilter}
        >
          All
        </button>
        <button
          className={`${
            filterState === "pending" ? "applied-filter-btn" : "filter-btn"
          }`}
          onClick={pendingTaskFilter}
        >
          Pending
        </button>
        <button
          className={`${
            filterState === "completed" ? "applied-filter-btn" : "filter-btn"
          }`}
          onClick={completedTaskFilter}
        >
          Completed
        </button>
        <button
          className={`${
            filterState === "today" ? "applied-filter-btn" : "filter-btn"
          }`}
          onClick={todayTaskFilter}
        >
          Today Task
        </button>
        <label>
          <span>
            <MdSort size={24} color="2ee59d" />
          </span>
          <select
            className="sorted-criteria-select"
            defaultValue={sorting_criteria || "all"}
            onChange={handleSelectChange}
          >
            <option value="all" disabled>
              Select an option
            </option>
            <option value="dueDate">Due Time</option>
            <option value="newToOld">New To Old</option>
            <option value="oldToNew">Old To New</option>
          </select>
        </label>

        <div className="search-bar">
          <input
            type="text"
            name="search"
            pattern=".*\S.*"
            onChange={handelSearchTaskByName}
            required
          />

          <button className="search-btn" type="submit">
            <CiSearch size={20} />
          </button>
        </div>
      </div>
      {displayTask && displayTask.length > 0 ? (
        <>
          {displayTask.map((task, index) => (
            <div key={task.id} className="task-container">
              {task.isTimeOver && <p className="time-over-cut"></p>}
              <p className="task-index">{index + 1}</p>
              <p className="task-name"> {task.taskName}</p>
              <p className="due-date">{task.dueDate.split("T")[0]}</p>
              <p className="due-time">{task.dueDate.split("T")[1]}</p>
              <p className="is-done-icon-para">
                {task.isDone ? (
                  <IoCheckmarkDoneCircle className="completed-icon" />
                ) : (
                  <MdPendingActions className="pending-icon" />
                )}
              </p>
              <button
                className="mark-complete-btn"
                disabled={task.isDone || task.isTimeOver}
                onClick={() => updateTaskCompleteStatus(task.id)}
              >
                {task.isDone ? "Completed" : "Marked as Complete"}
              </button>
              <p>
                <MdDelete
                  className="delete-btn"
                  onClick={() => deleteATask(task.id)}
                />
              </p>
            </div>
          ))}
        </>
      ) : (
        <>
          <MdOutlineBorderClear size={100} color={"2ee59d"} />
          <h2 className="empty-heading">EMPTY</h2>
        </>
      )}
    </div>
  );
}

export default DisplayTask;
