import React from 'react';

const FilterForm = props => {
    return (
        <form>
            <h2>Shearch</h2>
            <input className="search-input" type="text" onChange={props.filtrFirms} />
        </form>
    );
};

export default FilterForm;