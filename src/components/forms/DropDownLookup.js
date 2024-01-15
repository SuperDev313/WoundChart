import React, { useState } from "react";
// ** Third Party Components
import { Input } from "reactstrap";

const DropDownLookup = (value, data, onValueChange) => {
  const [options, setOptions] = useState(data);
  const [id, setId] = useState(value);

  console.log('data', data)


  const handleOnChange = (val) => {
    onValueChange(val);
    setId(val);
  };

  React.useEffect(() => {
    var items = [
      {
        label: "",
        value: "",
      },
    ];


    try{
      if (data) {
        data.map((r) => {
          const option = {
            text: r.description ?? r.name,
            value: r.id,
            selected: r.id === value,
          };
          items.push(option);
  
          return option;
        });
        setOptions(items);
      }
    }
    catch(e){}
   

    //onValueChange(value);
  }, [options]);

  return (
    <>
      <Input
        type="select"
        value={id}
        onChange={(e) => handleOnChange(e.target.value)}
      >
        { options.map && options.map((item, index) => (
          <option value={item.value} key={item.value}>
            {item.text}
          </option>
        ))}
      </Input>
    </>
  );
};

export default DropDownLookup;
