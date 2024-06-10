import './Body.css';
import TitleSection from './TitleComponents/TitleSection';
import TimeTable from './TimeTableComponents/TimeTable';

export default function Body(props){
    return <div className="Main-Body">
        <TitleSection LoaderFuncs={props.LoaderFuncs} TimeTableName={props.TimeTableName} TimeTableNames={props.TimeTableNames}/>
        <TimeTable TimeTablesCards = {props.TimeTablesCards} 
                   activeDND = {props.activeDND} 
                   addTimeTableCard={props.addTimeTableCard}
                   updateTimeTableCardName={props.updateTimeTableCardName}
                   deleteObject={props.deleteObject}/>
    </div>
}