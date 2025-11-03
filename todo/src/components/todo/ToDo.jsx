import React, { useRef, useState } from "react";
import "./ToDo.css";
import { useEffect } from "react";

function ToDo() {
  const inputFocus = useRef(null);
  const [add, setAdd] = useState("");
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getdata();
  }, []);
  const getdata = () => {
    fetch("https://rh-week8-backend-47qv.onrender.com/getdata")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result.data);
        setData(result.data);
      })
      .catch((err) => [console.log("error", err)]);
  };

  const addData = () => {
    if (add.trim() === "") return;
    if (editId) {
      // setData(
      //   data.map((ele, index) => {
      //     return index === editIndex ? add : ele;
      //   })
      // );

       fetch(`https://rh-week8-backend-47qv.onrender.com/update/${editId}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({message : add}),
       })
         .then((res) => {
           return res.json();
         })
         .then((result) => {
           console.log("Data Updated");
           setAdd("");
           getdata();
         })
         .catch((err) => {
           console.log("Erroe", err);
         });
      setEditIndex(null);
      setEditId(null)
      setAdd("");
    } else {
      fetch("https://rh-week8-backend-47qv.onrender.com/postdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({message:add})
      })
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          console.log("Data Sended");
          setAdd("");
          getdata()
        })
        .catch((err) => {
          console.log("Erroe", err);
        });
      
    }
  };
  const editItem = (index) => {
    const item= data[index]
    setEditIndex(index);
    setEditId(item._id)
    setAdd(item.message);
    inputFocus.current.focus();
  };

  const removeData = (iD) => {
    // setData((prev) => prev.filter((_, i) => i !== index));

    fetch(`https://rh-week8-backend-47qv.onrender.com/remove/${iD}`, { method: "DELETE" })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log("deleted");
        getdata();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <div className="main">
      <div className="top">
        <h1>TODO LIST</h1>
        <input
          type="text"
          value={add}
          ref={inputFocus}
          onChange={(e) => {
            setAdd(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addData();
            }
          }}
          placeholder="Add List"
        />
        <button onClick={addData}>Add</button>
      </div>

      <div className="list">
        {data.map((ele, index) => {
          return (
            <div className="litem">
              <div className="data">
                <h4>{ele.message}</h4>
              </div>
              <div className="bt">
                <input type="checkbox" />
                <button
                  onClick={() => {
                    editItem(index);
                  }}
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={() => {
                    removeData(ele._id);
                  }}
                >
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ToDo;
