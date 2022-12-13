import { useEffect, useState } from 'react';
import'./Users.scss'
import { getToken } from '../../utils/useToken';
import axios from 'axios';


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


function UserColumn({column_type, column_name, column_info}) {
    let max_length = 50
    let short_column_info = column_info.length > max_length ? column_info.substring(0, max_length) + "..." : column_info
    const colormap = [
        "#1B0930",
        "#0A3009",
        "#380809",
        "#050B30",
        "#48370B"
    ]

    let infos = []
    if (column_type === "skills") {
        column_info.forEach((element, i) => {
            var hashed_idx = hashString(element)%5
            hashed_idx = hashed_idx < 0 ? hashed_idx + 5 : hashed_idx
            infos.push(
                <span className="skill" key={`skill_${i}`} style={{backgroundColor: colormap[hashed_idx]}}>{element}</span>)
        })
    } else {
        infos = short_column_info
    }
    return (
        <div className='user_column'>
            <div className='user_column_name'>{column_name}</div>
            <div className='user_column_details'>
                {infos}
            </div>
        </div>
    )
}



export default function Users({user, setUser, project}) {
    const [same_group, setSameGoup] = useState(false)
    const checkGroup = async () => {
        var this_user_param = {
            user_id: getToken(),
            assignment_id: project._id
        }

        var target_user_param = {
            user_id: user.user_id,
            assignment_id: project._id
        }

        var this_res = await axios.get("http://localhost:4000/api/infos/", {params: {
            where: JSON.stringify(this_user_param)
        }})

        var target_res = await axios.get("http://localhost:4000/api/infos/", {params: {
            where: JSON.stringify(target_user_param)
        }})

        var this_team_id = this_res.data.data[0].team_id
        var target_team_id = target_res.data.data[0].team_id

        if (this_team_id === target_team_id) {
            setSameGoup(true)
        }
    }
    useEffect(()=> {
        checkGroup()
    })

    const bg_color = {
        background: "linear-gradient(141.84deg, rgba(151, 172, 253, 0.47) 11.81%, rgba(214, 96, 255, 0.35) 92.32%)",
        boxShadow: "inset 0px 1px 4px rgba(231, 226, 226, 0.25)"
    }

    return (
        <div className="users" onClick={()=>setUser(user)} style={same_group ? bg_color : {}}>
            <div className='user_image'></div>
            <div className='user_info'>
                <UserColumn column_type={"text"} column_name={"Description: "} column_info={user.description}/>
                <UserColumn column_type={"skills"} column_name={"Skills: "} column_info={user.skills_list}/>
            </div>
        </div>
    )
}