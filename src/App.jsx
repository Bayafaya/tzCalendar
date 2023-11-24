import { useEffect, useState } from "react";
import "./App.css";
import GridCell from "./ui/GridCell";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";


dayjs.extend(duration);
dayjs.extend(isBetween);

function App() {
  const [calendarData, setCalendarData] = useState([]);
  const [wholeTime, setWholeTime] = useState([]);
  const format = "YYYY-MM-DD-d";
  const today = dayjs().format(format);
  const lastFiftyWeeks = dayjs().subtract(50, "week").format(format);

  function nextDay(dateString) {
  
    const [year, month, day, dayOfWeek] = dateString.split('-').map(Number);

    const currentDate = new Date(year, month - 1, day);

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth() + 1;
    const nextDayOfMonth = nextDate.getDate();
    const nextDayOfWeek = (dayOfWeek % 7) + 1; 

 
    const result = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDayOfMonth).padStart(2, '0')}-${nextDayOfWeek}`;

    return result;
}

function getRussianMonthList(startDateString) {
  const [startYear, startMonth] = startDateString.split('-').map(Number);

  const monthsInRussian = [
      "", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const monthList = [];
  for (let year = startYear; year <= new Date().getFullYear(); year++) {
      for (let month = (year === startYear) ? startMonth : 1; month <= 12; month++) {
          monthList.push(`${monthsInRussian[month].substr(0, 3)}.`);
      }
  }
  monthList.pop()
  return monthList;
}
const listOfOrderedMonth =  getRussianMonthList(lastFiftyWeeks)

function previousDay(dateString) {
    const [year, month, day, dayOfWeek] = dateString.split('-').map(Number);

    const currentDate = new Date(year, month - 1, day);

    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);

    const previousYear = previousDate.getFullYear();
    const previousMonth = previousDate.getMonth() + 1;
    const previousDayOfMonth = previousDate.getDate();
    const previousDayOfWeek = (dayOfWeek - 1 + 7) % 7;

    const result = `${previousYear}-${String(previousMonth).padStart(2, '0')}-${String(previousDayOfMonth).padStart(2, '0')}-${previousDayOfWeek}`;

    return result;
}
  
  const getCalendar = async () => {
    try {
      const response = await axios.get("https://dpg.gg/test/calendar.json");

      const dateForPush = [];
      let differenceDay = 0;
      const gapDays = [];
      const finalArray = [];

      for (const key in response.data) {
        if (dayjs(key).isBetween(lastFiftyWeeks, today, "day")) {
          dateForPush.push({
            date: dayjs(key).format(format),
            countOfContributions: response.data[key],
          });
        }
      }

      let startToday = dateForPush[0].date;
 
      function daysPassedSince(dateString) {

        const [year, month, day] = dateString.split("-").map(Number);
    
 
        const inputDate = new Date(year, month - 1, day);
        const currentDate = new Date();
 
        const timeDifference = currentDate - inputDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
        return daysDifference;
    }
       let pass = daysPassedSince(startToday) + 1;
       let missed = pass % 7;

       if(missed !== 0){
        missed =  7 - missed;
       }

    

      for (let index = 0; index < pass + missed; index++) {
        let current = startToday;
        const result = dateForPush.find((element) => element.date === current);

        if(result !== undefined){
          wholeTime[index] = result;
        }
        else{
          wholeTime[index] = { date: current,countOfContributions: 0}
        }
        startToday = nextDay(current)

      }
    
      setCalendarData(dateForPush);

    } catch (e) {
      console.log(e);
    }
  };

  
  useEffect(() => {
    getCalendar();
  }, []);

  return (
    <>
      <main>
        <ul className="weekday">
          <li>Пн</li>
          <li></li>
          <li>Ср</li>
          <li></li>
          <li>Пт</li>
          <li></li>
          <li></li>
        </ul>
        <div className="mainBoard">
          {wholeTime.map((item, index) => (
            <GridCell key={index} contributionsData={item}></GridCell>
          ))}
        </div>
        <ul className="month">
         {listOfOrderedMonth.map((item,index) =><li key={index}>{item}</li>)}
        </ul>
      </main>
    </>
  );
}

export default App;
