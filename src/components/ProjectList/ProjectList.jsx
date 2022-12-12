import "./ProjectList.scss"
import Project from "../Project/Project"
import { Link } from "react-router-dom"

export default function ProjectList() {
    return (
        <div className="project_list">
            <div className="add_project">
                <Link to="/addproject">Button</Link>
            </div>
            <div className="project_section">
                <h2>Unmatched Projects</h2>
                <div className="project_table">
                    <Project name={"CS 409 Final Project"} matched={false} />
                    <Project name={"CS 425 MP Partners"} matched={false} />
                    <Project name={"CS 225 Final Projeect"} matched={false} />
                </div>
            </div>
            <div className="project_section">
                <h2>Matched Project</h2>
                <div className="project_table">
                    <Project name={"CS 498 Final Project"} matched={true} />
                </div>
            </div>
        </div>
    )
}