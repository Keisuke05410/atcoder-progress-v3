import React from "react";

const VisiterHeader = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <h1 className=" font-black text-2xl m-auto">AtPro</h1>
            </div>
            <div className="flex-none">
                <a href="/login" className="btn btn-active btn-neutral m-auto">
                    Login
                </a>
            </div>
        </div>
    );
};

export default VisiterHeader;
