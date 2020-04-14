import React from 'react';

const Pagination = props => {

    let numberOfButtons = props.filtredFirms.length / props.firmsPerPage;
    let barNumberArray = [];

    for (let i = 0; i < numberOfButtons; i++) {
        barNumberArray.push(i + 1);
    };


    /* Check you need buttons */


    if (barNumberArray.length < 7) {


        /* fields found are not enough, render full bar */


        const fullBar = barNumberArray.map((num, i) => {

            return (
                <span className="number" key={i} onClick={() => { props.paginate(num) }}>{num}</span>
            );
        });

        return (
            <div className="numbers-bar">
                {fullBar}
            </div >
        );

    } else {


        /* there are a lot of fields found, render bar with buttons */


        const barStart = barNumberArray.slice(0, 2).map((num, i) => {

            return (
                <span className="number" key={i} onClick={() => { props.paginate(num) }}>{num}</span>
            );
        });


        const midleBar = barNumberArray.slice(props.clickedBarNumber - 2, props.clickedBarNumber + 2).map((num, i) => {

            return (
                <span className="number" key={i} onClick={() => { props.paginate(num) }}>{num}</span>
            );
        });



        return (
            <div className="numbers-bar">
                {barStart}
                <button className="number arrows" onClick={props.moveBarLeft}>&#x2190;</button>
                {midleBar}
                <button className="number arrows" onClick={props.moveBarRight}>&#x2192;</button>
            </div >
        );
    };
};

export default Pagination;