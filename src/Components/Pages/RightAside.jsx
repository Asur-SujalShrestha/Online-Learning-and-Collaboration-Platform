import React from 'react'

function RightAside() {
    return (
        <div>
            <div className="sidebar right-sidebar">
                <h2 className="subtitle">Groups</h2>
                <ul className="groups-list">
                    {["Data and Web", "Advance Programming", "Advance Database", "AI"].map(
                        (group, index) => (
                            <li key={index} className="group-item">
                                <div className="avatar"></div>{group}
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    )
}

export default RightAside
