import React, { useState, useEffect } from "react";

import NewItemsToCollect from "../Buttons/NewItemsToCollect";

import deleteIcon from "../../icons/delete.png";
import collectIcon from "../../icons/collect.png";

const ItemList = () => {
    // данные по материалам
    const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
    const [collectedItems, setCollectedItems] = useState(JSON.parse(localStorage.getItem('collectedItems')) || []);
    
    // фильтры
    const [filter, setFilter] = useState("");
    const [collectedItemsFilter, setCollectedItemsFilter] = useState("");
    
    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    const deleteItem = (itemId) => {
        const updatedItems = items.filter((item) => item.id !== itemId);
        setItems(updatedItems);
    };

    const handItemsFilter = (e) => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        localStorage.setItem("collectedItems", JSON.stringify(collectedItems));
    }, [collectedItems]);

    const deleteCollectedItem = (itemId) => {
        const updatedCollectedItems = collectedItems.filter((item) => item.id !== itemId);
        setCollectedItems(updatedCollectedItems);
    };

    const handleCollectedItemsFilter = (e) => {
        setCollectedItemsFilter(e.target.value);
    };

    let collectedItemsObj = {
        id: "",
        name: "",
        timeCollected: 0,
    };

    const finishCollecing = (itemId, itemName, itemCreatedAt) => {
        const updatedItems = items.filter((item) => item.id !== itemId);
        setItems(updatedItems);
        
        const deleteDate = new Date().getTime();
        // itemCreatedAt = itemCreatedAt.getTime();

        const differenceInDays = Math.ceil((deleteDate - new Date(itemCreatedAt).getTime()) / (1000 * 3600 * 24)); 

        // данные по имени будут передаваться с большой буквы и без пробелов
        itemName = itemName.trim().toLocaleLowerCase().charAt(0).toUpperCase() + itemName.slice(1);

        collectedItemsObj = {
            id: itemId,
            name: itemName,
            timeCollected: differenceInDays <= 0 ? 1 : differenceInDays,
        };

        // проверка собирается ли уже материал, если да, то данные по времени сбора передадутся в существующий материал
        const existingItemIndex = collectedItems.findIndex(item => item.name === collectedItemsObj.name)
        
        if (existingItemIndex !== -1) {
            const updatedItems = [...collectedItems];
            updatedItems[existingItemIndex].timeCollected += differenceInDays <= 0 ? 1 : differenceInDays;
            setCollectedItems(updatedItems);
        } else {
            setCollectedItems([...collectedItems, collectedItemsObj]);
        };
    };

    const localeStorageClear = () => {
        localStorage.removeItem("collectedItems");
        window.location.reload();
    }
     
    return (
        <div className="mainDiv">
            <div className="collectionInProgress">
                <h2 className="div-header" title="Материалы в процессе сбора, указана дата начала сбора">Собираемые </h2>   
                <div>
                    <NewItemsToCollect items={items} setItems={setItems} />
                </div>
                <div>
                    {/* фильтр собираемых материалов */}
                    <input type="text" placeholder="Поиск материалов..." value={filter} onChange={handItemsFilter} />
                </div>
            <div>
                {/* отрисовка данных по собираемым материалам */}
                {
                    items
                        .filter(item => filter ? item.item.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true)
                        .map((item) => (
                            <div key={item.id}>
                                <span>{item.item.trim().toLocaleLowerCase().charAt(0).toUpperCase() + item.item.slice(1)} {new Date(item.createdAt).toLocaleDateString()}</span>
                                {/* Удаление материала */}
                                <img src={deleteIcon} alt="Удалить" className="icon" title="Удалить" onClick={() => deleteItem(item.id)}/>
                                {/* Завершение сбора и передача данных по сбору*/}
                                <img src={collectIcon} alt="Завершить сбор" className="icon" title="Завершить сбор" onClick={() => finishCollecing(item.id, item.item, item.createdAt)}/>
                            </div>
                        ))
                }
            </div>
            </div>
                <div className="collected">
                <h2 className="div-header" title="Сбор материалов завершен, указано количество дней затраченных на сбор">Собранные</h2>
                {/* удалить данные по собанным материалам из localstorage */}            
                <button className="delete-data" onClick={() => localeStorageClear()}>Удалить данные по сбору</button>
                
                <div>
                    {/* фильтрация собранных материалов */}
                    <input type="text" placeholder="Поиск материалов..." value={collectedItemsFilter} onChange={handleCollectedItemsFilter} />
                </div>            
                {/* отрисовка данных по собранным материалам */}
                {
                    collectedItems
                        .filter(item => collectedItemsFilter ? item.name.toLocaleLowerCase().includes(collectedItemsFilter.toLocaleLowerCase()) : true)
                        .map((item) => (
                            <div key={item.id}>
                                <span>{item.name} : {item.timeCollected} (дни сбора)</span>
                                {/* <button onClick={() => deleteCollectedItem(item.id)}>Удалить</button> */}
                                <img src={deleteIcon} alt="Удалить" className="icon" title="Удалить" onClick={() => deleteCollectedItem(item.id)}/>
                            </div>
                        ))
                }
                </div>
        </div>
   )
}
 
export default ItemList;