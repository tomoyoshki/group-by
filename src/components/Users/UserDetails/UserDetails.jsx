import { getRole } from "../../../utils/useToken";
import "./UserDetails.scss"

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export default function UserDetails({user, description, skills}) {
    const colormap = [
        "red",
        "green",
        "blue",
        "yellow",
        "purple"
    ]
    console.log(getRole())
    return (
        <div className="user_details">
            <div className="user_section">
                <div className="user_image"></div>
                <div className="title">{user}</div>
                <div className="description"></div>
            </div>
            <div className="user_description">
                <div className="wrapper">Lorem</div>
            </div>
            <div className="user_skills">
                {
                    skills.map((element, i) => {
                        var hashed_idx = hashString(element)%5
                        hashed_idx = hashed_idx < 0 ? hashed_idx + 5 : hashed_idx
                        return <span className="skill" key={`skill_${i}`} style={{backgroundColor: colormap[hashed_idx]}}>{element}</span>
                    })
                }
            </div>
            { getRole() === "student" ? <div className="user_action">
                <span>Send Request</span>
                <span>Send Invitation</span>
            </div> : <></>
            }
        </div>
    )
}