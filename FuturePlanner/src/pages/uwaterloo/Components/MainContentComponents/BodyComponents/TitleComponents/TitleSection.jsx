import './TitleSection.css'
import { useState, useId, useRef, useEffect } from 'react'

export default function TitleSection(props){

    const [TableListToggle, SetTableListToggle] = useState(false)

    const [TransitionEnable, SetTransitionEnable] = useState(false)//enables transition for the list of saved planners

    const id = useId()

    function loadPlannerHandler(){
        if(!TableListToggle) SetTransitionEnable(true)
        SetTableListToggle(x => !x)
    }

    const LoadPlannerRef = useRef(null)
    const LoadTimeTableRef = useRef(null)

    const [HeightList, SetHeightList] = useState(0)

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

    function MappedTimeTableCards(){
        return props.TimeTableNames.map(e => (
            <li key={e.timetablename+"-"+id} className='Load-TimeTable-Item'>
                <button className='Load-TimeTable-ButtonUW' onClick={()=>{props.LoaderFuncs.loadTImeTable(e.timetablename)
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

    useEffect(() => {
        if(LoadTimeTableRef.current){
            SetHeightList(LoadTimeTableRef.current.offsetHeight)
        }
    }, [TableListToggle, props.TimeTableNames.length])

    function delayedHeightAdjust(){
        if(TableListToggle){
            SetHeightList(LoadTimeTableRef.current.offsetHeight)
        }else{
            SetHeightList('0px')
            SetTransitionEnable(false)
        }
    }

    return (
        <div className='TitleSection'>
            <div className='Title-Wrapper-UW'>
                <h1>UW Future Planner</h1>
            </div>
            <div className='Planner-Options'>
                <input type='text' value={props.TimeTableName} onChange={(e)=>{props.LoaderFuncs.changeTimeTableName(e.target.value)}} className='TimeTable-Title' placeholder='Title Here'/>
                <div className='Option-Buttons-Wrapper'>
                    <button className='Option-ButtonsUW Save-Planner-Button' onClick={props.LoaderFuncs.saveTimeTable}>
                        <p>
                            Save Planner
                        </p>
                    </button>
                
                    <div className='Load-Planner-Wrapper' ref={LoadPlannerRef}>
                        <button className='Option-ButtonsUW Load-Planner-Button' onClick={loadPlannerHandler}>
                            <p>
                                Load Planner
                            </p>
                        </button>
                        <div className='Load-TimeTable-List-WrapperUW' onTransitionEnd={delayedHeightAdjust} style={{height: HeightList, overflow: 'auto'}} >
                            <ul className='Load-TimeTable-ListUW' style={{top: TableListToggle?0:`-${HeightList}px`, transition: TransitionEnable ? '0.5s' :'0s'}} ref={LoadTimeTableRef} >
                                <MappedTimeTableCards />
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </div> 
        </div>
    )
}