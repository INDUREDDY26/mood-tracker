import { useEffect, useState } from "react";

function App() {

  const [name, setName] = useState("");
  const [moods, setMoods] = useState([]);
  /*initially i'm setting moodhistory to false so that history is only shown when something is clicked*/
  const [moodHistory, setMoodHistory] = useState(false); 
  
  const handleMoodClick = async (mood) => {

    if (!name){
      setMessage("Please enter the name first!");
      return;
    }

    console.log("mood clicked" , mood);
    /* send post request to backend via API call*/
    await fetch("http://127.0.0.1:8000/mood",{
      method : "POST",
      headers : {"Content-Type" : "application/json",},
      body : JSON.stringify({name : name, mood : mood}), 
    });
    
    setMoodHistory(true);

    /* if useEffect(() => {.fetch....},[]) is used it calls GET method at the start when code is runned but we need when something is clicked and setmoodhistory to true, so remove useeffect and just use the fetch*/
    fetch("http://127.0.0.1:8000/mood")
    .then((res) => res.json())
    .then((data) => setMoods(data));
  };

  const handleMoodHistory = async () => {
    await fetch("http://127.0.0.1:8000/mood",{
      method : "DELETE"
    });
    console.log("mood history deleted");
    setMoods([]);
    setMoodHistory(false);
  };

  return (

    <div style = {{ padding: 20 }}>
      <h1>Hello..!! Mood Tracker React App activated!</h1>
      <h3>Enter your name..</h3>
      <input
        type = "text"
        value = {name}
        onChange = {(e) => setName(e.target.value)}
        placeholder = "enter your name"
      />

      <h2>How are you feeling today ?</h2>

      <button onClick = {() => handleMoodClick("Happy")}>Happy</button>
      <button onClick = {() => handleMoodClick("Sad")}>Sad</button>
      <button onClick = {() => handleMoodClick("OK")}>Ok</button>

      <h4>Upon click the data is added to the database via POST and fetch the history via GET. </h4>
      
      {/* show history only when moodhistory is true */}
      {moodHistory && (
        <>
        <button onClick = {() => handleMoodHistory()}> Clear Mood History</button>
        <ul>
          {moods.map((entry, index) => (
            <li key={index}>
              {entry.name} - {entry.mood} — {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul> 
        </>
      )}

    </div>
  );
}
export default App;