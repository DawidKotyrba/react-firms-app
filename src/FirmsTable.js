import React from 'react';

const FirmsTable = props => {

    const listItems = props.filtredFirms.slice(props.first, props.last).map((firm) => {


        /* Removing loading */


        const removeLoading = () => {
            const loadingDiv = document.getElementById('loader');
            loadingDiv.style.display = 'none';
        };

        return (
            <div className="table-row" key={firm.id} onLoad={removeLoading()}>
                <div className="id-cell">{firm.id}</div>
                <div className="item-cell">{firm.name}</div>
                <div className="item-cell">{firm.city}</div>
                <div className="item-cell">{firm.sumIncomesValue}</div>
                <div className="item-cell">{firm.avgIncomesValue}</div>
                <div className="item-cell">{firm.lastMonthSumIncomesValue}</div>
            </div>
        );

    });

    return (

        <div className="table-container" >
            <div className="table-header-row">
                <span className="id-cell-header" id='id' onClick={props.sort}>Id</span>
                <span className="item-cell-header" id='name' onClick={props.sort}>Name</span>
                <span className="item-cell-header" id='city' onClick={props.sort}>City</span>
                <span className="item-cell-header" id='sumIncomesValue' onClick={props.sort}>Sum incomses value</span>
                <span className="item-cell-header" id='avgIncomesValue' onClick={props.sort}>Avg incomses value</span>
                <span className="item-cell-header" id='lastMonthSumIncomesValue' onClick={props.sort}>Last month Sum</span>
            </div>
            {listItems}
        </div>
    );
};

export default FirmsTable;