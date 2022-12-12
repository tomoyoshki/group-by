import "./ProjectList.scss"
import Project from "../Project/Project"
import { Link, useNavigate } from "react-router-dom"
import { getRole, removeToken } from "../../utils/useToken"
import { useState, useEffect } from "react"
import axios from "axios"

export default function ProjectList({user_matched, user_unmatched}) {
    const nav = useNavigate()
    const [matched_team, setMatchedTeam] = useState([{
        name: "some matched project 1"
    }])
    const [unmatched_team, setUnmatchedTeam] = useState([])
    const instructor_style = getRole() === "instructor" ? {
        "width": "90vw",
        "position": "relative"
    } : {

    }

    const handleClick = (e) => {
        removeToken()
        nav('/login')
    }

    const getTeams = async () => {
        var matched_set = new Set(user_matched);
        var unmatched_set = new Set(user_unmatched);
        try {
            const res = await axios.get("http://localhost:4000/api/assignments");

            if (res.status === 404) {
                console.log("Failed to find teams")
                return null
            }

            if (res.data.data.length === 0) {
                setMatchedTeam([])
                setUnmatchedTeam([])
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

    useEffect(()=> {
        getTeams()
    }, [])
    return (
        <div className="project_list" style={instructor_style}>
            <div className="add_project">
            <Link to="/addproject" className="add_project_button">+ Add</Link>
            { getRole() === "instructor" ? <span to="/addproject" className="add_project_button" onClick={handleClick}>Sign out</span> : <></>}
            </div>
            <div className="project_section">
                {getRole().role === "student" ? <h2>Unmatched Projects</h2> : <h2>Projects</h2>}
                <div className="project_table">
                {
                    unmatched_team.map((element) => {
                        return <Project name={element.name} matched={false} assignment={element} />
                    })
                }
                </div>
            </div>
            <div className="project_section">
                {getRole().role === "student" ? <h2>Matched Projects</h2> : <></>}
                <div className="project_table">
                {
                    matched_team.map((element) => {
                        return <Project name={element.name} matched={false} assignment={element} />
                    })
                }
                </div>
            </div>
        </div>
    )
}