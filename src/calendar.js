import React from 'react'
import moment from 'moment'
import testevents from './events'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/less/styles.less'
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      current_user: 'rodaan.rabang@gmail.com',
    };
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.componentDidMount = this.componentWillMount.bind(this);
  }

  componentWillMount(){
    
    fetch(`http://localhost:4000/events?email=${this.state.current_user}`)
    .then((response) => response.json())
    .then((events) => {
      console.log(events);
      const updatedEventsList = [];
      let obj = {};
      let startDate, endDate;
      for(let i = 0; i < events.length; i++){
        startDate = moment(events[i].start_date)
        endDate = moment(events[i].end_date)
        if(events[i].start_date === events[i].end_date){
          obj.addDay = true;
        }
        if(obj.addDay){
          obj = {
            id: events[i]._id,
            title: `${events[i].type} - ${events[i].employer_email}`,
            start: new Date(startDate.year(), startDate.month(), startDate.day()),
            end: new Date(endDate.year(), endDate.month(), endDate.day()),
          }
        } else {
          obj = {
            id: events[i]._id,
            title: `${events[i].type} - ${events[i].employer_email}`,
            start: new Date(startDate.year(), startDate.month(), startDate.day(), startDate.hour(), startDate.minute()),
            end: new Date(endDate.year(), endDate.month(), endDate.day(), endDate.hour(), endDate.minute()),
          }
        }
        updatedEventsList.push(obj);
      }
      this.setState({events: updatedEventsList}, function(){
        console.log(this.state.events)
      });
    });
  }
  onSelectEvent(event){
    console.log('something')
    console.log(event);
  }
  onSelectSlot(slot){
    console.log(this.state)
  }
  render(){
    console.log('rerender')
    return(
      <div>
        <BigCalendar
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
          defaultView="week"
          defaultDate={new Date()}
        />
      </div>
    )
}};

export default Calendar;