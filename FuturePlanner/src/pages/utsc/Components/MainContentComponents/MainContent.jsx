import './MainContent.css'
import Body from './BodyComponents/Body'

function MaintContent(props) {

  return (
    <div className='Main-Wrapper'>
      <Body TimeTablesCards = {props.TimeTablesCards} 
            activeDND = {props.activeDND} 
            addTimeTableCard={props.addTimeTableCard}
            updateTimeTableCardName = {props.updateTimeTableCardName}
            deleteObject={props.deleteObject}
            LoaderFuncs={props.LoaderFuncs}
            TimeTableName={props.TimeTableName}
            TimeTableNames={props.TimeTableNames}/>
    </div>
  )
}

export default MaintContent

