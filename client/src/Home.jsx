import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [values, setValues] = useState([]);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    getAllNumbers();
  }, []);

  const getAllNumbers = useCallback(async () => {
    // we will use nginx to redirect it to the proper URL
    const data = await axios.get("/api/values/all");
    setValues(data.data.rows.map((row) => row.number));
  }, []);

  const saveNumber = useCallback(
    async (event) => {
      event.preventDefault();

      await axios.post("/api/values", {
        value: currentValue,
      });

      setCurrentValue("");
      getAllNumbers();
    },
    [currentValue, getAllNumbers]
  );

  return (
    <div className="home">
      <h1>Simple React and NodeJs app deployed to Kubernetes</h1>
      <button onClick={getAllNumbers}>Get All Numbers</button>
      <div>
        {values?.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      <form onSubmit={saveNumber}>
        <label htmlFor="">
          <h2>Enter a value</h2>
        </label>
        <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
