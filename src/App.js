import { useEffect, useState } from "react";
import "./index.css";
export default function App() {
  const [items, setItems] = useState([]);

  //This function will add new item to existing array
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  //We are now deleting items
  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  //We are now toggling between items
  // function handleToggleItems(id) {
  //   setItems((items) =>
  //     items.map((item) =>
  //       item.id === id ? { ...item, done: !item.done } : items
  //     )
  //   );
  // }

  function handleToggleItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }
  function handleClearlist() {
    const confirmed = window.confirm("Clear Schedule?");

    if (confirmed) setItems([]);
  }

  return (
    <>
      <Heading />
      <Form onAddItems={handleAddItems} />
      <Display
        items={items}
        onDeleteitems={handleDeleteItems}
        onToggleitems={handleToggleItems}
        onclearlist={handleClearlist}
      />
      <Stats items={items} />
    </>
  );
}

function Heading() {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.adviceslip.com/advice");
        const data = await res.json();
        setAdvice(data.slip.advice);
      } catch (error) {
        console.error("Error fetching advice:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <p className="quote">
        <span style={{ color: "yellow", fontWeight: "600" }}>
          Quote of the day:‎ ‎ ‎{" "}
        </span>
        {advice}
      </p>
      <h1>LET'S PLAN FOR TODAY!</h1>
    </>
  );
}

function Form({ onAddItems }) {
  const [time, setTime] = useState(1);
  const [period, setPeriod] = useState("AM");
  const [description, setDescription] = useState("");

  //This thing when defined here will create problem because now we need to pass props/state to sibling component which isnot possible in react so it is lifted to nearest parent component
  // const [items,setItems] =useState([]);

  // //This function will add new item to existing array
  // function handleAddItems(item) {
  //   setItems((items) => [...items, item])
  // }

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, period, time, done: false, id: Date.now() };
    onAddItems(newItem);
    setTime(1);
    setPeriod("AM");
    setDescription("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Today's Sechdule🎯</h3>
      <select value={time} onChange={(e) => setTime(e.target.value)}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="AM" key={"AM"}>
          AM
        </option>
        <option value="PM" key={"PM"}>
          PM
        </option>
      </select>

      <input
        type="text"
        placeholder="Plans"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button value="submit">Add</button>
    </form>
  );
}

function Display({ items, onDeleteitems, onToggleitems, onclearlist }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "alpha")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "date")
    sortedItems = items.slice().sort((a, b) => a.time.localeCompare(b.time));

  if (sortBy === "progress")
    sortedItems = items.slice().sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Work
            item={item}
            key={item.id}
            onDeleteitems={onDeleteitems}
            onToggleitems={onToggleitems}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input"> Sort By Input</option>
          <option value="alpha"> Sort By Description</option>
          <option value="date"> Sort By Date</option>
          <option value="progress"> Sort By Progress </option>
        </select>
        <button onClick={onclearlist}>Clear List</button>
      </div>
    </div>
  );
}

function Work({ item, onDeleteitems, onToggleitems }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.done}
        onChange={() => onToggleitems(item.id)}
      />
      <span style={item.done ? { textDecoration: "line-through" } : {}}>
        {item.time} {item.period} {item.description}
      </span>
      <button onClick={() => onDeleteitems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Progress Report! 🧾</em>
      </footer>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.done).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      {percentage === 100 ? (
        " 100% 😎 Well Done Boy! 💪"
      ) : (
        <>
          <em>
            Total Task : {numItems} & Task Completed : {numPacked}
          </em>
          <br />
          <em style={{ color: "yellow" }}>
            <strong>Work Percentage = {percentage}%</strong>
          </em>
        </>
      )}
    </footer>
  );
}
