import "./UserDetails.scss"

export default function UserDetails({user}) {
    return (
        <div className="user_details">
            <div className="user_section">
                <div className="user_image"></div>
                <div className="title">{user}</div>
            </div>
            <div className="message_section">
                <div className="message_title">Incomming Messages</div>
            </div>
            <div className="message_section">
                <div className="message_title">Response Messages</div>
            </div>
        </div>
    )
}