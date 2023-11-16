import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NewItemsToCollect = ({ items, setItems }) => {
  const [item, setItem] = useState('');

  const handleTempTask = (e) => {
    setItem(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item.trim()) {
      const newData = {
        id: uuidv4(),
        item: item,
        createdAt: new Date(),
      };
      setItems([...items, newData]);
      setItem('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Введите наименование..." value={item} onChange={handleTempTask} />
        <button type="submit">Начать сбор</button>
      </form>
    </div>
  );
};

export default NewItemsToCollect;
