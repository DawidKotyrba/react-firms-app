import React, { Component } from 'react';
import axios from 'axios';
import FirmsTable from './FirmsTable';
import Pagination from './Pagination';
import FilterForm from './FilterForm';

class FirmsData extends Component {

    constructor() {

        super();

        this.state = {
            firmsNames: [],
            filtredFirmsNames: [],
            currentFirms: [],

            currentPage: 1,
            firmsPerPage: 10,

            isToggleOn: true,
        };

    };

    handleClickId() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn,
        }));
    };


    /* Function to sort */


    sortIncomesData = (a, b) => {
        if (a.date < b.date) {
            return -1;
        };
        if (a.date > b.date) {
            return 1;
        };
        return 0;
    };


    /* Change firms per page to window width */


    checkWindowWidth = () => {
        let width = window.innerWidth;
        if (width <= 433) {
            this.setState({ firmsPerPage: 1 });
        } else if (width <= 575) {
            this.setState({ firmsPerPage: 2 });
        } else if (width <= 855) {
            this.setState({ firmsPerPage: 3 });
        } else {
            this.setState({ firmsPerPage: 10 });
        }
        this.paginate(1)
    };


    /* Geting data from API */


    getIncomes = async firms => {


        let incomes = [];
        await Promise.all(firms.map(firm =>
            axios.get(`https://recruitment.hal.skygate.io/incomes/` + firm.id).then(response => {
                incomes.push(response.data);
            })
        ));
        return incomes;

    };


    /* Calculation of values */


    round = (n, k) => {
        let factor = Math.pow(10, k + 1);
        n = Math.round(Math.round(n * factor) / 10);
        return n / (factor / 10);
    };


    totalIncomesValue = incomes => {

        let valueSum = 0;

        for (let i = 0; i < incomes.length; i++) {
            valueSum += parseFloat(incomes[i].value);
        };
        this.setState({ valueSum: valueSum });
        return this.round(valueSum, 2);
    };


    avgIncomesValue = incomes => {
        let valueAvg = 0;

        valueAvg = this.state.valueSum / incomes.length;

        return this.round(valueAvg, 2);
    };


    lastMonthValue = incomes => {
        incomes.sort(this.sortIncomesData);

        let last = incomes[incomes.length - 1].date.substring(7, 0);

        const lastMonthSum = incomes.filter(i => {
            const date = i.date.substr(0, 7);

            return date.substring(7, 0) === last;
        }).reduce((prev, curr) => prev + parseFloat(curr.value), 0);

        return this.round(lastMonthSum, 2);
    };


    /* Preloading */


    preloading = () => {
        const loadingDiv = document.createElement("div");
        loadingDiv.id = 'loader';
        loadingDiv.innerHTML = "LOADING";
        document.body.appendChild(loadingDiv);
    };


    /* Getting incomes data */


    componentDidMount() {

        this.preloading()

        axios.get(`https://recruitment.hal.skygate.io/companies`)
            .then(res => {
                const firmsData = res.data;

                let firmsWithData = [];

                this.getIncomes(firmsData).then(incomesObj => {

                    for (let i = 0; i < firmsData.length; i++) {
                        firmsData[i].incomes = incomesObj[i].incomes;
                        firmsData[i].sumIncomesValue = this.totalIncomesValue(incomesObj[i].incomes);
                        firmsData[i].avgIncomesValue = this.avgIncomesValue(incomesObj[i].incomes);
                        firmsData[i].lastMonthSumIncomesValue = this.lastMonthValue(incomesObj[i].incomes);

                        firmsWithData.push(firmsData[i]);
                    };

                    this.setState({ firmsNames: firmsWithData });
                    this.setState({ filtredFirmsNames: firmsWithData });

                    this.setState({ clickedBarNumber: 4 });

                });

                this.paginate(1);

            });

        this.checkWindowWidth();
        window.addEventListener("resize", this.checkWindowWidth);

    };


    /* Sorting array */


    dynamicSort = property => {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        };
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    };


    sortFunctionBy = whatSort => {
        if (this.state.isToggleOn) {
            this.setState({ filtredFirmsNames: this.state.filtredFirmsNames.sort(this.dynamicSort(whatSort.target.id)) });
            this.handleClickId();
        } else {
            this.setState({ filtredFirmsNames: this.state.filtredFirmsNames.sort(this.dynamicSort("-" + whatSort.target.id)) });
            this.handleClickId();
        };
    };


    /* Pagination */


    paginate = pageNumber => {
        this.setState({
            currentPage: pageNumber,
            indexOfLastFirm: pageNumber * this.state.firmsPerPage,
            indexOfFirstFirm: pageNumber * this.state.firmsPerPage - this.state.firmsPerPage
        });
    };


    moveBarLeft = () => {
        if (this.state.clickedBarNumber === 4) {

        } else {
            this.setState({ clickedBarNumber: this.state.clickedBarNumber - 1 });
        };
    };


    moveBarRight = () => {
        if (this.state.clickedBarNumber === Math.round(this.state.filtredFirmsNames.length / this.state.firmsPerPage - 1)) {

        } else {
            this.setState({ clickedBarNumber: this.state.clickedBarNumber + 1 });
        };
    };


    /* Input filter */


    filtrFirms = e => {
        this.setState({})
        let filteredArray = this.state.firmsNames.filter(obj => {
            return obj.city.toUpperCase().includes(e.target.value.toUpperCase()) || obj.name.toUpperCase().includes(e.target.value.toUpperCase())
        });

        this.setState({
            filtredFirmsNames: filteredArray,
        });
        this.paginate(1)
    };


    render() {

        return (
            <div className="page-container" >
                <FilterForm filtrFirms={this.filtrFirms} />
                <FirmsTable
                    first={this.state.indexOfFirstFirm}
                    last={this.state.indexOfLastFirm}
                    sort={this.sortFunctionBy}
                    filtredFirms={this.state.filtredFirmsNames} />
                <Pagination
                    filtredFirms={this.state.filtredFirmsNames}
                    firmsPerPage={this.state.firmsPerPage}
                    paginate={this.paginate}
                    moveBarLeft={this.moveBarLeft}
                    moveBarRight={this.moveBarRight}
                    clickedBarNumber={this.state.clickedBarNumber} />
            </div>
        );
    };
};

export default FirmsData;