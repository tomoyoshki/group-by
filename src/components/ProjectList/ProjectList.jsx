import "./ProjectList.scss"
import Project from "../Project/Project"
import { Link, useNavigate } from "react-router-dom"
import { getRole, getToken, removeToken } from "../../utils/useToken"
import { useState, useEffect } from "react"
import axios from "axios"

export default function ProjectList() {
    const nav = useNavigate()
    const [matched_team, setMatchedTeam] = useState([])
    const [unmatched_team, setUnmatchedTeam] = useState([])
    const [created_team, setCreatedTeam] = useState([])
    const instructor_style = getRole() === "instructor" ? {
        "width": "90vw",
        "position": "relative"
    } : {

    }

    const handleClick = (e) => {
        removeToken()
        nav('/login')
    }

    

    useEffect(()=> {
        const getTeams = async () => {
            var matched_set
            var unmatched_set
            try {
                const params = {
                    _id: getToken(),
                };
    
                const res = await axios.get("http://localhost:4000/api/users", {params: {
                    where : JSON.stringify(params)
                }});
    
                if (res.status === 404) {
                    nav("/login")
                }
    
                const user_data = res.data.data[0]
                matched_set = new Set(user_data.matched_assignment_ids);
                unmatched_set = new Set(user_data.unmatched_assignment_ids);
            } catch(e) {
                console.log(e)
            }
            try {
                const res = await axios.get("http://localhost:4000/api/assignments");
    
                if (res.status === 404) {
                    console.log("Failed to find teams")
                    return null
                }
                if (res.data.data.length === 0) {
                    setMatchedTeam([])
                    setUnmatchedTeam([])
                    console.log("Returned")
                    return
                }
    
                var local_unmatched = []
                var local_matched = []
                res.data.data.forEach(element => {
                    if (unmatched_set.has(element._id)) {
                        local_unmatched.push(element)
                    } else if (matched_set.has(element._id)) {
                        local_matched.push(element)
                    }
                });
    
                setMatchedTeam(local_matched)
                setUnmatchedTeam(local_unmatched)
    
            } catch(e) {
                console.log(e)
            }
        }
    
        const getInstructorTeams = async () => {
            try {
                const params = {
                    instructor_id: getToken()
                }
                const res = await axios.get("http://localhost:4000/api/assignments", {params: {
                    where: JSON.stringify(params)
                }});
    
                if (res.status === 404) {
                    console.log("Failed to find teams")
                    return null
                }
    
                if (res.data.data.length === 0) {
                    setCreatedTeam([])
                    return
                }
    
                setCreatedTeam(res.data.data)
    
            } catch(e) {
                console.log(e)
            }
        }
        getRole() === "student" ? getTeams() : getInstructorTeams()
    }, [nav])

    useEffect(()=> {
        // console.log("team, effect: ", created_team)
    }, [created_team])

    useEffect(()=> {
        // console.log("student effect: ", unmatched_team, matched_team)
    }, [unmatched_team, matched_team])

    const student_project_section = () => {
        return (
            <>
                <div className="project_section">
                <h2>Unmatched Projects</h2>
                    <div className="project_table">
                    {
                        unmatched_team.map((element, i) => {
                            return <Project key={i} name={element.assignment_name} matched={false} assignment={element}/>
                        })
                    }
                    </div>
                </div>
                <div className="project_section">
                    <h2>Matched Projects</h2>
                    <div className="project_table">
                    {
                        matched_team.map((element, i) => {
                            return <Project key={i} name={element.assignment_name} matched={false} assignment={element} />
                        })
                    }
                    </div>
                </div>
            </>
        )
    }

    const instructor_project_section = () => {
        return (
            <>
                <div className="project_section">
                    <h2>Projects</h2>
                    <div className="project_table">
                    {
                        created_team.map((element, i) => {
                            return <Project key={i} name={element.assignment_name} matched={false} assignment={element}/>
                        })
                    }
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="project_list" style={instructor_style}>
            <div className="add_project">
            <Link to="/addproject" className="add_project_button">+ Add</Link>
            { getRole() === "instructor" ? <span to="/addproject" className="add_project_button" onClick={handleClick}>Sign out</span> : <></>}
            </div>
            {getRole() === "instructor" ? instructor_project_section() : student_project_section()}
        </div>
    )
}