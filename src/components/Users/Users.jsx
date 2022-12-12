import'./Users.scss'


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
class User {
    constructor({title, description}) {
        this.title = title;
        this.description = description;
    }
}

export default function Users({user, setUser}) {
    return (
        <div className="users" onClick={()=>setUser(user)}>
            <div className='user_image'></div>
            <div className='user_info'>
                <UserColumn column_type={"text"} column_name={"Description: "} column_info={user.description}/>
                <UserColumn column_type={"skills"} column_name={"Skills: "} column_info={user.skills_list}/>
            </div>
        </div>
    )
}