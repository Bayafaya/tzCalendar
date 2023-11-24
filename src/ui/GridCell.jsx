import React, { useState } from 'react'
import '../styles/GridCell.css'

function GridCell({contributionsData}) {
  const [selected, setSelected] =  useState(false);

  const handleContributionsCountColor = (count)=>{
    if(count <= 0){
        return null
    }
    else if(count >=1 && count <= 9){
        return '#ACD5F2'
    }
    else if(count >=10 && count <= 19){
        return '#7FA8C9'
    }
    else if(count >=20 && count <= 29){
        return '#527BA0'
    }
    else if(count >= 30){
        return '#254E77'
    }
  }
 

  function formatRussianDate(dateString) {
    const daysOfWeek = [
       "", "Понедельник", "Вторник", "Среда",
        "Четверг", "Пятница", "Суббота","Воскресенье"
    ];

    const months = [
        "", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const [year, month, day, dayOf] = dateString.split("-").map(Number);
    const formattedDate = `${daysOfWeek[dayOf]}, ${months[month]} ${day}, ${year}`;
    
    return formattedDate;
}

  return (
    <div 
     className={selected ? `cell selected` :  `cell`}
     style={contributionsData ? {backgroundColor: handleContributionsCountColor(contributionsData.countOfContributions)} : {backgroundColor: handleContributionsCountColor(0)}}
     onClick={()=>setSelected(!selected)}
    >
      <span className={selected ? `tooltiptext tooltiptextOn` :  `tooltiptext`}> <div>{contributionsData ? contributionsData.countOfContributions : 0} contributions</div>  <span>{contributionsData ? formatRussianDate(contributionsData.date) : ''}</span> </span>
    </div>
  )
}

export default GridCell