import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DateTimePicker from 'react-datetime-picker'

function NewlineText(props) {
    return props.items.map(str => <p>{str}</p>);
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date(),
            endTime: new Date(),
            text : [],
        };
    }

    onChangeStart = (date) => {
        console.log(date);
        this.setState({
            startTime: date,
            endTime: this.state.endTime,
        })
    }

    onChangeEnd = (date) => {
        console.log(date);
        this.setState({
            startTime: this.state.startTime,
            endTime: date,
        })
    }

    convertDate(date) {
        // Mon Mar 28 2022 02:15:41 GMT+0700 (Новосибирск, стандартное время) input
        // yyyy-mm-ddThh:mm:ss output
        let result = `${date.getFullYear()}-`;

        if (date.getMonth() + 1 > 9) {
            result += `${date.getMonth() + 1}-`;
        }
        else {
            result += `0${date.getMonth() + 1}-`;
        }

        if (date.getDate() > 9) {
            result += `${date.getDate()}T`;
        }
        else {
            result += `0${date.getDate()}T`;
        }

        if (date.getHours() > 9) {
            result += `${date.getHours()}:`;
        }
        else {
            result += `0${date.getHours()}:`;
        }

        if (date.getMinutes() > 9) {
            result += `${date.getMinutes()}:`;
        }
        else {
            result += `0${date.getMinutes()}:`;
        }

        if (date.getSeconds() > 9) {
            result += `${date.getSeconds()}`;
        }
        else {
            result += `0${date.getSeconds()}`;
        }

        return result;
    }

    handleClick = () => {
        const stTime = this.convertDate(this.state.startTime);
        const enTime =  this.convertDate(this.state.endTime);
        const minLatitude = "-90.0";
        const maxLatitude = "90.0";
        const minLongitude = -180.0;
        const maxLongitude = 108.0;
        const limit = 15;

        console.log("current state is: " + stTime + " :: " + enTime);
        if (this.state.startTime < this.state.endTime) {
            console.log("can make http request");
            //const serverUrl = "http://84.237.89.72:8080/fdsnws/";
            const serverUrl = "https://service.iris.edu/fdsnws/";
            let query = serverUrl + `event/1/query?starttime=${stTime}&endtime=${enTime}`+
                `&limit=${limit}`;

            console.log(query);

            fetch(query)
                .then(response => {
                    console.log(response);
                    if (response.status !== 200) {
                        this.setState({
                            text : [],
                        })
                        console.log("bad response code: " + response.status);
                        let error = new Error(response.statusText);
                        error.response = response;
                        throw error
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    let parser;
                    let xmlDoc;
                    if (window.DOMParser) {
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data, "text/xml");
                    }

                    let eventsInfo = [];
                    for (let i = 0; i < xmlDoc.getElementsByTagName("event").length; i++) {
                        let eventType = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
                        let eventMagnitude = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("magnitude")[0].getElementsByTagName("mag")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        let coordInfo = xmlDoc.getElementsByTagName("event")[i].getElementsByTagName("origin")[0];
                        let eventLatitude = coordInfo.getElementsByTagName("latitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        let eventLongitude = coordInfo.getElementsByTagName("longitude")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        let eventTime = coordInfo.getElementsByTagName("time")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                        eventsInfo[i] = `${eventType}\t` + `magnitude: ${eventMagnitude}\t` + `time: ${eventTime.toString()}\t` + `lat: ${eventLatitude}\t` + `lon: ${eventLongitude}\t`;
                    }

                    this.setState({
                        text: eventsInfo,
                    })
                    console.log("text is updated");
                })
                .catch((e) => {
                    console.log("Error " + e.message);
                    console.log(e.response);
                });

        }
        else {
            console.log("incorrect date, can't make request");
        }
    }

    render() {
        return (
            <div>
                <p> start time: <DateTimePicker maxDetail="second"  value={this.state.startTime} onChange={this.onChangeStart} /> </p>
                <p> end time: <DateTimePicker maxDetail="second"  value={this.state.endTime} onChange={this.onChangeEnd} /> </p>
                <p> <button onClick={this.handleClick}> get info </button> </p>
                <NewlineText items={this.state.text} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
