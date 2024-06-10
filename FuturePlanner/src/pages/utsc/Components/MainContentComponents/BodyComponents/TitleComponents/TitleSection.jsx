import './TitleSection.css'
import { useState, useId, useRef, useEffect } from 'react'

export default function TitleSection(props){

    const [TableListToggle, SetTableListToggle] = useState(false)//visibility of the list of saved planners

    const [TransitionEnable, SetTransitionEnable] = useState(false)//enables transition for the list of saved planners

    const id = useId()

    //toggles TableListToggle
    function loadPlannerHandler(){
        if(!TableListToggle) SetTransitionEnable(true)
        SetTableListToggle(x => !x)
    }

    const LoadPlannerRef = useRef(null)
    const LoadTimeTableRef = useRef(null)

    //height of the list of saved planners
    const [HeightList, SetHeightList] = useState(1000000)

    //effect that closes the list of saved planners when the user clicks outside of the list
    useEffect(() => {
        function handleClick(e) {
            if (LoadPlannerRef.current && !LoadPlannerRef.current.contains(e.target)) {
                SetTableListToggle(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    }, [])

    //function that maps the saved planners to jsx
    function MappedTimeTableCards(){
        return props.TimeTableNames.map(e => (
            <li key={e.timetablename+"-"+id} className='Load-TimeTable-Item'>
                <button className='Load-TimeTable-Button' onClick={()=>{props.LoaderFuncs.loadTImeTable(e.timetablename)
                                                                        SetTableListToggle(x=> !x)}}>
                <p>
                    {e.timetablename}                                   
                </p>
                </button>
                <button className='Delete-TimeTableSave' onClick={()=>props.LoaderFuncs.DeleteTimeTable(e.timetablename)}>
                    <div className='Delete-TimeTableSave-Cross'></div>
                </button>
            </li>
        ))
    }

    //adjusts the height of the list of saved planners
    useEffect(() => {
        if(LoadTimeTableRef.current){
            SetHeightList(LoadTimeTableRef.current.offsetHeight)
        }
    }, [TableListToggle, props.TimeTableNames.length])

    //adjust the height of the list of saved planners after the transition ends (prevents clicking on the hidden list instead of timetable cards)
    function delayedHeightAdjust(){
        if(TableListToggle){
            SetHeightList(LoadTimeTableRef.current.offsetHeight)
        }else{
            SetTransitionEnable(false)
            SetHeightList('0px')
        }
    }



    return (
        <div className='TitleSection'>
            <div className='Title-Wrapper'>
                <h1>UofT Future Planner</h1>
            </div>
            <div className='Planner-Options'>
                <input type='text' value={props.TimeTableName} onChange={(e)=>{props.LoaderFuncs.changeTimeTableName(e.target.value)}} className='TimeTable-Title' placeholder='Title Here'/>
                <div className='Option-Buttons-Wrapper'>
                    <button className='Option-Buttons Save-Planner-Button' onClick={props.LoaderFuncs.saveTimeTable}>
                        <p>
                            Save Planner
                        </p>
                    </button>
                    <div className='Load-Planner-Wrapper' ref={LoadPlannerRef}>
                        <button className='Option-Buttons Load-Planner-Button' onClick={loadPlannerHandler}>
                            <p>
                                Load Planner
                            </p>
                        </button>
                        <div className='Load-TimeTable-List-Wrapper' onTransitionEnd={delayedHeightAdjust} style={{height: HeightList}} >
                            <ul className='Load-TimeTable-List' style={{top: TableListToggle?0:`-${HeightList}px`, transition: TransitionEnable ? '0.5s' :'0s'}} ref={LoadTimeTableRef} >
                                {MappedTimeTableCards()}
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div> 
        </div>
    )
}