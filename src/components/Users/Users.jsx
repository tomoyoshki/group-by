import'./Users.scss'


function UserColumn({column_name, column_info}) {

    let max_length = 100
    let short_column_info = column_info.length > max_length ? column_info.substring(0, max_length) + "..." : column_info
    return (
        <div className='user_column'>
            <div className='user_column_name'>{column_name}</div>
            <div className='user_column_details'>{short_column_info}</div>
        </div>
    )
}

export default function Users() {
    return (
        <div className="users" onClick={()=>console.log("Hello")}>
            <div className='user_image'></div>
            <div className='user_info'>
                <UserColumn column_name={"Description: "} column_info={"somemting that is interesin about description"}/>
                <UserColumn column_name={"Goals: "} column_info={"somemting that is interesin about the goal"}/>
                <UserColumn column_name={"Skills: "} column_info={"somemting that is interesin about skills"}/>
                <UserColumn column_name={"Others: "} column_info={"somemting other"}/>
            </div>
        </div>
    )
}